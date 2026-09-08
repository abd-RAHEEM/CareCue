import { useStore } from '../store/store';
import type { MemoryGraph } from '../types';
import { USE_MOCK, API_BASE_URL } from './config';

export async function getMemoryGraph(patientId: string): Promise<MemoryGraph> {
  if (USE_MOCK) {
    const p = useStore.getState().patients[patientId];
    if (!p) throw new Error('Patient not found');
    return p.memoryGraph;
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/memory-graph`);
  return res.json();
}

export async function updateMemoryGraph(patientId: string, patch: Partial<MemoryGraph>): Promise<MemoryGraph> {
  if (USE_MOCK) {
    useStore.getState().updateMemoryGraph(patientId, patch);
    return useStore.getState().patients[patientId].memoryGraph;
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/memory-graph`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  return res.json();
}
