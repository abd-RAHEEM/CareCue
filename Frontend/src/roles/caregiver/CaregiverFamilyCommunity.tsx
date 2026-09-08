import React, { useState } from 'react';
import {
  Users,
  Heart,
  Phone,
  Video,
  Sparkles,
  Calendar,
  MessageCircle,
  Plus,
  Play,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useStore } from '../../store/store';

export const CaregiverFamilyCommunity: React.FC = () => {
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const recordActivityResult = useStore(s => s.recordActivityResult);

  const patientId = session.patientId || Object.keys(patients)[0];
  const patient = patients[patientId];

  const [storyTopic, setStoryTopic] = useState('Childhood Bihu celebrations in Jorhat');
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({ name: '', relation: '', phone: '' });
  const [isAddingMember, setIsAddingMember] = useState(false);

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800">No Patient Selected</h2>
      </div>
    );
  }

  const handleStartStoryCircle = () => {
    // Record engagement
    recordActivityResult(patient.id, {
      gameId: 'storyCircle',
      date: new Date().toISOString(),
      accuracy: 100,
      responseTimeMs: 12000,
      hintsUsed: 0,
      retries: 0,
      difficultyLevel: 1,
      abandoned: false,
      breakRequested: false
    });
    setSessionCompleted(true);
    setTimeout(() => setSessionCompleted(false), 4000);
  };

  const familyMembers = patient.familyMembers || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users size={16} /> Family Engagement & Reminiscence Circle
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Family Story Circle</h1>
          <p className="text-purple-100 text-sm mt-1 max-w-xl">
            Foster shared memories and connection for {patient.name} through multi-generational storytelling, phone calls, and music.
          </p>
        </div>

        <button
          onClick={handleStartStoryCircle}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-950/20 cursor-pointer transition-all"
        >
          <Play size={18} fill="white" />
          Launch Story Session Now
        </button>
      </div>

      {sessionCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 animate-fade-in">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" />
          <div>
            <div className="font-bold text-sm">Family Story Circle Recorded!</div>
            <div className="text-xs text-emerald-700">
              Social interaction count updated and logged in daily functioning profile.
            </div>
          </div>
        </div>
      )}

      {/* Grid: Story Prompt / Session + Family Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Story Circle Prompts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Recommended Story Circle Prompts</h2>
            <p className="text-xs text-gray-500">
              Select a prompt to explore with {patient.name} during family gatherings or calls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'The Old Jorhat Garden', prompt: 'Tell us about the flowers and vegetables you loved growing in the Jorhat courtyard.', category: 'Childhood & Nature' },
                { title: 'Traditional Bihu Pitha', prompt: 'What was your favorite sweet to make for family during Magh Bihu?', category: 'Festivals & Food' },
                { title: 'Favorite Family Song', prompt: 'Singing Dr. Bhupen Hazarika tunes on the verandah on rainy evenings.', category: 'Music & Memories' },
                { title: 'The Weaving Loom (Tat)', prompt: 'Remembering the intricate Gamosa patterns and the sound of the wooden shuttle.', category: 'Craft & Routine' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setStoryTopic(item.title)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    storyTopic === item.title
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mt-1">{item.title}</h3>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed">{item.prompt}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-purple-900 uppercase">Selected Active Topic</div>
                <div className="text-sm font-black text-purple-950 mt-0.5">{storyTopic}</div>
              </div>
              <button
                onClick={handleStartStoryCircle}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Log Story Circle
              </button>
            </div>
          </div>

          {/* Dementia Caregiver Guidelines & Gentle Communication Tips */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Heart size={18} className="text-rose-500" /> Gentle Communication Guidelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900 block mb-1">Validate Rather Than Correct</span>
                If Anima Devi mentions something from decades ago, engage with the emotion rather than correcting dates or facts.
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900 block mb-1">Use Visual & Sensory Anchors</span>
                Show familiar objects, play known folk tunes, or share family photographs to gently orient.
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900 block mb-1">Pacing and Calm Pauses</span>
                Allow 5-10 seconds for replies without interrupting. Praise every small attempt at storytelling.
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900 block mb-1">Short Frequent Cues</span>
                Multiple 5-minute warm touchpoints are far more effective than long, exhausting conversations.
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Family Network Directory */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Family Contacts</h2>
            <button
              onClick={() => setIsAddingMember(!isAddingMember)}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {isAddingMember && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 animate-fade-in">
              <input
                type="text"
                placeholder="Name"
                value={newFamilyMember.name}
                onChange={e => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Relation (e.g. Grandson)"
                value={newFamilyMember.relation}
                onChange={e => setNewFamilyMember({ ...newFamilyMember, relation: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Phone (Optional)"
                value={newFamilyMember.phone}
                onChange={e => setNewFamilyMember({ ...newFamilyMember, phone: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl text-xs"
              />
              <button
                onClick={() => {
                  if (newFamilyMember.name) {
                    setIsAddingMember(false);
                    setNewFamilyMember({ name: '', relation: '', phone: '' });
                  }
                }}
                className="w-full bg-indigo-600 text-white font-bold py-1.5 rounded-xl text-xs"
              >
                Save Contact
              </button>
            </div>
          )}

          <div className="space-y-3">
            {familyMembers.map(member => (
              <div key={member.id} className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                    {member.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.relation}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="Call"
                    >
                      <Phone size={14} />
                    </a>
                  )}
                  <button
                    onClick={handleStartStoryCircle}
                    className="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                    title="Start Voice Session"
                  >
                    <Video size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <span className="text-xs text-gray-400">
              {familyMembers.length} active family members connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
