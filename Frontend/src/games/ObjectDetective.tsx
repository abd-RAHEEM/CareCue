import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { Search, CheckCircle2, XCircle } from 'lucide-react';

interface DetectiveRound {
  targetName: string;
  targetEmoji: string;
  items: Array<{ id: string; name: string; emoji: string; isTarget: boolean }>;
}

const ROUNDS: DetectiveRound[] = [
  {
    targetName: 'Brass Bell (Ghari)',
    targetEmoji: '🔔',
    items: [
      { id: '1', name: 'Gamosa', emoji: '🧣', isTarget: false },
      { id: '2', name: 'Brass Bell', emoji: '🔔', isTarget: true },
      { id: '3', name: 'Tea Cup', emoji: '🍵', isTarget: false },
      { id: '4', name: 'Hand Fan', emoji: '🪭', isTarget: false },
      { id: '5', name: 'Loom Shuttle', emoji: '🧵', isTarget: false },
      { id: '6', name: 'Tulsi Leaf', emoji: '🌿', isTarget: false }
    ]
  },
  {
    targetName: 'Reading Glasses',
    targetEmoji: '👓',
    items: [
      { id: '1', name: 'Medicine Box', emoji: '💊', isTarget: false },
      { id: '2', name: 'Water Jug', emoji: '🫖', isTarget: false },
      { id: '3', name: 'Reading Glasses', emoji: '👓', isTarget: true },
      { id: '4', name: 'Kopou Flower', emoji: '🌸', isTarget: false },
      { id: '5', name: 'Brass Thali', emoji: '🍽️', isTarget: false },
      { id: '6', name: 'Wooden Comb', emoji: '🪮', isTarget: false }
    ]
  },
  {
    targetName: 'Bihu Dhol Drum',
    targetEmoji: '🥁',
    items: [
      { id: '1', name: 'Bamboo Flute', emoji: '🪈', isTarget: false },
      { id: '2', name: 'Brass Cymbals', emoji: '🪙', isTarget: false },
      { id: '3', name: 'Pepa Horn', emoji: '🎺', isTarget: false },
      { id: '4', name: 'Bihu Dhol Drum', emoji: '🥁', isTarget: true },
      { id: '5', name: 'Hand Fan', emoji: '🪭', isTarget: false },
      { id: '6', name: 'Gamosa', emoji: '🧣', isTarget: false }
    ]
  }
];

export const ObjectDetective: React.FC = () => {
  const [round, setRound] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentRound = ROUNDS[round % ROUNDS.length];

  return (
    <GameShell
      gameId="objectDetective"
      title="Object Detective"
      category="Recognition"
      instructions={`Can you spot the "${currentRound.targetName}" among the objects?`}
      audioPrompt={`Find the ${currentRound.targetName}`}
    >
      {({ onComplete }) => {
        const handlePick = (item: typeof currentRound.items[0]) => {
          setSelectedId(item.id);
          const isCorrect = item.isTarget;
          const newScore = isCorrect ? score + 1 : score;
          setScore(newScore);

          setTimeout(() => {
            if (round + 1 < ROUNDS.length) {
              setRound(r => r + 1);
              setSelectedId(null);
            } else {
              const accuracy = Math.round((newScore / ROUNDS.length) * 100);
              onComplete(accuracy);
            }
          }, 1200);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Object {round + 1} of {ROUNDS.length}</span>
              <span>Visual Discrimination & Search</span>
            </div>

            {/* Target Display */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-white px-3 py-1 rounded-xl shadow-xs">
                Target Object to Find
              </span>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center justify-center gap-3 mt-1">
                <span>{currentRound.targetEmoji}</span>
                <span>{currentRound.targetName}</span>
              </div>
            </div>

            {/* Grid of Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currentRound.items.map(item => {
                const isChosen = selectedId === item.id;
                const isTarget = item.isTarget;

                let border = 'border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300';
                if (selectedId !== null) {
                  if (isTarget) border = 'border-emerald-500 bg-emerald-100 font-bold';
                  else if (isChosen) border = 'border-rose-500 bg-rose-100';
                }

                return (
                  <button
                    key={item.id}
                    disabled={selectedId !== null}
                    onClick={() => handlePick(item)}
                    className={`p-6 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[130px] ${border}`}
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="font-bold text-gray-900 text-sm">{item.name}</div>
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
