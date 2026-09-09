import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface CardItem {
  id: number;
  pairKey: string;
  name: string;
  emoji: string;
}

const BASE_PAIRS = [
  { pairKey: 'gamosa', name: 'Gamosa', emoji: '🧣' },
  { pairKey: 'tea', name: 'Assam Tea', emoji: '🍵' },
  { pairKey: 'flower', name: 'Kopou Flower', emoji: '🌸' }
];

export const FamiliarPatternMatch: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const deck: CardItem[] = [];
    BASE_PAIRS.forEach((pair, idx) => {
      deck.push({ id: idx * 2, pairKey: pair.pairKey, name: pair.name, emoji: pair.emoji });
      deck.push({ id: idx * 2 + 1, pairKey: pair.pairKey, name: pair.name, emoji: pair.emoji });
    });
    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlippedIndices([]);
    setMatchedKeys([]);
    setMoves(0);
  }, []);

  return (
    <GameShell
      gameId="familiarPatternMatch"
      title="Familiar Pattern Match"
      category="Memory"
      instructions="Flip the cards and find the matching pairs of traditional Assamese cultural symbols."
    >
      {({ onComplete }) => {
        const handleCardClick = (index: number) => {
          if (flippedIndices.length === 2 || flippedIndices.includes(index)) return;
          const card = cards[index];
          if (matchedKeys.includes(card.pairKey)) return;

          const newFlipped = [...flippedIndices, index];
          setFlippedIndices(newFlipped);

          if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const first = cards[newFlipped[0]];
            const second = cards[newFlipped[1]];

            if (first.pairKey === second.pairKey) {
              const updatedMatched = [...matchedKeys, first.pairKey];
              setMatchedKeys(updatedMatched);
              setFlippedIndices([]);

              if (updatedMatched.length === BASE_PAIRS.length) {
                // Done!
                const accuracy = Math.max(50, 100 - (moves - 3) * 10);
                onComplete(accuracy);
              }
            } else {
              setTimeout(() => {
                setFlippedIndices([]);
              }, 1000);
            }
          }
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Pairs Found: {matchedKeys.length} of {BASE_PAIRS.length}</span>
              <span>Moves: {moves}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              {cards.map((card, idx) => {
                const isFlipped = flippedIndices.includes(idx) || matchedKeys.includes(card.pairKey);
                const isMatched = matchedKeys.includes(card.pairKey);

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className={`h-32 sm:h-36 rounded-2xl border-2 transition-all duration-300 transform cursor-pointer flex flex-col items-center justify-center ${
                      isFlipped
                        ? isMatched
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 scale-98 shadow-sm'
                          : 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-md scale-102'
                        : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-700 text-white hover:opacity-95'
                    }`}
                  >
                    {isFlipped ? (
                      <>
                        <div className="text-4xl mb-1">{card.emoji}</div>
                        <div className="font-bold text-xs">{card.name}</div>
                      </>
                    ) : (
                      <div className="text-3xl font-black opacity-40">✨</div>
                    )}
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
