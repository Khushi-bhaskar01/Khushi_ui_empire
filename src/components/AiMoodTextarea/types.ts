export type Emotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'calm' | 'neutral';

export interface EmotionData {
  emotion: Emotion;
  confidence: number;
  timestamp: number;
}

export interface AiMoodTextareaProps {
  /** Initial value for the textarea */
  initialValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Callback for when text changes */
  onChange?: (value: string) => void;
  /** Callback for when emotion changes */
  onEmotionChange?: (emotion: EmotionData) => void;
  /** Whether to enable voice feedback */
  enableVoiceFeedback?: boolean;
  /** Whether to show the mood chart */
  showMoodChart?: boolean;
  /** Number of milliseconds to debounce API calls */
  debounceTime?: number;
  /** Minimum characters required before emotion detection starts */
  minCharacters?: number;
  /** Whether to use OpenAI instead of Hugging Face */
  useOpenAI?: boolean;
  /** Custom API key for emotion detection */
  apiKey?: string;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}