import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { GAME_IDS } from '../../store/store';

const GAME_META: Record<string, { label: string; emoji: string; description: string; domain: string; path: string }> = {
  'memory-basket': { label: 'Memory Basket', emoji: '🧺', description: 'Remember and recall objects', domain: 'Memory', path: '/patient/games/memory-basket' },
  'my-memory-box': { label: 'My Memory Box', emoji: '📦', description: 'Who is this person?', domain: 'Memory', path: '/patient/games/my-memory-box' },
  'recipe-recall': { label: 'Recipe Recall', emoji: '🍛', description: 'Order the cooking steps', domain: 'Sequencing', path: '/patient/games/recipe-recall' },
  'sound-detective': { label: 'Sound Detective', emoji: '🔊', description: 'Match sounds to pictures', domain: 'Hearing', path: '/patient/games/sound-detective' },
  'simon-says': { label: 'Simon Says', emoji: '🎯', description: 'Follow the right commands', domain: 'Attention', path: '/patient/games/simon-says' },
  'weaving-tracker': { label: 'Weaving Tracker', emoji: '🧵', description: 'Follow the thread', domain: 'Focus', path: '/patient/games/weaving-tracker' },
  'pattern-builder': { label: 'Pattern Builder', emoji: '🎨', description: 'Complete the pattern', domain: 'Visual', path: '/patient/games/pattern-builder' },
  'daily-sequencer': { label: 'Daily Sequencer', emoji: '📅', description: 'Order your daily routine', domain: 'Planning', path: '/patient/games/daily-sequencer' },
  'festival-memory': { label: 'Festival Memory', emoji: '🎉', description: 'Match festivals to dates', domain: 'Memory', path: '/patient/games/festival-memory' },
  'object-detective': { label: 'Object Detective', emoji: '🔍', description: 'Find the right object', domain: 'Recognition', path: '/patient/games/object-detective' },
  'familiar-pattern': { label: 'Pattern Match', emoji: '🪡', description: 'Match the patterns', domain: 'Visual', path: '/patient/games/familiar-pattern' },
  'landmark-puzzle': { label: 'Landmark Puzzle', emoji: '🏛️', description: 'Piece the landmark together', domain: 'Spatial', path: '/patient/games/landmark-puzzle' },
  'story-circle': { label: 'Story Circle', emoji: '💬', description: 'Tell a story from a photo', domain: 'Expression', path: '/patient/games/story-circle' },
  'music-rhythm': { label: 'Music & Rhythm', emoji: '🎵', description: 'Tap along to the beat', domain: 'Rhythm', path: '/patient/games/music-rhythm' },
  'family-music': { label: 'Family Music', emoji: '🎶', description: 'Complete a song together', domain: 'Social', path: '/patient/games/family-music' },
};

const DOMAIN_COLORS: Record<string, string> = {
  'Memory': 'bg-purple-100 text-purple-700',
  'Sequencing': 'bg-indigo-100 text-indigo-700',
  'Hearing': 'bg-blue-100 text-blue-700',
  'Attention': 'bg-orange-100 text-orange-700',
  'Focus': 'bg-teal-100 text-teal-700',
  'Visual': 'bg-pink-100 text-pink-700',
  'Planning': 'bg-amber-100 text-amber-700',
  'Recognition': 'bg-emerald-100 text-emerald-700',
  'Spatial': 'bg-cyan-100 text-cyan-700',
  'Expression': 'bg-rose-100 text-rose-700',
  'Rhythm': 'bg-violet-100 text-violet-700',
  'Social': 'bg-green-100 text-green-700',
};

export const PatientActivities: React.FC = () => {
  const navigate = useNavigate();
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const gameDifficulty = useStore(s => s.gameDifficulty);
  const patient = session.patientId ? patients[session.patientId] : null;
  const [showAll, setShowAll] = useState(false);

  const todayDate = new Date().toISOString().split('T')[0];
  const todayPlayedIds = new Set(patient?.activityLog.filter(a => a.date.startsWith(todayDate)).map(a => a.gameId) ?? []);

  // Today's recommended: first 5 not yet played today
  const recommended = GAME_IDS.filter(id => !todayPlayedIds.has(id)).slice(0, 5);
  const displayGames = showAll ? GAME_IDS : (recommended.length > 0 ? recommended : GAME_IDS.slice(0, 5));

  const difficulty = (id: string) => gameDifficulty[session.patientId ?? '']?.[id] ?? 2;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-indigo-900">Activities</h1>
        <p className="text-gray-500 mt-1">Today's brain exercises — take your time!</p>
      </div>

      {/* Today's played */}
      {todayPlayedIds.size > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-emerald-700 font-semibold">🎉 You've played {todayPlayedIds.size} game{todayPlayedIds.size > 1 ? 's' : ''} today! Great work!</p>
        </div>
      )}

      {!showAll && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-700">Recommended for today</h2>
          <button onClick={() => setShowAll(true)} className="text-indigo-600 text-sm font-semibold cursor-pointer hover:underline">
            See all 15 games →
          </button>
        </div>
      )}
      {showAll && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-700">All Games</h2>
          <button onClick={() => setShowAll(false)} className="text-indigo-600 text-sm font-semibold cursor-pointer hover:underline">
            ← Recommended only
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayGames.map((gameId, i) => {
          const meta = GAME_META[gameId];
          if (!meta) return null;
          const played = todayPlayedIds.has(gameId);
          const diff = difficulty(gameId);
          return (
            <button
              key={gameId}
              onClick={() => navigate(meta.path)}
              className={`flex items-start gap-4 p-5 rounded-3xl border-2 text-left cursor-pointer active:scale-95 transition-all hover:shadow-lg ${played ? 'bg-emerald-50 border-emerald-200 opacity-80' : 'bg-white border-indigo-100 hover:border-indigo-300'}`}
              style={{ minHeight: 100, animationDelay: `${i * 60}ms` }}
            >
              <span className="text-4xl mt-1">{meta.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-lg">{meta.label}</p>
                <p className="text-gray-500 text-sm">{meta.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DOMAIN_COLORS[meta.domain] ?? 'bg-gray-100 text-gray-600'}`}>{meta.domain}</span>
                  <span className="text-xs text-gray-400">Level {diff}/5</span>
                  {played && <span className="text-xs font-bold text-emerald-600">✓ Played</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
