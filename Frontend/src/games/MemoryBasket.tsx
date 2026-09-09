import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { Check, Sparkles } from 'lucide-react';

const ITEMS_POOL = [
  { id: 'tamul', name: 'Tamul & Paan', emoji: '🌿', category: 'Cultural' },
  { id: 'gamosa', name: 'Gamosa', emoji: '🧣', category: 'Textile' },
  { id: 'tea', name: 'Assam Tea Cup', emoji: '🍵', category: 'Food' },
  { id: 'bell', name: 'Brass Bell (Ghari)', emoji: '🔔', category: 'Household' },
  { id: 'pitha', name: 'Til Pitha', emoji: '🥟', category: 'Food' },
  { id: 'dhol', name: 'Bihu Dhol', emoji: '🥁', category: 'Music' },
  { id: 'fan', name: 'Palm Leaf Fan', emoji: '🪭', category: 'Household' },
  { id: 'flower', name: 'Kopou Flower', emoji: '🌸', category: 'Nature' }
];

export const MemoryBasket: React.FC = () => {
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [targetItems, setTargetItems] = useState<typeof ITEMS_POOL>([]);
  const [allOptions, setAllOptions] = useState<typeof ITEMS_POOL>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(6);

  useEffect(() => {
    // Pick 3 items for target
    const shuffled = [...ITEMS_POOL].sort(() => 0.5 - Math.random());
    const targets = shuffled.slice(0, 3);
    const distractors = shuffled.slice(3, 7);
    const combined = [...targets, ...distractors].sort(() => 0.5 - Math.random());

    setTargetItems(targets);
    setAllOptions(combined);
    setPhase('memorize');
    setTimeLeft(6);
    setSelectedIds([]);
  }, []);

  useEffect(() => {
    if (phase === 'memorize') {
      if (timeLeft <= 0) {
        setPhase('recall');
        return;
      }
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, timeLeft]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <GameShell
      gameId="memoryBasket"
      title="Memory Basket"
      category="Memory"
      instructions={
        phase === 'memorize'
          ? `Remember these 3 items placed in the Khorahi basket! Hiding in ${timeLeft}s...`
          : 'Which 3 items were in the basket? Tap to select them.'
      }
    >
      {({ onComplete }) => {
        const handleCheck = () => {
          const targetIds = targetItems.map(t => t.id);
          const correctCount = selectedIds.filter(id => targetIds.includes(id)).length;
          const accuracy = Math.round((correctCount / targetItems.length) * 100);
          onComplete(accuracy);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            {phase === 'memorize' ? (
              <div className="text-center space-y-6">
                <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full font-bold text-sm">
                  ⏳ Memorize these items ({timeLeft}s)
                </div>

                <div className="bg-amber-50/60 border-2 border-dashed border-amber-300 rounded-3xl p-8 max-w-lg mx-auto">
                  <div className="text-5xl mb-3">🧺</div>
                  <div className="grid grid-cols-3 gap-4">
                    {targetItems.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-200 text-center animate-bounce-short">
                        <div className="text-4xl mb-2">{item.emoji}</div>
                        <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center font-bold text-gray-700 text-sm">
                  Select the {targetItems.length} items that were in the basket ({selectedIds.length} selected):
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {allOptions.map(item => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleSelect(item.id)}
                        className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px] ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 shadow-md scale-102'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-4xl mb-2">{item.emoji}</div>
                        <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                        {isSelected && (
                          <div className="mt-2 text-xs font-bold text-indigo-700 flex items-center gap-1">
                            <Check size={14} /> Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={handleCheck}
                    disabled={selectedIds.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-base shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    Check My Answers →
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </GameShell>
  );
};
