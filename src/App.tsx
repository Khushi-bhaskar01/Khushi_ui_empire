import { useState } from "react";
import AiMoodTextarea from "./components/AiMoodTextarea";
import type { EmotionData } from "./components/AiMoodTextarea/types";
import { BrainCog } from "lucide-react";
import "./App.css"; // Importing separate CSS file

function App() {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);

  const handleEmotionChange = (emotion: EmotionData) => {
    setCurrentEmotion(emotion);
  };

  return (
    <div className="app-container">
      <header className="header">
        <BrainCog className="icon" />
        <h1>AI Mood Textarea</h1>
      </header>

      <main className="main-content">
        <div className="description">
          <h2>Emotion Detection Demo</h2>
          <p>
            Start typing to see the AI detect your emotions in real-time. Try expressing joy, sadness, anger, fear, or calmness.
          </p>
          <AiMoodTextarea
            enableVoiceFeedback={true}
            showMoodChart={true} 
            onEmotionChange={handleEmotionChange}
            minCharacters={5}
            debounceTime={800}
          />
        </div>

        {currentEmotion && (
          <div className="emotion-details">
            <h3>Current Emotion Details:</h3>
            <ul>
              <li><strong>Emotion:</strong> {currentEmotion.emotion}</li>
              <li><strong>Confidence:</strong> {(currentEmotion.confidence * 100).toFixed(1)}%</li>
              <li><strong>Last updated:</strong> {new Date(currentEmotion.timestamp).toLocaleTimeString()}</li>
            </ul>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>This component uses a mock AI detection in demo mode. Provide an API key for real detection.</p>
      </footer>
    </div>
  );
}

export default App;