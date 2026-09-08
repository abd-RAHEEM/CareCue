import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { Music, CheckCircle2, XCircle } from 'lucide-react';

interface SongRound {
  title: string;
  artist: string;
  lines: string[];
  missingWord: string;
  options: string[];
  correctIndex: number;
}

const SONGS: SongRound[] = [
  {
    title: 'Manuhe Manuhor Babe',
    artist: 'Dr. Bhupen Hazarika',
    lines: ['Manuhe manuhor babe,', 'Jodihe okono nabhabe...', 'Akonu xohanubhutire...'],
    missingWord: 'manuhor',
    options: ['manuhor', 'dhanor', 'gaanot', 'potharor'],
    correctIndex: 0
  },
  {
    title: 'O Mur Apunar Desh',
    artist: 'Lakshminath Bezbaroa',
    lines: ['O mur apunar desh,', 'O mur xikoli desh,', 'Ene khon xuwola, ene khon ______'],
    missingWord: 'xofola',
    options: ['xofola', 'moromor', 'poharor', 'gaanot'],
    correctIndex: 0
  },
  {
    title: 'Buku Hom Hom Kore',
    artist: 'Dr. Bhupen Hazarika',
    lines: ['Buku hom hom kore mur aai,', 'Koniya mur bukute ______'],
    missingWord: 'lukai',
    options: ['lukai', 'bhabai', 'hahi', 'gaai'],
    correctIndex: 0
  }
];

export const FamilyMusic: React.FC = () => {
  const [round, setRound] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const currentSong = SONGS[round % SONGS.length];

  return (
    <GameShell
      gameId="familyMusic"
      title="Family Music Lyric Recall"
      category="Auditory"
      instructions="Sing along and pick the missing lyric to complete the song."
      audioPrompt={`Completing the lyrics for ${currentSong.title} by ${currentSong.artist}`}
    >
      {({ onComplete }) => {
        const handlePick = (idx: number) => {
          setSelectedIdx(idx);
          const isCorrect = idx === currentSong.correctIndex;
          const newScore = isCorrect ? score + 1 : score;
          setScore(newScore);

          setTimeout(() => {
            if (round + 1 < SONGS.length) {
              setRound(r => r + 1);
              setSelectedIdx(null);
            } else {
              const accuracy = Math.round((newScore / SONGS.length) * 100);
              onComplete(accuracy);
            }
          }, 1400);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Song {round + 1} of {SONGS.length}</span>
              <span>Auditory & Semantic Lyric Memory</span>
            </div>

            {/* Song Card */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-100 text-center space-y-3">
              <div className="text-4xl">🎵</div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">{currentSong.title}</h3>
              <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                By {currentSong.artist}
              </div>

              <div className="p-4 bg-white rounded-2xl border border-purple-100 max-w-md mx-auto space-y-1 text-base sm:text-lg font-bold text-gray-800 italic">
                {currentSong.lines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>

            {/* Missing Word Choices */}
            <div>
              <div className="text-center font-bold text-gray-700 text-sm mb-4">
                What is the missing lyric word?
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentSong.options.map((opt, idx) => {
                  const isChosen = selectedIdx === idx;
                  const isCorrect = idx === currentSong.correctIndex;

                  let btnClass = 'bg-gray-50 border-2 border-gray-200 text-gray-900 hover:bg-purple-50';
                  if (selectedIdx !== null) {
                    if (isCorrect) btnClass = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold';
                    else if (isChosen) btnClass = 'bg-rose-100 border-2 border-rose-500 text-rose-950';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedIdx !== null}
                      onClick={() => handlePick(idx)}
                      className={`p-5 rounded-2xl text-center text-lg font-bold transition-all cursor-pointer min-h-[64px] ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    </GameShell>
  );
};
