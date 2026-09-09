import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface LandmarkRound {
  name: string;
  emoji: string;
  clue: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const LANDMARKS: LandmarkRound[] = [
  {
    name: 'Kamakhya Temple',
    emoji: '🛕',
    clue: 'Ancient historic temple perched on the sacred Nilachal Hill overlooking the Brahmaputra.',
    question: 'Where is the revered Kamakhya Temple situated?',
    options: ['Guwahati (Nilachal Hill)', 'Jorhat', 'Dibrugarh', 'Tezpur'],
    correctIndex: 0
  },
  {
    name: 'Kaziranga National Park',
    emoji: '🦏',
    clue: 'World famous sanctuary home to the majestic one-horned rhinoceros and vast elephant grass.',
    question: 'Which iconic animal is Kaziranga globally famous for?',
    options: ['One-Horned Rhinoceros', 'Bengal Tiger', 'Snow Leopard', 'Asiatic Lion'],
    correctIndex: 0
  },
  {
    name: 'Saraighat Bridge',
    emoji: '🌉',
    clue: 'The first rail-cum-road bridge constructed across the mighty red river Brahmaputra.',
    question: 'Which great river does the Saraighat Bridge span across?',
    options: ['Brahmaputra River', 'Ganges River', 'Barak River', 'Subansiri River'],
    correctIndex: 0
  }
];

export const LandmarkPuzzle: React.FC = () => {
  const [round, setRound] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const currentLandmark = LANDMARKS[round % LANDMARKS.length];

  return (
    <GameShell
      gameId="landmarkPuzzle"
      title="Landmark Puzzle"
      category="Recognition"
      instructions="Look at the landmark clue and identify the correct location and history."
      audioPrompt={currentLandmark.question}
    >
      {({ onComplete }) => {
        const handlePick = (idx: number) => {
          setSelectedIdx(idx);
          const isCorrect = idx === currentLandmark.correctIndex;
          const newScore = isCorrect ? score + 1 : score;
          setScore(newScore);

          setTimeout(() => {
            if (round + 1 < LANDMARKS.length) {
              setRound(r => r + 1);
              setSelectedIdx(null);
            } else {
              const accuracy = Math.round((newScore / LANDMARKS.length) * 100);
              onComplete(accuracy);
            }
          }, 1200);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Landmark {round + 1} of {LANDMARKS.length}</span>
              <span>Geographic & Cultural Recognition</span>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-6 border border-teal-100 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-md flex items-center justify-center text-5xl shrink-0 border border-teal-100">
                {currentLandmark.emoji}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-white px-3 py-1 rounded-xl border border-teal-100">
                  {currentLandmark.name}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">{currentLandmark.question}</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{currentLandmark.clue}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentLandmark.options.map((opt, idx) => {
                const isChosen = selectedIdx === idx;
                const isCorrect = idx === currentLandmark.correctIndex;

                let btnClass = 'bg-gray-50 border-2 border-gray-200 text-gray-900 hover:bg-teal-50';
                if (selectedIdx !== null) {
                  if (isCorrect) btnClass = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold';
                  else if (isChosen) btnClass = 'bg-rose-100 border-2 border-rose-500 text-rose-950';
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedIdx !== null}
                    onClick={() => handlePick(idx)}
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
