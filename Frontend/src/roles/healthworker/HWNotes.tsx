import React, { useState } from 'react';
import { FileText, Plus, Search, Calendar, User, Send, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/store';

interface FieldNote {
  id: string;
  patientId: string;
  patientName: string;
  text: string;
  category: 'clinical' | 'social' | 'routine' | 'escalation';
  date: string;
  author: string;
}

export const HWNotes: React.FC = () => {
  const patients = useStore(s => s.patients);
  const patientList = Object.values(patients);

  const [selectedPatientId, setSelectedPatientId] = useState(patientList[0]?.id || '');
  const [category, setCategory] = useState<FieldNote['category']>('clinical');
  const [noteText, setNoteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPatient, setFilterPatient] = useState('all');

  const [notes, setNotes] = useState<FieldNote[]>([
    {
      id: 'fn-1',
      patientId: 'p-101',
      patientName: 'Anima Devi',
      text: 'Monthly cognitive check-in. Completed Weaver game with 85% accuracy. Memory domain scores remain consistent with baseline.',
      category: 'clinical',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      author: 'Sunita Bora (ASHA)'
    },
    {
      id: 'fn-2',
      patientId: 'p-101',
      patientName: 'Anima Devi',
      text: 'Caregiver reported patient was hesitant with afternoon medication. Advised scheduling cue right after lunch with daughter present.',
      category: 'routine',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      author: 'Sunita Bora (ASHA)'
    }
  ]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedPatientId) return;

    const patient = patients[selectedPatientId];
    const newNote: FieldNote = {
      id: `fn-${Date.now()}`,
      patientId: selectedPatientId,
      patientName: patient ? patient.name : 'Unknown Patient',
      text: noteText.trim(),
      category,
      date: new Date().toISOString(),
      author: 'Health Worker (ASHA Field Log)'
    };

    setNotes([newNote, ...notes]);
    setNoteText('');
  };

  const filteredNotes = notes.filter(n => {
    if (filterPatient !== 'all' && n.patientId !== filterPatient) return false;
    if (searchQuery && !n.text.toLowerCase().includes(searchQuery.toLowerCase()) && !n.patientName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
          <FileText size={16} /> Clinical Records
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Health Worker Field Notes</h1>
        <p className="text-gray-500 text-sm mt-1">
          Structured log of patient observations, family consultations, and home visit assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Log New Note */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Record New Field Note</h2>
          <form onSubmit={handleAddNote} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700">Patient</label>
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
              >
                {patientList.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.preferredLanguage})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as FieldNote['category'])}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="clinical">Clinical Observation</option>
                <option value="routine">Medication / Routine</option>
                <option value="social">Family / Social Engagement</option>
                <option value="escalation">Special Escalation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Notes & Assessment</label>
              <textarea
                rows={4}
                required
                placeholder="Enter field assessment, cognitive responsiveness, or recommendations..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-amber-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Save Field Note
            </button>
          </form>
        </div>

        {/* Right Column: Feed of Notes */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes content..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={filterPatient}
              onChange={e => setFilterPatient(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-700 outline-none w-full sm:w-auto"
            >
              <option value="all">All Patients</option>
              {patientList.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {filteredNotes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100">
                No clinical notes recorded matching criteria.
              </div>
            ) : (
              filteredNotes.map(n => (
                <div key={n.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{n.patientName}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        n.category === 'clinical'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : n.category === 'escalation'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : n.category === 'routine'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {n.category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(n.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">{n.text}</p>

                  <div className="pt-2 border-t border-gray-50 text-xs text-gray-400 flex items-center justify-between">
                    <span>Logged by: {n.author}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
