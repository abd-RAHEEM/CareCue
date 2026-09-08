import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  RefreshCw,
  AlertTriangle,
  FileText,
  Download,
  CheckCircle,
  Clock,
  Search,
  ArrowRight,
  Pill,
  WifiOff,
  Wifi
} from 'lucide-react';
import { useStore } from '../../store/store';
import { syncPatient } from '../../api/syncApi';

export const HWPatientList: React.FC = () => {
  const navigate = useNavigate();
  const patients = useStore(s => s.patients);
  const alerts = useStore(s => s.alerts);
  const setRole = useStore(s => s.setRole);

  const [searchQuery, setSearchQuery] = useState('');
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const patientList = Object.values(patients);

  const handleSyncPatient = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncingId(id);
    await syncPatient(id);
    setSyncingId(null);
  };

  const handleSelectPatient = (id: string) => {
    setRole('healthWorker', id);
    navigate(`/healthworker/summary/${id}`);
  };

  const filteredPatients = patientList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.preferredLanguage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Stethoscope size={16} /> Community Health Worker Caseload
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Elderly Care Roster</h1>
          <p className="text-amber-100 text-sm mt-1 max-w-xl">
            Offline-synchronized field logs, adherence monitoring, and clinical cognitive reports for your assigned ward.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-md text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {patientList.length} Active Patients Managed
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient name, language, or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Patient List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map(patient => {
          const patientAlerts = alerts.filter(a => a.patientId === patient.id && !a.acknowledged);
          const functioning = patient.cognitiveProfile.dailyFunctioning;
          const pendingSync = patient.pendingSyncCount;
          const isSyncing = syncingId === patient.id;

          return (
            <div
              key={patient.id}
              onClick={() => handleSelectPatient(patient.id)}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center shrink-0">
                      {patient.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        {patient.name}
                        <span className="text-xs font-normal text-gray-500">({patient.age} yrs)</span>
                      </h3>
                      <p className="text-xs text-gray-500">
                        Primary: {patient.preferredLanguage} • ID: {patient.id}
                      </p>
                    </div>
                  </div>

                  {/* Sync Status Badge */}
                  <div className="flex items-center gap-1.5">
                    {pendingSync > 0 ? (
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <WifiOff size={12} /> {pendingSync} un-synced
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Wifi size={12} /> Synced
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-50 text-center">
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Med Adherence</div>
                    <div className="text-base font-black text-gray-900">{functioning.medicineAdherence}%</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Hydration</div>
                    <div className="text-base font-black text-gray-900">{functioning.hydrationAdherence}%</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Active Alerts</div>
                    <div className={`text-base font-black ${patientAlerts.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {patientAlerts.length}
                    </div>
                  </div>
                </div>

                {/* Active Alerts brief notice */}
                {patientAlerts.length > 0 && (
                  <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                    <span className="truncate">{patientAlerts[0].message}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={e => handleSyncPatient(patient.id, e)}
                  disabled={isSyncing}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 p-1 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                  {isSyncing ? 'Syncing...' : 'Field Sync'}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    Last: {new Date(patient.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
