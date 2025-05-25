
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './emotionGradients.css';
import {
  detectEmotionHuggingFace,
  detectEmotionOpenAI,
  defaultEmotion,
  speakEmotionFeedback
} from './emotionUtils';
import type { AiMoodTextareaProps, EmotionData, Emotion } from './types';
import EmotionIndicator from './EmotionIndicator';
import MoodChart from './MoodChart';

// Mapping emotion to gradient CSS classes (defined in emotionGradients.css)
const emotionToGradientClass: Record<Emotion, string> = {
  joy: 'bg-joy',
  sadness: 'bg-sadness',
  anger: 'bg-anger',
  fear: 'bg-fear',
  calm: 'bg-calm',
  neutral: 'bg-neutral',
};

const AiMoodTextarea: React.FC<AiMoodTextareaProps> = ({
  initialValue = '',
  placeholder = 'Start typing to analyze your mood...',
  onChange,
  onEmotionChange,
  enableVoiceFeedback = false,
  showMoodChart = false,
  debounceTime = 1000,
  minCharacters = 10,
  useOpenAI = false,
  apiKey,
  disabled = false,
  className = '',
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData>(defaultEmotion);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([defaultEmotion]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const detectEmotion = useCallback(async (text: string) => {
    if (text.length < minCharacters) {
      return defaultEmotion;
    }

    setIsAnalyzing(true);

    try {
      return useOpenAI
        ? await detectEmotionOpenAI(text, apiKey)
        : await detectEmotionHuggingFace(text, apiKey);
    } catch (error) {
      console.error('Error detecting emotion:', error);
      return defaultEmotion;
    } finally {
      setIsAnalyzing(false);
    }
  }, [useOpenAI, apiKey, minCharacters]);

  const handleTextChange = useCallback((text: string) => {
    setValue(text);
    onChange?.(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (text.length < minCharacters) return;

    debounceTimerRef.current = setTimeout(async () => {
      const newEmotion = await detectEmotion(text);
      setCurrentEmotion(newEmotion);
      setEmotionHistory(prev => [...prev, newEmotion]);
      onEmotionChange?.(newEmotion);
      if (enableVoiceFeedback) {
        speakEmotionFeedback(newEmotion.emotion);
      }
    }, debounceTime);
  }, [onChange, detectEmotion, minCharacters, debounceTime, onEmotionChange, enableVoiceFeedback]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const gradientClass = emotionToGradientClass[currentEmotion.emotion];

  return (
    <div className={`w-full transition-colors duration-500 ${className}`}>
      <div className={`relative rounded-lg p-4 shadow-md ${gradientClass} transition-all duration-1000 ease-in-out`}>
        <div className="flex gap-4">
          <textarea
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              flex-1 min-h-[120px] p-3 rounded-md
              bg-white/80 dark:bg-gray-800/90
              text-gray-800 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition-all duration-200
              ${isAnalyzing ? 'opacity-70' : 'opacity-100'}
            `}
          />
          <EmotionIndicator
            emotion={currentEmotion.emotion}
            confidence={currentEmotion.confidence}
            className="self-start mt-2"
          />
        </div>

        <div className="flex justify-between text-xs mt-2 px-1">
          <span className={value.length < minCharacters ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
            {value.length < minCharacters
              ? `Type at least ${minCharacters} characters for emotion analysis`
              : `${value.length} characters`}
          </span>
          {isAnalyzing && (
            <span className="text-indigo-700 dark:text-indigo-300 animate-pulse">
              Analyzing emotion...
            </span>
          )}
        </div>

        {showMoodChart && emotionHistory.length > 1 && (
          <MoodChart emotionHistory={emotionHistory} className="mt-3" />
        )}
      </div>
    </div>
  );
};

export default AiMoodTextarea;
