import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2,
  HelpCircle,
  Coffee,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Star,
  Award
} from 'lucide-react';
import { useStore } from '../store/store';
import { recordActivityResult } from '../api/activityApi';

interface GameShellProps {
  gameId: string;
  title: string;
  category: 'Memory' | 'Attention' | 'Sequencing' | 'Recognition' | 'Auditory';
  instructions: string;
  audioPrompt?: string;
  onHint?: () => void;
  children: (props: {
    difficulty: number;
    onComplete: (accuracy: number, details?: { hintsUsed?: number; retries?: number }) => void;
    onHintUsed: () => void;
  }) => React.ReactNode;
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

export const GameShell: React.FC<GameShellProps> = ({
  gameId,
  title,
  category,
  instructions,
  audioPrompt,
  onHint,
  children
}) => {
  const navigate = useNavigate();
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const gameDifficulty = useStore(s => s.gameDifficulty);

  const patientId = session.patientId || Object.keys(patients)[0];
  const patient = patients[patientId];
  const currentDifficulty = gameDifficulty[patientId]?.[gameId] || 1;

  const [startTime] = useState<number>(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [retries, setRetries] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [finalAccuracy, setFinalAccuracy] = useState(100);
  const [breakTaken, setBreakTaken] = useState(false);

  // Auto-speak instructions on mount for elderly patients
  useEffect(() => {
    speak(audioPrompt || `${title}. ${instructions}`);
  }, [title, instructions, audioPrompt]);

  const handleHintClick = () => {
    setHintsUsed(prev => prev + 1);
    if (onHint) onHint();
  };

  const handleBreak = async () => {
    setBreakTaken(true);
    speak("Taking a gentle break. That's wonderful, take your time.");
    if (patient) {
      await recordActivityResult(patient.id, {
        gameId,
        date: new Date().toISOString(),
        accuracy: 0,
        responseTimeMs: Date.now() - startTime,
        hintsUsed,
        retries,
        difficultyLevel: currentDifficulty,
        abandoned: false,
        breakRequested: true
      });
    }
  };

  const handleGameComplete = async (accuracy: number, details?: { hintsUsed?: number; retries?: number }) => {
    const totalHints = details?.hintsUsed ?? hintsUsed;
    const totalRetries = details?.retries ?? retries;
    const responseTime = Date.now() - startTime;

    setFinalAccuracy(accuracy);
    setCompleted(true);

    speak(accuracy >= 80 ? 'Wonderful job! That was fantastic.' : 'Great effort! You did very well.');

    if (patient) {
      await recordActivityResult(patient.id, {
        gameId,
        date: new Date().toISOString(),
        accuracy,
        responseTimeMs: responseTime,
        hintsUsed: totalHints,
        retries: totalRetries,
        difficultyLevel: currentDifficulty,
        abandoned: false,
        breakRequested: false
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/patient/activities')}
            className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            aria-label="Back to Activities"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                {category} Domain
              </span>
              <span className="text-xs font-bold text-gray-400">
                Level {currentDifficulty} of 5
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mt-0.5">{title}</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => speak(audioPrompt || instructions)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-colors cursor-pointer"
            title="Read Instructions Aloud"
          >
            <Volume2 size={18} />
            <span className="hidden sm:inline">Hear Prompt</span>
          </button>

          <button
            onClick={handleHintClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-sm transition-colors cursor-pointer"
          >
            <HelpCircle size={18} />
            <span className="hidden sm:inline">Hint ({hintsUsed})</span>
          </button>

          <button
            onClick={handleBreak}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm transition-colors cursor-pointer"
          >
            <Coffee size={18} />
            <span className="hidden sm:inline">Take a Break</span>
          </button>
        </div>
      </div>

      {/* Instructions Banner */}
      <div className="bg-indigo-900 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-indigo-200">
            <Volume2 size={20} />
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">How to play</div>
            <p className="text-base sm:text-lg font-bold text-white mt-0.5">{instructions}</p>
          </div>
        </div>
      </div>

      {/* Break Overlay */}
      {breakTaken && (
        <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
            ☕
          </div>
          <h2 className="text-2xl font-black text-gray-900">Resting & Taking a Break</h2>
          <p className="text-gray-600 max-w-md mx-auto text-base">
            You did great! There is never any rush. When you are ready, you can return to activities or explore family stories.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => navigate('/patient/activities')}
              className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl cursor-pointer"
            >
              Back to Activities
            </button>
          </div>
        </div>
      )}

      {/* Completed Modal / Celebration */}
      {completed && (
        <div className="bg-white rounded-3xl p-8 border-2 border-emerald-300 shadow-2xl text-center space-y-5 animate-scale-up">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🌟
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900">Wonderful Activity!</h2>
            <p className="text-gray-500 text-base mt-1">
              Score: <span className="font-bold text-emerald-600">{finalAccuracy}%</span> • Level {currentDifficulty}
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 max-w-md mx-auto text-sm text-emerald-900 font-medium">
            ✨ Results synchronized with your Caregiver and Health Worker dashboards.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCompleted(false);
                setBreakTaken(false);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} /> Play Again
            </button>
            <button
              onClick={() => navigate('/patient/activities')}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              More Activities →
            </button>
          </div>
        </div>
      )}

      {/* Game Content Render */}
      {!completed && !breakTaken && children({
        difficulty: currentDifficulty,
        onComplete: handleGameComplete,
        onHintUsed: () => setHintsUsed(h => h + 1)
      })}
    </div>
  );
};
