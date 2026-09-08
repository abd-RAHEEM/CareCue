import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { ArrowUp, ArrowDown, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

interface RecipeStep {
  id: string;
  order: number;
  text: string;
  emoji: string;
}

const INITIAL_STEPS: RecipeStep[] = [
  { id: 's3', order: 3, text: 'Add Assam tea leaves and let it brew aromatic liquor', emoji: '🌿' },
  { id: 's1', order: 1, text: 'Boil fresh water in the kettle on the stove', emoji: '🫖' },
  { id: 's4', order: 4, text: 'Pour through the brass strainer into the cup', emoji: '🍵' },
  { id: 's2', order: 2, text: 'Crush fresh ginger and cardamom pods', emoji: '🫚' }
];

export const RecipeRecall: React.FC = () => {
  const [steps, setSteps] = useState<RecipeStep[]>(INITIAL_STEPS);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setSteps(newSteps);
  };

  return (
    <GameShell
      gameId="recipeRecall"
      title="Recipe Recall"
      category="Sequencing"
      instructions="Put the 4 steps of brewing traditional Assam Ginger Tea in the right order from first to last."
    >
      {({ onComplete }) => {
        const handleCheck = () => {
          let correct = 0;
          steps.forEach((step, idx) => {
            if (step.order === idx + 1) correct += 1;
          });
          const accuracy = Math.round((correct / steps.length) * 100);
          onComplete(accuracy);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl w-fit">
              <UtensilsCrossed size={14} /> Recipe: Traditional Assam Ginger Tea
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-black text-base flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-2xl">{step.emoji}</span>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">{step.text}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveStep(idx, 'down')}
                      disabled={idx === steps.length - 1}
                      className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleCheck}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-base shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Submit Recipe Order →
              </button>
            </div>
          </div>
        );
      }}
    </GameShell>
  );
};
