import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { Volume2, Music, CheckCircle2, XCircle } from 'lucide-react';

interface SoundItem {
  id: string;
  name: string;
  emoji: string;
  soundDescription: string;
  soundType: 'bell' | 'drum' | 'rain' | 'bird';
}

const SOUNDS: SoundItem[] = [
  { id: 's1', name: 'Temple Bell (Kanh)', emoji: '🔔', soundDescription: 'Clear resonant brass bell ring: Ding Ding Dang...', soundType: 'bell' },
  { id: 's2', name: 'Bihu Dhol Drum', emoji: '🥁', soundDescription: 'Rhythmic drum beat: Dhum Tak Dhum Tak...', soundType: 'drum' },
  { id: 's3', name: 'Monsoon Rain on Tin Roof', emoji: '🌧️', soundDescription: 'Soft patter: Tip tip tip on the courtyard roof...', soundType: 'rain' },
  { id: 's4', name: 'Morning Cuckoo (Kuli)', emoji: '🐦', soundDescription: 'Sweet morning bird call: Ku-hoo Ku-hoo...', soundType: 'bird' }
];

function playSyntheticTone(type: string) {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'bell') {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.5);
    } else if (type === 'drum') {
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    }
  } catch {
    // Web audio fallback
  }
}

export const SoundDetective: React.FC = () => {
  const [round, setRound] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentSound = SOUNDS[round % SOUNDS.length];

  const handlePlaySound = () => {
    playSyntheticTone(currentSound.soundType);
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(currentSound.soundDescription);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <GameShell
      gameId="soundDetective"
      title="Sound Detective"
      category="Auditory"
      instructions="Listen to the sound cue, then tap the image that makes that sound."
      audioPrompt={`Sound Detective round ${round + 1}. Listen carefully and pick the sound.`}
    >
      {({ onComplete }) => {
        const handlePick = (pickedId: string) => {
          setSelectedId(pickedId);
          const isCorrect = pickedId === currentSound.id;
          const newScore = isCorrect ? score + 1 : score;
          setScore(newScore);

          setTimeout(() => {
            if (round + 1 < 3) {
              setRound(r => r + 1);
              setSelectedId(null);
            } else {
              const accuracy = Math.round((newScore / 3) * 100);
              onComplete(accuracy);
            }
          }, 1200);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Round {round + 1} of 3</span>
              <span>Auditory Discrimination</span>
            </div>

            {/* Play Sound Button Box */}
            <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-3xl p-8 border border-indigo-100 text-center space-y-4">
              <button
                onClick={handlePlaySound}
                className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center mx-auto transition-transform active:scale-95 cursor-pointer"
              >
                <Volume2 size={36} />
              </button>
              <div>
                <div className="font-bold text-gray-900 text-base">Tap to Play Sound Cue</div>
                <div className="text-xs text-indigo-700 font-semibold mt-1">"{currentSound.soundDescription}"</div>
              </div>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SOUNDS.map(item => {
                const isChosen = selectedId === item.id;
                const isCorrect = item.id === currentSound.id;

                let border = 'border-gray-200 bg-gray-50 hover:bg-indigo-50';
                if (selectedId !== null) {
                  if (isCorrect) border = 'border-emerald-500 bg-emerald-100 font-bold';
                  else if (isChosen) border = 'border-rose-500 bg-rose-100';
                }

                return (
                  <button
                    key={item.id}
                    disabled={selectedId !== null}
                    onClick={() => handlePick(item.id)}
                    className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px] ${border}`}
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
