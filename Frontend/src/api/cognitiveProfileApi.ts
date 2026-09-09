import { useStore } from '../store/store';
import type { CognitiveProfile } from '../types';
import { USE_MOCK, API_BASE_URL } from './config';

export async function getCognitiveProfile(patientId: string): Promise<CognitiveProfile> {
  if (USE_MOCK) {
    const p = useStore.getState().patients[patientId];
    if (!p) throw new Error('Patient not found');
    return p.cognitiveProfile;
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/cognitive-profile`);
  return res.json();
}
