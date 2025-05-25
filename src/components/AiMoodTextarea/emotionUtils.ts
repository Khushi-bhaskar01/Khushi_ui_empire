import type { Emotion, EmotionData } from './types';

// Mapping emotions to emojis
export const emotionToEmoji: Record<Emotion, string> = {
  joy: '😄',
  sadness: '😢',
  anger: '😠',
  fear: '😨',
  calm: '😌',
  neutral: '😐',
};

// Mapping emotions to CSS gradient class names
export const emotionToGradientClass: Record<Emotion, string> = {
  joy: 'bg-joy',
  sadness: 'bg-sadness',
  anger: 'bg-anger',
  fear: 'bg-fear',
  calm: 'bg-calm',
  neutral: 'bg-neutral',
};

// Messages for voice feedback
export const emotionToMessage: Record<Emotion, string> = {
  joy: 'You sound happy!',
  sadness: 'You seem sad.',
  anger: 'You sound angry.',
  fear: 'You seem afraid.',
  calm: 'You sound calm and collected.',
  neutral: 'Your tone is neutral.',
};

// Default emotion
export const defaultEmotion: EmotionData = {
  emotion: 'neutral',
  confidence: 1,
  timestamp: Date.now(),
};

// Enhanced mock emotion detection with more keywords and context awareness
export const mockDetectEmotion = async (text: string): Promise<EmotionData> => {
  const keywords = {
    joy: [
      'happy', 'joy', 'excited', 'great', 'excellent', 'love', 'amazing',
      'wonderful', 'delighted', 'fantastic', 'blessed', 'grateful', 'thrilled',
      'awesome', 'perfect', '❤️', '😊', '🥰', 'yay', 'woohoo'
    ],
    sadness: [
      'sad', 'unhappy', 'depressed', 'miserable', 'crying', 'upset',
      'heartbroken', 'lonely', 'disappointed', 'hurt', 'pain', 'grief',
      'sorry', 'regret', 'miss', 'lost', 'alone', '😢', '😭', '💔'
    ],
    anger: [
      'angry', 'mad', 'furious', 'annoyed', 'hate', 'frustrated',
      'rage', 'outraged', 'irritated', 'fed up', 'sick of', 'terrible',
      'awful', 'stupid', 'idiot', 'unfair', 'wrong', '😠', '😡', '🤬'
    ],
    fear: [
      'afraid', 'scared', 'frightened', 'terrified', 'nervous', 'worried',
      'anxious', 'panic', 'horror', 'dread', 'stress', 'concerned',
      'uneasy', 'scared', 'help', 'dangerous', 'threat', '😨', '😰', '😱'
    ],
    calm: [
      'calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'chill',
      'content', 'quiet', 'gentle', 'steady', 'balanced', 'composed',
      'zen', 'mindful', 'ease', 'rest', 'peace', '😌', '😊', '🧘'
    ]
  };

  const negationWords = ['not', 'no', "don't", 'never', "wasn't", "isn't", "aren't", "haven't"];
  const intensifiers = ['very', 'really', 'so', 'extremely', 'totally', 'absolutely', 'completely'];

  const lowercaseText = text.toLowerCase();
  const words = lowercaseText.split(/\s+/);

  // Count matches for each emotion with context awareness
  const counts: Record<Emotion, number> = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    calm: 0,
    neutral: 0,
  };

  // Check each word in context
  words.forEach((word, index) => {
    const hasNegation = words
      .slice(Math.max(0, index - 3), index)
      .some(prev => negationWords.includes(prev));

    const hasIntensifier = index > 0 && intensifiers.includes(words[index - 1]);

    Object.entries(keywords).forEach(([emotion, emotionWords]) => {
      if (emotionWords.includes(word)) {
        if (hasNegation) {
          if (emotion === 'joy') {
            counts.sadness += 1;
          } else if (emotion === 'calm') {
            counts.anger += 0.5;
            counts.fear += 0.5;
          }
        } else {
          counts[emotion as Emotion] += hasIntensifier ? 2 : 1;
        }
      }
    });
  });

  // Determine the dominant emotion
  let maxCount = 0;
  let detectedEmotion: Emotion = 'neutral';

  Object.entries(counts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count;
      detectedEmotion = emotion as Emotion;
    }
  });

  const totalCounts = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const confidence = maxCount === 0
    ? 0.5
    : Math.min(0.5 + (maxCount / totalCounts) * 0.5, 1);

  if (maxCount === 0 || confidence < 0.4) {
    return {
      emotion: 'neutral',
      confidence: 0.5,
      timestamp: Date.now(),
    };
  }

  return {
    emotion: detectedEmotion,
    confidence,
    timestamp: Date.now(),
  };
};

// Function to detect emotion using Hugging Face API
export const detectEmotionHuggingFace = async (
  text: string,
  apiKey?: string
): Promise<EmotionData> => {
  try {
    if (!apiKey || process.env.NODE_ENV === 'development') {
      return mockDetectEmotion(text);
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error from Hugging Face API: ${response.statusText}`);
    }

    const data = await response.json();

    const emotionMap: Record<string, Emotion> = {
      joy: 'joy',
      sadness: 'sadness',
      anger: 'anger',
      fear: 'fear',
      surprise: 'joy',
      love: 'joy',
      neutral: 'neutral',
    };

    let highestScore = 0;
    let detectedEmotion: Emotion = 'neutral';

    data[0].forEach((item: { label: string; score: number }) => {
      if (item.score > highestScore) {
        highestScore = item.score;
        detectedEmotion = emotionMap[item.label.toLowerCase()] || 'neutral';
      }
    });

    return {
      emotion: detectedEmotion,
      confidence: highestScore,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error detecting emotion with Hugging Face:', error);
    return mockDetectEmotion(text);
  }
};

// Function to detect emotion using OpenAI API
export const detectEmotionOpenAI = async (
  text: string,
  apiKey?: string
): Promise<EmotionData> => {
  try {
    if (!apiKey || process.env.NODE_ENV === 'development') {
      return mockDetectEmotion(text);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an emotion detection system. Analyze the text and respond with exactly one word representing the primary emotion: joy, sadness, anger, fear, calm, or neutral. Consider context, intensity, and negative phrases.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error from OpenAI API: ${response.statusText}`);
    }

    const data = await response.json();
    const emotionText = data.choices[0].message.content.trim().toLowerCase();

    const validEmotions: Emotion[] = ['joy', 'sadness', 'anger', 'fear', 'calm', 'neutral'];
    let detectedEmotion: Emotion = 'neutral';

    for (const emotion of validEmotions) {
      if (emotionText.includes(emotion)) {
        detectedEmotion = emotion;
        break;
      }
    }

    return {
      emotion: detectedEmotion,
      confidence: 0.85,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error detecting emotion with OpenAI:', error);
    return mockDetectEmotion(text);
  }
};

// Speech synthesis for voice feedback
export const speakEmotionFeedback = (emotion: Emotion) => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const message = emotionToMessage[emotion];
  const utterance = new SpeechSynthesisUtterance(message);

  utterance.volume = 0.8;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};
