import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pill,
  Droplets,
  CheckSquare,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Brain,
  Calendar,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useStore } from '../../store/store';
import { AlertChip } from '../../components/AlertChip';
import { ReminderCard } from '../../components/ReminderCard';
import { syncPatient } from '../../api/syncApi';

export const CaregiverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const alerts = useStore(s => s.alerts);
  const acknowledgeAlert = useStore(s => s.acknowledgeAlert);
  const [syncing, setSyncing] = useState(false);

  // Default to active patient in session or first patient
  const patientId = session.patientId || Object.keys(patients)[0];
  const patient = patients[patientId];

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800">No Patient Selected</h2>
        <p className="text-gray-500 mt-2">Please select a patient from the navigation or home screen.</p>
      </div>
    );
  }

  const patientAlerts = alerts.filter(a => a.patientId === patient.id && !a.acknowledged);
  const recentActivities = [...patient.activityLog].reverse().slice(0, 4);

  const handleSync = async () => {
    setSyncing(true);
    await syncPatient(patient.id);
    setSyncing(false);
  };

  const functioning = patient.cognitiveProfile.dailyFunctioning;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Caregiver Monitor • {patient.name}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Daily Care Overview</h1>
          <p className="text-teal-100 text-sm mt-1 max-w-xl">
            Live cognitive status, daily adherence, and family engagement metrics for {patient.name}, Age {patient.age}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-2xl text-sm font-semibold backdrop-blur-md transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Device'}
          </button>
          <button
            onClick={() => navigate('/caregiver/reminders')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            New Cue
          </button>
        </div>
      </div>

      {/* Daily Functioning Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Pill size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Med Adherence</div>
            <div className="text-2xl font-black text-gray-900">{functioning.medicineAdherence}%</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Scheduled doses</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Droplets size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Hydration Score</div>
            <div className="text-2xl font-black text-gray-900">{functioning.hydrationAdherence}%</div>
            <div className="text-[11px] text-cyan-600 font-semibold">Daily goal</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckSquare size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Routine Flow</div>
            <div className="text-2xl font-black text-gray-900">{functioning.routineCompletion}%</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Steps done</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Social Cues</div>
            <div className="text-2xl font-black text-gray-900">{functioning.socialInteractionCount}</div>
            <div className="text-[11px] text-rose-600 font-semibold">Interactions today</div>
          </div>
        </div>
      </div>

      {/* Active Rule-Based Alerts */}
      {patientAlerts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <AlertTriangle size={18} className="text-amber-600" />
              Active Caregiver Alerts ({patientAlerts.length})
            </div>
            <span className="text-xs text-amber-700 font-medium">Rule-based baseline monitoring</span>
          </div>
          <div className="space-y-2">
            {patientAlerts.map(alert => (
              <AlertChip
                key={alert.id}
                alert={alert}
                onAcknowledge={id => acknowledgeAlert(id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Reminders + Recent Game Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule & Reminders */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Today's Reminders</h2>
                <p className="text-xs text-gray-500">Live confirmation from patient</p>
              </div>
              <button
                onClick={() => navigate('/caregiver/reminders')}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Manage all <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {patient.reminders.slice(0, 4).map(rem => (
                <ReminderCard key={rem.id} reminder={rem} mode="caregiver" />
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>{patient.reminders.filter(r => r.status === 'taken').length} of {patient.reminders.length} completed</span>
            <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => navigate('/caregiver/reminders')}>
              + Add new reminder
            </span>
          </div>
        </div>

        {/* Cognitive & Game Activity Feed */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Cognitive Activities</h2>
                <p className="text-xs text-gray-500">Exercises & stimulus response</p>
              </div>
              <button
                onClick={() => navigate('/caregiver/profile')}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Full Profile <ArrowUpRight size={14} />
              </button>
            </div>

            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No activities completed yet today.
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map(act => (
                  <div key={act.id} className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                        🎮
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 capitalize">
                          {act.gameId.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Level {act.difficultyLevel} • {Math.round(act.responseTimeMs / 100) / 10}s avg response
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-black ${act.accuracy >= 80 ? 'text-emerald-600' : act.accuracy >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {act.accuracy}%
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {act.hintsUsed} hint{act.hintsUsed === 1 ? '' : 's'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <TrendingUp size={14} /> Memory score stable
            </span>
            <button
              onClick={() => navigate('/caregiver/profile')}
              className="text-indigo-600 font-semibold cursor-pointer"
            >
              Analyze Radar Chart →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/caregiver/memory')}
          className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-5 rounded-3xl shadow-md cursor-pointer hover:shadow-lg transition-all"
        >
          <Brain className="mb-3 opacity-90" size={28} />
          <h3 className="font-bold text-base">Memory Graph Builder</h3>
          <p className="text-xs text-indigo-100 mt-1">Add photos, relatives, places, and avoid topics.</p>
        </div>

        <div
          onClick={() => navigate('/caregiver/family')}
          className="bg-gradient-to-br from-teal-600 to-teal-800 text-white p-5 rounded-3xl shadow-md cursor-pointer hover:shadow-lg transition-all"
        >
          <Users className="mb-3 opacity-90" size={28} />
          <h3 className="font-bold text-base">Family Story Circle</h3>
          <p className="text-xs text-teal-100 mt-1">Engage Anima Devi with voice-prompts and reminisce.</p>
        </div>

        <div
          onClick={() => navigate('/caregiver/profile')}
          className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-5 rounded-3xl shadow-md cursor-pointer hover:shadow-lg transition-all"
        >
          <TrendingUp className="mb-3 opacity-90" size={28} />
          <h3 className="font-bold text-base">Cognitive Profile & History</h3>
          <p className="text-xs text-purple-100 mt-1">View baseline vs current scores and export logs.</p>
        </div>
      </div>
    </div>
  );
};
