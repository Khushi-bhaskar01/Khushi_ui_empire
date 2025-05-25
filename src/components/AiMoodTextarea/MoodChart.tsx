import React, { useMemo } from 'react';
import type { EmotionData } from './types';
import './MoodChart.css';

interface MoodChartProps {
  emotionHistory: EmotionData[];
  className?: string;
}

const emotionToPosition: Record<string, number> = {
  joy: 20,      // Adjusted positions for better visibility
  calm: 35,     
  neutral: 50,  
  fear: 65,     
  sadness: 75,  
  anger: 85,    
};

const MoodChart: React.FC<MoodChartProps> = ({ emotionHistory, className = '' }) => {
  if (emotionHistory.length < 2) {
    return (
      <div className={`mood-chart-empty ${className}`}>
        Not enough data to display mood chart
      </div>
    );
  }

  const chartData = useMemo(() => {
    const recentHistory = emotionHistory.slice(-10);
    const startTime = recentHistory[0].timestamp;
    const endTime = recentHistory[recentHistory.length - 1].timestamp;
    const timeRange = endTime - startTime;
    
    return recentHistory.map((data, index) => {
      const xPercent = timeRange === 0 
        ? index * (100 / (recentHistory.length - 1)) 
        : ((data.timestamp - startTime) / timeRange) * 100;
      
      return { 
        x: Math.min(99, Math.max(1, xPercent)), // Ensure points stay within bounds
        y: emotionToPosition[data.emotion],
        emotion: data.emotion 
      };
    });
  }, [emotionHistory]);

  const path = useMemo(() => {
    if (chartData.length < 2) return '';
    return chartData.map((point, i) => {
      return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ');
  }, [chartData]);

  return (
    <div className={`mood-chart-container ${className}`}>
      <svg
        className="mood-chart-svg" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {/* Background grid lines */}
        <line x1="0" y1="20" x2="100" y2="20" className="grid-line" />
        <line x1="0" y1="50" x2="100" y2="50" className="grid-line" />
        <line x1="0" y1="85" x2="100" y2="85" className="grid-line" />
        
        {/* Emotion path */}
        <path
          d={path}
          className="emotion-path"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        {/* Data points */}
        {chartData.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2.5"  // Slightly larger points
            className={`data-point data-point-${point.emotion}`}
          />
        ))}
      </svg>
      
      {/* Y-axis labels */}
      <div className="y-axis-label y-axis-label-top">Joy</div>
      <div className="y-axis-label y-axis-label-middle">Neutral</div>
      <div className="y-axis-label y-axis-label-bottom">Anger</div>
    </div>
  );
};

export default MoodChart;