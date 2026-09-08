import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { Hand, Smile, Sparkles, X, Check } from 'lucide-react';

interface SimonCommand {
  hasPrefix: boolean; // CareCue says
  action: string;
  emoji: string;
}

const COMMANDS: SimonCommand[] = [
  { hasPrefix: true, action: 'Smile warmly', emoji: '😊' },
  { hasPrefix: false, action: 'Clap hands twice', emoji: '👏' },
  { hasPrefix: true, action: 'Wave hello', emoji: '👋' },
  { hasPrefix: false, action: 'Touch forehead', emoji: '✋' },
  { hasPrefix: true, action: 'Nod gently', emoji: '😌' }
];

export const SimonSays: React.FC = () => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentCmd = COMMANDS[round % COMMANDS.length];
  const promptText = currentCmd.hasPrefix ? `CareCue says: ${currentCmd.action}` : `${currentCmd.action}`;

  return (
    <GameShell
      gameId="simonSays"
      title="Simon Says (CareCue Edition)"
      category="Attention"
      instructions="Only perform the action if the prompt says 'CareCue says...'. If it doesn't say CareCue, choose 'Ignore / Don't Do It'."
      audioPrompt={promptText}
    >
      {({ onComplete }) => {
        const handleChoice = (actionTaken: boolean) => {
          const isCorrect = currentCmd.hasPrefix ? actionTaken : !actionTaken;
          const newScore = isCorrect ? score + 1 : score;
          setScore(newScore);
          setFeedback(isCorrect ? 'Correct!' : 'Oops! Remember: Only if CareCue says so.');

          setTimeout(() => {
            setFeedback(null);
            if (round + 1 < COMMANDS.length) {
              setRound(r => r + 1);
            } else {
              const accuracy = Math.round((newScore / COMMANDS.length) * 100);
              onComplete(accuracy);
            }
          }, 1200);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Command {round + 1} of {COMMANDS.length}</span>
              <span>Attention & Response Inhibition</span>
            </div>

            {/* Main Command Box */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 text-center space-y-4">
              <div className="text-6xl">{currentCmd.emoji}</div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900">
                {promptText}
              </div>
            </div>

            {feedback && (
              <div className="text-center font-bold text-base py-2 text-indigo-700 animate-fade-in">
                {feedback}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                disabled={feedback !== null}
                className="p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 cursor-pointer min-h-[64px]"
              >
                <Check size={24} />
                Do the Action
              </button>

              <button
                onClick={() => handleChoice(false)}
                disabled={feedback !== null}
                className="p-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-lg flex items-center justify-center gap-3 cursor-pointer min-h-[64px]"
              >
                <X size={24} />
                Ignore (CareCue didn't say it)
              </button>
            </div>
          </div>
        );
      }}
    </GameShell>
  );
};
