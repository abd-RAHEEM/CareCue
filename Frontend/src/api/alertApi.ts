import { useStore } from '../store/store';
import type { Alert } from '../types';
import { USE_MOCK, API_BASE_URL } from './config';

export async function getAlerts(patientId: string): Promise<Alert[]> {
  if (USE_MOCK) {
    return useStore.getState().alerts.filter(a => a.patientId === patientId);
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/alerts`);
  return res.json();
}

export async function acknowledgeAlert(alertId: string): Promise<Alert> {
  if (USE_MOCK) {
    useStore.getState().acknowledgeAlert(alertId);
    const alert = useStore.getState().alerts.find(a => a.id === alertId);
    if (!alert) throw new Error('Alert not found');
    return alert;
  }
  const res = await fetch(`${API_BASE_URL}/alerts/${alertId}/acknowledge`, { method: 'PATCH' });
  return res.json();
}
