import type { ActivityResult } from '../types';
import { API_BASE_URL } from './config';


export interface PatientBackendSnapshot {
  patientId: string;
  name: string;
  language: string;
  events: ActivityResult[];
  report?: {
    totalActivities: number;
    gamesPlayed: string[];
    averageAccuracy: number;
    lastActivity: string | null;
  };
}

function normaliseEvent(event: Record<string, unknown>): ActivityResult {
  return {
    id: String(event.id),
    gameId: String(event.gameId ?? event.activity ?? 'unknown'),
    date: String(event.date ?? event.created_at ?? new Date().toISOString()),
    accuracy: Number(event.accuracy ?? event.score ?? 0),
    responseTimeMs: Number(event.responseTimeMs ?? 0),
    hintsUsed: Number(event.hintsUsed ?? event.hints ?? 0),
    retries: Number(event.retries ?? 0),
    difficultyLevel: Number(event.difficultyLevel ?? event.level ?? 1),
    abandoned: Boolean(event.abandoned ?? event.status === 'abandoned'),
    breakRequested: Boolean(event.breakRequested),
  };
}

export async function getPatientSnapshot(patientId: string): Promise<PatientBackendSnapshot> {
  const response = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(patientId)}/snapshot`);
  if (response.ok) return response.json() as Promise<PatientBackendSnapshot>;

  // Compatibility with the older backend that has separate patient/events routes.
  if (response.status !== 404) throw new Error((await response.text()) || `Could not load patient ${patientId}.`);
  const [patientResponse, eventsResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/patients/${encodeURIComponent(patientId)}`),
    fetch(`${API_BASE_URL}/patients/${encodeURIComponent(patientId)}/events`),
  ]);
  if (!patientResponse.ok || !eventsResponse.ok) throw new Error(`Patient ${patientId} was not found by the backend. Restart FastAPI to load the latest API routes.`);
  const patientData = await patientResponse.json() as { patient?: { patient_id?: string; patientId?: string; name?: string; language?: string } };
  const eventsData = await eventsResponse.json() as { events?: Record<string, unknown>[] };
  const patient = patientData.patient;
  return {
    patientId: patient?.patientId ?? patient?.patient_id ?? patientId,
    name: patient?.name ?? patientId,
    language: patient?.language ?? '',
    events: (eventsData.events ?? []).map(normaliseEvent),
  };
}