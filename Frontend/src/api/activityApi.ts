import { useStore } from '../store/store';
import type { ActivityResult } from '../types';
import { USE_MOCK, API_BASE_URL } from './config';

export async function recordActivityResult(
  patientId: string,
  result: Omit<ActivityResult, 'id'>
): Promise<ActivityResult> {
  if (USE_MOCK) {
    return useStore.getState().recordActivityResult(patientId, result);
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/activity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  return res.json();
}

export async function getActivityHistory(patientId: string, gameId?: string): Promise<ActivityResult[]> {
  if (USE_MOCK) {
    const log = useStore.getState().patients[patientId]?.activityLog ?? [];
    return gameId ? log.filter(a => a.gameId === gameId) : log;
  }
  const url = gameId
    ? `${API_BASE_URL}/patients/${patientId}/activity?gameId=${gameId}`
    : `${API_BASE_URL}/patients/${patientId}/activity`;
  const res = await fetch(url);
  return res.json();
}

// Swap point: ML-based adaptive engine replaces this
export async function getNextDifficulty(patientId: string, gameId: string): Promise<number> {
  if (USE_MOCK) {
    return useStore.getState().getNextDifficulty(patientId, gameId);
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/difficulty/${gameId}`);
  const data = await res.json();
  return data.difficultyLevel;
}
