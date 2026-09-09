import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { useStore } from '../store/store';
import { Heart, CheckCircle2, XCircle } from 'lucide-react';

export const MyMemoryBox: React.FC = () => {
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const patient = session.patientId ? patients[session.patientId] : Object.values(patients)[0];

  const questions = [
    {
      id: 'q1',
      type: 'person',
      title: 'Minoti Saikia',
      imageEmoji: '👩‍🦳',
      clue: 'Brings sweet pitha during Bihu and lives in Guwahati.',
      question: 'Who is Minoti in your family?',
      options: ['Your Eldest Daughter', 'Your Sister', 'Your Doctor', 'Your Neighbor'],
      correctIndex: 0
    },
    {
      id: 'q2',
      type: 'person',
      title: 'Rahul Saikia',
      imageEmoji: '👨‍🎓',
      clue: 'Studying engineering in Jorhat, loves reading stories with you.',
      question: 'What is Rahul’s relation to you?',
      options: ['Your Nephew', 'Your Grandson', 'Your Brother', 'Your Pharmacist'],
      correctIndex: 1
    },
    {
      id: 'q3',
      type: 'place',
      title: 'Jorhat Family Tea Estate',
      imageEmoji: '🌿',
      clue: 'The beautiful green gardens where you lived for 25 wonderful years.',
      question: 'Which city was this beloved home in?',
      options: ['Jorhat', 'Dibrugarh', 'Silchar', 'Tezpur'],
      correctIndex: 0
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIdx];

  return (
    <GameShell
      gameId="myMemoryBox"
      title="My Memory Box"
      category="Recognition"
      instructions="Look at the family memory card and choose the matching answer."
      audioPrompt={`Looking at the memory card for ${currentQ.title}. ${currentQ.question}`}
    >
      {({ onComplete }) => {
        const handleSelect = (idx: number) => {
          setSelectedOption(idx);
          const isCorrect = idx === currentQ.correctIndex;
          const newScore = isCorrect ? score + 1 : score;
          setScore(newScore);

          setTimeout(() => {
            if (currentIdx + 1 < questions.length) {
              setCurrentIdx(c => c + 1);
              setSelectedOption(null);
            } else {
              const accuracy = Math.round((newScore / questions.length) * 100);
              onComplete(accuracy);
            }
          }, 1200);
        };

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Card {currentIdx + 1} of {questions.length}</span>
              <span>Personal Memory Anchor</span>
            </div>

            {/* Memory Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-md flex items-center justify-center text-5xl shrink-0 border border-indigo-100">
                {currentQ.imageEmoji}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-100">
                  {currentQ.title}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">{currentQ.question}</h3>
                <p className="text-gray-600 text-sm mt-1">{currentQ.clue}</p>
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => {
                const isChosen = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnClass = 'bg-gray-50 border-2 border-gray-200 text-gray-900 hover:bg-indigo-50 hover:border-indigo-300';
                if (selectedOption !== null) {
                  if (isCorrect) {
                    btnClass = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold';
                  } else if (isChosen) {
                    btnClass = 'bg-rose-100 border-2 border-rose-500 text-rose-950';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(idx)}
                    className={`p-5 rounded-2xl text-left text-base font-bold transition-all cursor-pointer flex items-center justify-between min-h-[64px] ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    )}
                    {selectedOption !== null && isChosen && !isCorrect && (
                      <XCircle size={20} className="text-rose-600 shrink-0" />
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
