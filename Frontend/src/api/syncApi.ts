import { useStore } from '../store/store';
import type { SyncResult } from '../types';
import { USE_MOCK, API_BASE_URL } from './config';

export async function syncPatient(patientId: string): Promise<SyncResult> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 1200)); // simulate network delay
    return useStore.getState().simulateSync(patientId);
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/sync`, { method: 'POST' });
  return res.json();
}
