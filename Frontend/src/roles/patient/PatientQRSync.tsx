import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw } from 'lucide-react';
import { useStore } from '../../store/store';
import type { PairingPayload } from '../../types/qrSync';

function makePairingId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const PatientQRSync: React.FC = () => {
  const session = useStore(state => state.session);
  const patients = useStore(state => state.patients);
  const syncState = useStore(state => state.syncState);
  const patient = session.patientId ? patients[session.patientId] : null;
  const patientSync = patient ? syncState[patient.id] : undefined;
  const [pairingId, setPairingId] = useState(makePairingId);

  const payload = useMemo<PairingPayload>(() => ({
    kind: 'carecue-pairing',
    version: 1,
    pairingId,
    patientId: patient?.id ?? '',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  }), [pairingId, patient?.id]);

  if (!patient) return <p className="text-gray-500">No patient selected.</p>;

  return <div className="max-w-xl mx-auto space-y-5">
    <div><h1 className="text-3xl font-extrabold text-indigo-900">Sync with Caregiver</h1><p className="text-gray-500 mt-1">Show this one QR code to connect the patient record.</p></div>
    <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm text-center">
      <h2 className="text-lg font-bold text-gray-900">Patient connection QR</h2>
      <p className="text-sm font-semibold text-indigo-700 mt-1">{patient.name}</p>
      <div className="flex justify-center my-5"><QRCodeSVG value={JSON.stringify(payload)} size={Math.min(360, window.innerWidth - 80)} level="M" marginSize={4} /></div>
      <p className="text-sm text-gray-600">The QR contains only the patient ID and a temporary pairing token. Patient activities stay in the backend database and are fetched after scanning.</p>
      <button onClick={() => setPairingId(makePairingId())} className="mt-5 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"><RefreshCw size={16} /> Refresh QR</button>
      <div className="mt-4 rounded-2xl bg-gray-50 p-3 text-sm text-gray-700">{patientSync?.status === 'synced' ? `Last synchronized ${new Date(patientSync.lastSyncedAt ?? '').toLocaleString()}` : 'Waiting for caregiver to scan.'}</div>
    </div>
  </div>;
};
