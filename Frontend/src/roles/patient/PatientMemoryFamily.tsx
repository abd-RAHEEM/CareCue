import React, { useState } from 'react';
import { Volume2, Heart, Users, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/store';

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.pitch = 1.1; u.lang = 'en-IN';
    window.speechSynthesis.speak(u);
  }
}

const RELATION_EMOJI: Record<string, string> = {
  Son: '👦', Daughter: '👧', Wife: '👩', Husband: '👨', Sister: '👩', Brother: '👦',
  Grandson: '👶', Granddaughter: '👶', Doctor: '👨‍⚕️', Friend: '🤝',
};

export const PatientMemoryFamily: React.FC = () => {
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const incrementSocial = useStore(s => s.incrementSocialInteraction);
  const patient = session.patientId ? patients[session.patientId] : null;
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [tab, setTab] = useState<'people' | 'places' | 'objects' | 'photos'>('people');
  const [storyCircleOpen, setStoryCircleOpen] = useState(false);
  const [storyCompleted, setStoryCompleted] = useState(false);

  if (!patient) return null;
  const { memoryGraph } = patient;

  const selectedPersonObj = memoryGraph.people.find(p => p.id === selectedPerson);

  const speakPerson = (p: typeof memoryGraph.people[0]) => {
    speak(`${p.name} is your ${p.relation}. ${p.description ?? ''}`);
  };

  const handleStoryComplete = () => {
    incrementSocial(patient.id);
    setStoryCompleted(true);
    setTimeout(() => { setStoryCircleOpen(false); setStoryCompleted(false); }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-indigo-900">Memory & Family</h1>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-1 rounded-2xl border border-gray-100 overflow-x-auto">
        {(['people', 'places', 'objects', 'photos'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 min-w-[80px] py-3 rounded-xl text-base font-semibold cursor-pointer transition-all capitalize ${tab === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            {t === 'people' ? '👨‍👩‍👧 People' : t === 'places' ? '📍 Places' : t === 'objects' ? '🔑 Objects' : '📷 Photos'}
          </button>
        ))}
      </div>

      {/* People tab */}
      {tab === 'people' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {memoryGraph.people.map(person => (
              <button
                key={person.id}
                onClick={() => { setSelectedPerson(person.id); speakPerson(person); }}
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer active:scale-95 transition-all hover:shadow-md ${selectedPerson === person.id ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-gray-100'}`}
                style={{ minHeight: 80 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl shrink-0">
                  {RELATION_EMOJI[person.relation] ?? '👤'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xl text-gray-900">{person.name}</p>
                  <p className="text-indigo-600 font-medium">{person.relation}</p>
                </div>
                <Volume2 size={20} className="text-gray-400 shrink-0 mt-1" />
              </button>
            ))}
          </div>

          {selectedPersonObj && (
            <div className="bezel-card">
              <div className="bezel-inner p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-4xl">
                    {RELATION_EMOJI[selectedPersonObj.relation] ?? '👤'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">{selectedPersonObj.name}</h2>
                    <p className="text-indigo-600 font-semibold text-lg">{selectedPersonObj.relation}</p>
                  </div>
                </div>
                {selectedPersonObj.description && (
                  <p className="text-xl text-gray-700 leading-relaxed">{selectedPersonObj.description}</p>
                )}
                <button
                  onClick={() => speakPerson(selectedPersonObj)}
                  className="mt-4 flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-5 py-3 rounded-2xl font-semibold cursor-pointer active:scale-95 transition-all"
                  style={{ minHeight: 56 }}
                >
                  <Volume2 size={20} /> Read aloud
                </button>
              </div>
            </div>
          )}

          {/* Family Story Circle */}
          <button
            onClick={() => setStoryCircleOpen(true)}
            className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200 cursor-pointer hover:shadow-md active:scale-95 transition-all"
            style={{ minHeight: 72 }}
          >
            <div className="flex items-center gap-3">
              <Users size={28} className="text-pink-600" />
              <div>
                <p className="font-bold text-lg text-pink-900">Family Story Circle</p>
                <p className="text-sm text-pink-700">Share memories together</p>
              </div>
            </div>
            <ChevronRight size={22} className="text-pink-500" />
          </button>
        </div>
      )}

      {/* Places tab */}
      {tab === 'places' && (
        <div className="flex flex-col gap-3">
          {memoryGraph.places.map(place => (
            <button key={place.id} onClick={() => speak(`${place.name}. ${place.description ?? ''}`)}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-gray-100 text-left cursor-pointer hover:border-teal-300 hover:shadow-md active:scale-95 transition-all"
              style={{ minHeight: 72 }}>
              <span className="text-4xl">📍</span>
              <div>
                <p className="font-bold text-xl text-gray-900">{place.name}</p>
                <p className="text-gray-500 mt-1">{place.description}</p>
              </div>
              <Volume2 size={18} className="text-gray-400 ml-auto shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Objects tab */}
      {tab === 'objects' && (
        <div className="flex flex-col gap-3">
          {memoryGraph.objects.map(obj => (
            <button key={obj.id} onClick={() => speak(`Your ${obj.name} is at: ${obj.usualLocation}`)}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border-2 border-gray-100 cursor-pointer hover:border-amber-300 hover:shadow-md active:scale-95 transition-all"
              style={{ minHeight: 72 }}>
              <span className="text-3xl">🔑</span>
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-900">{obj.name}</p>
                <p className="text-sm text-amber-700 font-medium">📍 {obj.usualLocation}</p>
              </div>
              <Volume2 size={18} className="text-gray-400 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Photos tab */}
      {tab === 'photos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memoryGraph.photoAlbum.map(photo => {
            const people = photo.peopleIds.map(pid => memoryGraph.people.find(p => p.id === pid)?.name ?? '').filter(Boolean);
            return (
              <button
                key={photo.id}
                onClick={() => speak(`${photo.caption ?? ''}. ${people.length > 0 ? 'With ' + people.join(' and ') : ''}`)}
                className="flex flex-col rounded-2xl overflow-hidden border-2 border-gray-100 bg-white hover:shadow-md hover:border-indigo-200 cursor-pointer active:scale-95 transition-all text-left"
              >
                {/* Placeholder photo */}
                <div className="h-36 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-1">📷</div>
                    <p className="text-xs text-indigo-400 font-medium">{photo.date ?? ''}</p>
                  </div>
                </div>
                <div className="p-4 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800">{photo.caption}</p>
                    {people.length > 0 && (
                      <p className="text-sm text-indigo-600 mt-1 flex items-center gap-1">
                        <Heart size={12} fill="currentColor" /> {people.join(', ')}
                      </p>
                    )}
                  </div>
                  <Volume2 size={18} className="text-gray-400 shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Family Story Circle modal */}
      {storyCircleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center gap-6 text-center">
            <div className="text-6xl">👨‍👩‍👧</div>
            <h2 className="text-2xl font-extrabold text-gray-900">Family Story Circle</h2>
            <p className="text-gray-600 text-lg">Share a memory or story with someone you love. There are no right or wrong answers — just share!</p>
            <p className="text-gray-500 italic">"Tell me something you remember from Bihu celebrations..."</p>
            {storyCompleted ? (
              <div className="text-emerald-600 text-xl font-bold">✅ Story shared! Thank you 💛</div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                <button onClick={handleStoryComplete}
                  className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl py-4 text-xl font-bold cursor-pointer active:scale-95 transition-all"
                  style={{ minHeight: 68 }}>
                  ✅ Story Complete!
                </button>
                <button onClick={() => setStoryCircleOpen(false)}
                  className="text-gray-400 text-base cursor-pointer hover:text-gray-600">
                  Maybe later
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
