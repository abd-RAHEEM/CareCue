import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { ArrowUp, ArrowDown, Sun, Moon, Coffee } from 'lucide-react';

interface RoutineItem {
  id: string;
  order: number;
  timeSlot: string;
  text: string;
  emoji: string;
}

const INITIAL_ROUTINE: RoutineItem[] = [
  { id: 'r3', order: 3, timeSlot: 'Afternoon (1:00 PM)', text: 'Having warm lunch with Masor Tenga and rice', emoji: '🍲' },
  { id: 'r1', order: 1, timeSlot: 'Early Morning (6:30 AM)', text: 'Drinking fresh warm water and greeting the morning sun', emoji: '🌅' },
  { id: 'r4', order: 4, timeSlot: 'Night (9:00 PM)', text: 'Taking night medicine and sleeping on comfortable bed', emoji: '🌙' },
  { id: 'r2', order: 2, timeSlot: 'Late Morning (9:00 AM)', text: 'Morning BP tablet with fresh ginger tea in courtyard', emoji: '🍵' }
];

export const DailyLifeSequencer: React.FC = () => {
  const [items, setItems] = useState<RoutineItem[]>(INITIAL_ROUTINE);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  return (
    <GameShell
      gameId="dailyLifeSequencer"
      title="Daily Life Sequencer"
      category="Sequencing"
      instructions="Arrange these 4 daily activities from early morning to night time."
    >
      {({ onComplete }) => {
        const handleCheck = () => {
          let correct = 0;
          items.forEach((item, idx) => {
            if (item.order === idx + 1) correct += 1;
          });
          const accuracy = Math.round((correct / items.length) * 100);
          onComplete(accuracy);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-3xl">{item.emoji}</span>
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base">{item.text}</div>
                      <div className="text-xs text-indigo-600 font-medium">{item.timeSlot}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 disabled:opacity-30 cursor-pointer"
                      title="Move Earlier"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === items.length - 1}
                      className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 disabled:opacity-30 cursor-pointer"
                      title="Move Later"
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
                Verify Day Sequence →
              </button>
            </div>
          </div>
        );
      }}
    </GameShell>
  );
};
