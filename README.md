# AI Mood Textarea 🧠✨  
A futuristic AI-powered **emotion detection text area** built with React and TypeScript.
## Demo Video
https://github.com/Khushi-bhaskar01/Khushi_ui_empire/blob/master/AI_empire.mp4
## 🌟 Features
- 📝 **Real-time emotion detection** using AI  
- 🎨 **Modern UI with glowing futuristic aesthetic**  
- 🚀 **Optimized for performance & modularity**  
- 🔄 **Smooth animations and transitions**  
- 🛠 **Customizable & scalable component architecture**  

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | string | `''` | Initial text value |
| `placeholder` | string | `'Start typing to analyze your mood...'` | Placeholder text |
| `onChange` | function | - | Callback when text changes |
| `onEmotionChange` | function | - | Callback when emotion changes |
| `enableVoiceFeedback` | boolean | `false` | Enable voice announcements |
| `showMoodChart` | boolean | `false` | Show the mood tracking chart |
| `debounceTime` | number | `1000` | Time in ms to wait before analyzing |
| `minCharacters` | number | `10` | Min characters before analysis starts |
| `useOpenAI` | boolean | `false` | Use OpenAI instead of Hugging Face |
| `apiKey` | string | - | API key for the chosen service |
| `disabled` | boolean | `false` | Disable the textarea |
| `className` | string | `''` | Additional CSS classes |

## Emotion Categories

The component detects and visualizes six primary emotions:

- 😄 Joy - Positive, happy emotions
- 😢 Sadness - Negative, unhappy emotions
- 😠 Anger - Frustration, annoyance
- 😨 Fear - Worry, anxiety, nervousness
- 😌 Calm - Peaceful, relaxed emotions
- 😐 Neutral - No strong emotional content
- 
## API Integration

   1.**OpenAI**: Uses the ChatGPT API with a prompt to classify emotions

## Development and Testing

When no API key is provided or in development mode, the component uses a simplified mock implementation that detects emotions based on keywords.

## 🏗 Tech Stack
- **Frontend:** React, TypeScript  
- **Styling:** CSS (Custom styles, no Tailwind)  
- **Icons:** Lucide-React  
- **State Management:** React Hooks (`useState`)  
- **Bundler:** Vite  
- **Deployment:** Vercel  
- **Version Control:** Git & GitHub  

## ⚙️ Installation & Setup  
### 🔧 Prerequisites:
- **Node.js** (Latest version recommended)  
- **npm or yarn** (Package manager)  

### 📦 Install Dependencies:
```bash
git clone https://github.com/Khushi_ui_empire.git
cd my-ai-textarea
npm install
