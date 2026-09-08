import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const PEGS = [
  { id: 1, label: 'Red Border (Paari)', color: 'bg-rose-500' },
  { id: 2, label: 'White Cotton Warp', color: 'bg-sky-500' },
  { id: 3, label: 'Floral Motif (Buta)', color: 'bg-amber-500' },
  { id: 4, label: 'Shuttle (Maku)', color: 'bg-emerald-500' }
];

export const WeavingTracker: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([1, 3, 2, 4]);
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [showingDemo, setShowingDemo] = useState(true);

  useEffect(() => {
    playDemoSequence();
  }, []);

  const playDemoSequence = () => {
    setShowingDemo(true);
    setPlayerInput([]);
    sequence.forEach((pegId, index) => {
      setTimeout(() => {
        setActiveHighlight(pegId);
        setTimeout(() => setActiveHighlight(null), 600);
      }, (index + 1) * 900);
    });

    setTimeout(() => {
      setShowingDemo(false);
    }, (sequence.length + 1) * 900);
  };

  return (
    <GameShell
      gameId="weavingTracker"
      title="Weaving Tracker (Tat Xaal)"
      category="Sequencing"
      instructions={
        showingDemo
          ? 'Watch the weaver shuttle light up the loom pegs in sequence...'
          : 'Now tap the loom pegs in that exact order to weave the Gamosa!'
      }
    >
      {({ onComplete }) => {
        const handlePegClick = (id: number) => {
          if (showingDemo) return;

          const nextInput = [...playerInput, id];
          setPlayerInput(nextInput);

          if (nextInput.length === sequence.length) {
            let correct = 0;
            nextInput.forEach((val, idx) => {
              if (val === sequence[idx]) correct += 1;
            });
            const accuracy = Math.round((correct / sequence.length) * 100);
            onComplete(accuracy);
          }
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>{showingDemo ? '👀 Demonstration Phase' : '👉 Your Turn to Weave'}</span>
              <span>Sequence Progress: {playerInput.length} / {sequence.length}</span>
            </div>

            {/* Loom Shuttle Board */}
            <div className="bg-amber-50/60 rounded-3xl p-8 border-2 border-amber-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PEGS.map(peg => {
                const isLit = activeHighlight === peg.id;
                return (
                  <button
                    key={peg.id}
                    disabled={showingDemo}
                    onClick={() => handlePegClick(peg.id)}
                    className={`p-6 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
                      isLit
                        ? 'border-indigo-600 bg-indigo-100 ring-4 ring-indigo-300 scale-105 shadow-xl'
                        : 'border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${peg.color} text-white font-black text-lg flex items-center justify-center mb-2 shadow-md`}>
                      {peg.id}
                    </div>
                    <div className="font-bold text-gray-900 text-sm">{peg.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Tap Sequence indicator */}
            <div className="flex items-center justify-center gap-2">
              {sequence.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all ${
                    playerInput.length > idx ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {showingDemo && (
              <div className="text-center text-xs text-amber-800 font-bold animate-pulse">
                Watching sequence...
              </div>
            )}
          </div>
        );
      }}
    </GameShell>
  );
};
