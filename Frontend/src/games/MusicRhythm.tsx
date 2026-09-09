import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { Music, Sparkles } from 'lucide-react';

export const MusicRhythm: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const totalBeats = 8;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentBeat(prev => {
          const next = prev + 1;
          if (next > totalBeats) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStartRhythm = () => {
    setIsPlaying(true);
    setCurrentBeat(1);
    setUserTaps([]);
  };

  const handleTapBeat = () => {
    if (isPlaying && currentBeat > 0) {
      setUserTaps(t => [...t, currentBeat]);
    }
  };

  return (
    <GameShell
      gameId="musicRhythm"
      title="Music Rhythm Tap"
      category="Auditory"
      instructions="Tap the rhythm button along with the Bihu Dhol beat pulse."
    >
      {({ onComplete }) => {
        useEffect(() => {
          if (!isPlaying && userTaps.length > 0) {
            const accuracy = Math.min(100, Math.round((userTaps.length / totalBeats) * 100));
            onComplete(accuracy);
          }
        }, [isPlaying, userTaps]);

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Auditory & Motor Rhythm Synchronization</span>
              <span>Beat {currentBeat} of {totalBeats}</span>
            </div>

            {/* Beat Circles */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 py-4 flex-wrap">
              {Array.from({ length: totalBeats }).map((_, idx) => {
                const beatNum = idx + 1;
                const isCurrent = currentBeat === beatNum;
                const isTapped = userTaps.includes(beatNum);

                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-200 ${
                      isCurrent
                        ? 'bg-amber-500 text-white scale-110 shadow-lg ring-4 ring-amber-200'
                        : isTapped
                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isTapped ? '🥁' : beatNum}
                  </div>
                );
              })}
            </div>

            {/* Tap Button */}
            <div className="text-center space-y-4">
              {!isPlaying && userTaps.length === 0 ? (
                <button
                  onClick={handleStartRhythm}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-3xl text-lg shadow-xl shadow-indigo-600/30 cursor-pointer active:scale-95"
                >
                  Start Rhythm Beat →
                </button>
              ) : (
                <button
                  onClick={handleTapBeat}
                  disabled={!isPlaying}
                  className="w-36 h-36 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-90 text-white font-black text-2xl shadow-2xl shadow-amber-500/40 mx-auto flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform"
                >
                  <span>🥁</span>
                  <span className="text-sm uppercase tracking-wider">Tap Beat!</span>
                </button>
              )}
            </div>

            <div className="text-center text-xs text-gray-500">
              {isPlaying ? 'Keep tapping on each beat as it glows!' : 'Hit Start to begin the tempo.'}
            </div>
          </div>
        );
      }}
    </GameShell>
  );
};
