import React, { useCallback, useState } from 'react';
import { useStore } from '../../store/store';
import { QRScanner } from '../../components/QRScanner';
import { getPatientSnapshot } from '../../api/qrSyncApi';
import type { PairingPayload } from '../../types/qrSync';

function isPairingPayload(value: unknown): value is PairingPayload {
  const payload = value as Partial<PairingPayload> | null;
  return payload?.kind === 'carecue-pairing' && payload.version === 1 && typeof payload.pairingId === 'string' && typeof payload.patientId === 'string' && typeof payload.expiresAt === 'string';
}

export const HWQRSync: React.FC = () => {
  const session = useStore(state => state.session);
  const patients = useStore(state => state.patients);
  const syncState = useStore(state => state.syncState);
  const pairPatient = useStore(state => state.pairPatient);
  const applyBackendActivity = useStore(state => state.applyBackendActivity);
  const setRole = useStore(state => state.setRole);
  const [manualPayload, setManualPayload] = useState('');
  const [connectedPatientId, setConnectedPatientId] = useState<string | null>(null);
  const [connectedPatientName, setConnectedPatientName] = useState<string | null>(null);
  const [patientReport, setPatientReport] = useState<{
    totalActivities: number;
    gamesPlayed: string[];
    averageAccuracy: number;
  } | null>(null);
  const [status, setStatus] = useState('Scan the single patient QR to begin.');
  const [loading, setLoading] = useState(false);

  const processTransfer = useCallback(async (text: string) => {
    setLoading(true);
    try {
      const payload = JSON.parse(text) as unknown;
      if (!isPairingPayload(payload)) throw new Error('Unsupported CareCue QR payload.');
      if (new Date(payload.expiresAt).getTime() <= Date.now()) throw new Error('This pairing QR has expired.');

      pairPatient(payload.patientId, payload.pairingId, session.caregiverId ?? 'caregiver-1');
      setConnectedPatientId(payload.patientId);
      setConnectedPatientName(patients[payload.patientId]?.name ?? payload.patientId);
      setStatus(`Patient ${payload.patientId} connected. Loading activities from FastAPI...`);

      const snapshot = await getPatientSnapshot(payload.patientId);
      const syncedAt = new Date().toISOString();
      applyBackendActivity(payload.patientId, snapshot.events, syncedAt);
      setConnectedPatientName(snapshot.name);
      setPatientReport(snapshot.report ?? {
        totalActivities: snapshot.events.length,
        gamesPlayed: [...new Set(snapshot.events.map(event => event.gameId))],
        averageAccuracy: snapshot.events.length ? Math.round(snapshot.events.reduce((total, event) => total + event.accuracy, 0) / snapshot.events.length) : 0,
      });
      setRole(session.role === 'caregiver' ? 'caregiver' : 'healthWorker', payload.patientId, session.caregiverId ?? undefined, session.healthWorkerId ?? undefined);
      setStatus(`${snapshot.name} connected and ${snapshot.events.length} activities loaded from the backend.`);
      setManualPayload('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not process this QR payload.');
    } finally {
      setLoading(false);
    }
  }, [applyBackendActivity, pairPatient, patients, session, setRole]);

  const connectedState = connectedPatientId ? syncState[connectedPatientId] : undefined;
  return <div className="max-w-xl mx-auto space-y-5"><div><h1 className="text-3xl font-extrabold text-amber-900">Connect Patient</h1><p className="text-gray-500 mt-1">Upload one QR image or use the camera. Patient details and activities are loaded by ID from FastAPI.</p></div><div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm"><QRScanner onScan={text => { void processTransfer(text); }} /><div className="mt-4 rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-700">{loading ? 'Loading patient data...' : status}</div>{connectedPatientId && <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">Connected patient: <strong>{connectedPatientName ?? connectedPatientId}</strong>{connectedPatientName && <span className="block text-xs text-emerald-700 mt-1">Patient ID: {connectedPatientId}</span>}{connectedState?.lastSyncedAt && <span className="block text-xs text-emerald-700 mt-1">Last sync: {new Date(connectedState.lastSyncedAt).toLocaleString()}</span>}</div>}{patientReport && <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-4"><h2 className="font-bold text-gray-900">Patient Activity Report</h2><div className="grid grid-cols-2 gap-3 mt-3 text-center"><div className="rounded-xl bg-gray-50 p-3"><div className="text-2xl font-black text-indigo-700">{patientReport.totalActivities}</div><div className="text-xs text-gray-500">Activities</div></div><div className="rounded-xl bg-gray-50 p-3"><div className="text-2xl font-black text-emerald-700">{patientReport.averageAccuracy}%</div><div className="text-xs text-gray-500">Average accuracy</div></div></div><p className="text-sm text-gray-600 mt-3"><strong>Games played:</strong> {patientReport.gamesPlayed.length ? patientReport.gamesPlayed.join(', ') : 'No games recorded yet.'}</p></div>}<div className="mt-6 border-t border-gray-100 pt-5"><label className="block text-sm font-bold text-gray-700" htmlFor="manual-qr">Manual fallback</label><textarea id="manual-qr" value={manualPayload} onChange={event => setManualPayload(event.target.value)} className="mt-2 w-full min-h-24 rounded-xl border border-gray-200 p-3 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500" placeholder="Paste decoded QR text only if camera and image scan are unavailable" /><button disabled={!manualPayload.trim() || loading} onClick={() => void processTransfer(manualPayload.trim())} className="mt-2 w-full px-4 py-3 rounded-xl bg-amber-600 text-white font-bold disabled:opacity-40 cursor-pointer">Process pasted QR</button></div></div></div>;
};
