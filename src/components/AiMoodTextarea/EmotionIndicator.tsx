import React from 'react';
import './EmotionIndicator.css';
import type { Emotion } from './types';
import { emotionToEmoji } from './emotionUtils';

interface EmotionIndicatorProps {
  emotion: Emotion;
  confidence: number;
  className?: string;
}

const EmotionIndicator: React.FC<EmotionIndicatorProps> = ({ 
  emotion, 
  confidence,
  className = '' 
}) => {
  let pulseClass = '';
  if (confidence > 0.7) {
    pulseClass = 'pulse-fast';
  } else if (confidence > 0.5) {
    pulseClass = 'pulse-slow';
  }

  let opacityClass = '';
  if (confidence > 0.8) {
    opacityClass = 'opacity-100';
  } else if (confidence > 0.6) {
    opacityClass = 'opacity-90';
  } else if (confidence > 0.4) {
    opacityClass = 'opacity-75';
  } else {
    opacityClass = 'opacity-60';
  }

  return (
    <div
      className={`emotion-indicator-wrapper ${className}`}
      title={`Detected emotion: ${emotion} (${Math.round(confidence * 100)}% confidence)`}
    >
      <div className={`emotion-emoji ${pulseClass} ${opacityClass}`}>
        {emotionToEmoji[emotion]}
      </div>
    </div>
  );
};

export default EmotionIndicator;
