import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { Mic, MicOff, Heart, Sparkles, CheckCircle2, Volume2 } from 'lucide-react';

const STORY_PROMPTS = [
  {
    topic: 'Childhood Spring in the Tea Garden',
    prompt: 'Do you remember the fresh green tea leaves growing in the garden after the first gentle spring rains?',
    emoji: '🌿'
  },
  {
    topic: 'Singing with Family on the Verandah',
    prompt: 'Tell us about a favorite song or prayer that you and your family loved to sing together in the evenings.',
    emoji: '🎶'
  },
  {
    topic: 'Making Bihu Pitha and Sweets',
    prompt: 'What was your favorite memory of sitting by the kitchen hearth making delicious sweets with loved ones?',
    emoji: '🥟'
  }
];

export const StoryCircle: React.FC = () => {
  const [promptIdx, setPromptIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');

  const currentStory = STORY_PROMPTS[promptIdx];

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRec = (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (e: any) => {
            const transcript = Array.from(e.results)
              .map((res: any) => res[0].transcript)
              .join(' ');
            setRecordedText(transcript);
          };
          rec.start();
        } catch {
          // fallback simulated recording
        }
      } else {
        setRecordedText('Speaking warmly into the microphone... (Voice memory captured)');
      }
    } else {
      setIsRecording(false);
    }
  };

  return (
    <GameShell
      gameId="storyCircle"
      title="Family Story Circle"
      category="Memory"
      instructions="There are no wrong answers! Speak or listen to this lovely memory prompt."
      audioPrompt={currentStory.prompt}
    >
      {({ onComplete }) => {
        const handleFinish = () => {
          onComplete(100);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Reminiscence & Oral Storytelling</span>
              <span>Prompt {promptIdx + 1} of {STORY_PROMPTS.length}</span>
            </div>

            {/* Prompt Box */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-3xl p-8 border border-purple-100 text-center space-y-4">
              <div className="text-5xl">{currentStory.emoji}</div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-xl shadow-xs">
                {currentStory.topic}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 max-w-xl mx-auto leading-snug">
                "{currentStory.prompt}"
              </h3>
            </div>

            {/* Recording interaction */}
            <div className="text-center space-y-4">
              <button
                onClick={handleToggleRecord}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 active:scale-95'
                }`}
              >
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
              <div className="text-sm font-bold text-gray-700">
                {isRecording ? 'Listening to your story... Tap to pause' : 'Tap the microphone to share your memories'}
              </div>

              {recordedText && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-800 max-w-md mx-auto italic">
                  "{recordedText}"
                </div>
              )}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleFinish}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-base shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Complete Story Circle Session →
              </button>
            </div>
          </div>
        );
      }}
    </GameShell>
  );
};
