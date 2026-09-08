import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface FestivalQ {
  title: string;
  emoji: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

const FESTIVAL_QUESTIONS: FestivalQ[] = [
  {
    title: 'Rongali / Bohag Bihu',
    emoji: '🌸',
    question: 'Which spring festival is celebrated with Kopou orchids, Dhol drums, and joyful Bihu dance?',
    options: ['Bohag Bihu (Rongali)', 'Magh Bihu (Bhogali)', 'Kati Bihu (Kongali)', 'Diwali'],
    correctIndex: 0,
    funFact: 'Celebrated in mid-April as the Assamese New Year!'
  },
  {
    title: 'Bhogali / Magh Bihu',
    emoji: '🔥',
    question: 'During which winter festival do families build Meji bonfires and make delicious Til Pitha & Laru?',
    options: ['Kati Bihu', 'Magh Bihu (Bhogali)', 'Holi', 'Janmashtami'],
    correctIndex: 1,
    funFact: 'Magh Bihu marks the end of harvest with community feasts.'
  },
  {
    title: 'Kati Bihu / Kongali',
    emoji: '🪔',
    question: 'Which festival is observed by lighting earthen lamps (Saki) at the foot of the sacred Tulsi plant?',
    options: ['Kati Bihu', 'Durga Puja', 'Bohag Bihu', 'Eid'],
    correctIndex: 0,
    funFact: 'Observed in autumn with quiet prayers for crop protection.'
  }
];

export const FestivalMemory: React.FC = () => {
  const [round, setRound] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const currentQ = FESTIVAL_QUESTIONS[round % FESTIVAL_QUESTIONS.length];

  return (
    <GameShell
      gameId="festivalMemory"
      title="Festival Memory"
      category="Memory"
      instructions="Answer the question about our beloved traditional cultural festivals."
      audioPrompt={currentQ.question}
    >
      {({ onComplete }) => {
        const handleSelect = (idx: number) => {
          setSelectedIdx(idx);
          const isCorrect = idx === currentQ.correctIndex;
          const newScore = isCorrect ? score + 1 : score;
          setScore(newScore);

          setTimeout(() => {
            if (round + 1 < FESTIVAL_QUESTIONS.length) {
              setRound(r => r + 1);
              setSelectedIdx(null);
            } else {
              const accuracy = Math.round((newScore / FESTIVAL_QUESTIONS.length) * 100);
              onComplete(accuracy);
            }
          }, 1400);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Festival {round + 1} of {FESTIVAL_QUESTIONS.length}</span>
              <span>Cultural & Seasonal Memory</span>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl shrink-0">
                {currentQ.emoji}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">{currentQ.question}</h3>
                {selectedIdx !== null && (
                  <p className="text-amber-800 text-xs font-semibold mt-2">
                    ✨ {currentQ.funFact}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => {
                const isChosen = selectedIdx === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnClass = 'bg-gray-50 border-2 border-gray-200 text-gray-900 hover:bg-amber-50';
                if (selectedIdx !== null) {
                  if (isCorrect) btnClass = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold';
                  else if (isChosen) btnClass = 'bg-rose-100 border-2 border-rose-500 text-rose-950';
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedIdx !== null}
                    onClick={() => handleSelect(idx)}
                    className={`p-5 rounded-2xl text-left text-base font-bold transition-all cursor-pointer flex items-center justify-between min-h-[64px] ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {selectedIdx !== null && isCorrect && <CheckCircle2 size={20} className="text-emerald-600" />}
                    {selectedIdx !== null && isChosen && !isCorrect && <XCircle size={20} className="text-rose-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }}
    </GameShell>
  );
};
