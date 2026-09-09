import { useStore } from '../store/store';
import type { Patient } from '../types';
import { USE_MOCK, API_BASE_URL } from './config';

export async function getPatient(patientId: string): Promise<Patient> {
  if (USE_MOCK) {
    const patient = useStore.getState().patients[patientId];
    if (!patient) throw new Error(`Patient ${patientId} not found`);
    return patient;
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}`);
  return res.json();
}

export async function listPatientsForCaregiver(caregiverId: string): Promise<Patient[]> {
  if (USE_MOCK) {
    const state = useStore.getState();
    const caregiver = state.caregivers[caregiverId];
    if (!caregiver) return [];
    return caregiver.linkedPatientIds.map(id => state.patients[id]).filter(Boolean);
  }
  const res = await fetch(`${API_BASE_URL}/caregivers/${caregiverId}/patients`);
  return res.json();
}

export async function listPatientsForHealthWorker(healthWorkerId: string): Promise<Patient[]> {
  if (USE_MOCK) {
    const state = useStore.getState();
    const hw = state.healthWorkers[healthWorkerId];
    if (!hw) return [];
    return hw.linkedPatientIds.map(id => state.patients[id]).filter(Boolean);
  }
  const res = await fetch(`${API_BASE_URL}/health-workers/${healthWorkerId}/patients`);
  return res.json();
}
