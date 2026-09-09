import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface PatternRound {
  sequence: string[];
  options: string[];
  correctAnswer: string;
}

const PATTERNS: PatternRound[] = [
  {
    sequence: ['🌺', '💠', '🌺', '💠', '?'],
    options: ['🌺', '💠', '🏮', '🍵'],
    correctAnswer: '🌺'
  },
  {
    sequence: ['🌿', '🫖', '🍵', '🌿', '🫖', '?'],
    options: ['🫖', '🍵', '🌿', '🌸'],
    correctAnswer: '🍵'
  },
  {
    sequence: ['🥁', '🪈', '🥁', '🪈', '?'],
    options: ['🥁', '🪈', '🔔', '🎺'],
    correctAnswer: '🥁'
  }
];

export const PatternBuilder: React.FC = () => {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentPattern = PATTERNS[round % PATTERNS.length];

  return (
    <GameShell
      gameId="patternBuilder"
      title="Pattern Builder"
      category="Attention"
      instructions="Look at the repeating pattern and pick the piece that comes next."
    >
      {({ onComplete }) => {
        const handlePick = (choice: string) => {
          setSelected(choice);
          const isCorrect = choice === currentPattern.correctAnswer;
          const newScore = isCorrect ? score + 1 : score;
          setScore(newScore);

          setTimeout(() => {
            if (round + 1 < PATTERNS.length) {
              setRound(r => r + 1);
              setSelected(null);
            } else {
              const accuracy = Math.round((newScore / PATTERNS.length) * 100);
              onComplete(accuracy);
            }
          }, 1200);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Pattern {round + 1} of {PATTERNS.length}</span>
              <span>Visual Pattern Logic</span>
            </div>

            {/* Pattern Strip */}
            <div className="bg-indigo-50/60 rounded-3xl p-8 border border-indigo-100 flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
              {currentPattern.sequence.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-sm ${
                    item === '?'
                      ? 'bg-indigo-600 text-white font-black border-2 border-dashed border-indigo-300 animate-pulse'
                      : 'bg-white border-2 border-indigo-100'
                  }`}
                >
                  {item === '?' && selected ? selected : item}
                </div>
              ))}
            </div>

            {/* Options */}
            <div>
              <div className="text-center font-bold text-gray-700 text-sm mb-4">
                What comes next in place of the question mark?
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
                {currentPattern.options.map((opt, idx) => {
                  const isChosen = selected === opt;
                  const isCorrect = opt === currentPattern.correctAnswer;

                  let border = 'border-gray-200 bg-gray-50 hover:bg-indigo-50';
                  if (selected !== null) {
                    if (isCorrect) border = 'border-emerald-500 bg-emerald-100 font-bold';
                    else if (isChosen) border = 'border-rose-500 bg-rose-100';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selected !== null}
                      onClick={() => handlePick(opt)}
                      className={`p-6 rounded-2xl border-2 text-4xl text-center transition-all cursor-pointer flex items-center justify-center min-h-[90px] ${border}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    </GameShell>
  );
};
