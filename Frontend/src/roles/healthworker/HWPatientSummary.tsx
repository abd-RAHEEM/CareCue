import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  RefreshCw,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Brain,
  Calendar,
  Pill,
  Droplets,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useStore } from '../../store/store';
import { CognitiveDomainChart } from '../../components/CognitiveDomainChart';
import { AlertChip } from '../../components/AlertChip';
import { syncPatient } from '../../api/syncApi';

export const HWPatientSummary: React.FC = () => {
  const { patientId: paramId } = useParams();
  const navigate = useNavigate();
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const alerts = useStore(s => s.alerts);
  const acknowledgeAlert = useStore(s => s.acknowledgeAlert);

  const activeId = paramId || session.patientId || Object.keys(patients)[0];
  const patient = patients[activeId];

  const [syncing, setSyncing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Array<{ id: string; text: string; date: string; author: string }>>([
    {
      id: 'n1',
      text: 'Home visit conducted. Anima Devi was cheerful, engaged in Assamese weaving game. Reminded daughter about hydration cues.',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      author: 'Sunita Bora (ASHA)'
    }
  ]);

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800">Patient Not Found</h2>
        <button
          onClick={() => navigate('/healthworker')}
          className="mt-4 px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-sm"
        >
          Return to Caseload
        </button>
      </div>
    );
  }

  const handleSync = async () => {
    setSyncing(true);
    await syncPatient(patient.id);
    setSyncing(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setNotes([
      {
        id: `n-${Date.now()}`,
        text: newNote.trim(),
        date: new Date().toISOString(),
        author: 'Health Worker (Field Log)'
      },
      ...notes
    ]);
    setNewNote('');
  };

  const patientAlerts = alerts.filter(a => a.patientId === patient.id);
  const functioning = patient.cognitiveProfile.dailyFunctioning;

  return (
    <div className="space-y-6">
      {/* Top Bar with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/healthworker')}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Caseload
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-amber-100 text-amber-800 hover:bg-amber-200 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Field Sync Now'}
          </button>
          <button
            onClick={() => navigate('/healthworker/report')}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-600/20"
          >
            <Download size={14} /> Export Clinical Report
          </button>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 font-black text-2xl flex items-center justify-center">
            {patient.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{patient.name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Age {patient.age} • Language: {patient.preferredLanguage} • ID: {patient.id}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                Active Monitoring
              </span>
              <span className="text-xs text-gray-400">
                Last Synced: {new Date(patient.lastSyncedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-gray-50 rounded-2xl text-center">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Med Adherence</div>
            <div className="text-xl font-black text-gray-900">{functioning.medicineAdherence}%</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl text-center">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Hydration</div>
            <div className="text-xl font-black text-gray-900">{functioning.hydrationAdherence}%</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl text-center">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Routine Flow</div>
            <div className="text-xl font-black text-gray-900">{functioning.routineCompletion}%</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl text-center">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Pending Sync</div>
            <div className="text-xl font-black text-amber-600">{patient.pendingSyncCount}</div>
          </div>
        </div>
      </div>

      {/* Cognitive Domain Charts */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Clinical Cognitive Domains</h2>
        <p className="text-xs text-gray-500 mb-4">Radar domain score balance and longitudinal progression</p>
        <CognitiveDomainChart profile={patient.cognitiveProfile} mode="both" />
      </div>

      {/* Field Notes & Clinical Observations */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">ASHA / Field Visit Notes</h2>
            <p className="text-xs text-gray-500">Timestamped observations and family consultation logs</p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl">
            {notes.length} Notes Logged
          </span>
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Record home visit observation, family feedback, or medication change..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            className="flex-1 px-4 py-2.5 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-amber-600/20"
          >
            <Send size={15} /> Log Note
          </button>
        </form>

        {/* Notes List */}
        <div className="space-y-3 pt-2">
          {notes.map(note => (
            <div key={note.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gray-700">{note.author}</span>
                <span>{new Date(note.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
