import { useStore } from '../store/store';
import type { Reminder } from '../types';
import { USE_MOCK, API_BASE_URL } from './config';

export async function getReminders(patientId: string): Promise<Reminder[]> {
  if (USE_MOCK) {
    return useStore.getState().patients[patientId]?.reminders ?? [];
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/reminders`);
  return res.json();
}

export async function updateReminderStatus(
  patientId: string,
  reminderId: string,
  status: Reminder['status'],
  confirmedBy: Reminder['confirmedBy']
): Promise<Reminder> {
  if (USE_MOCK) {
    useStore.getState().updateReminderStatus(patientId, reminderId, status, confirmedBy);
    const reminder = useStore.getState().patients[patientId]?.reminders.find(r => r.id === reminderId);
    if (!reminder) throw new Error('Reminder not found');
    return reminder;
  }
  const res = await fetch(`${API_BASE_URL}/reminders/${reminderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, confirmedBy }),
  });
  return res.json();
}

export async function createReminder(patientId: string, reminder: Omit<Reminder, 'id'>): Promise<Reminder> {
  if (USE_MOCK) {
    useStore.getState().addReminder(patientId, reminder);
    const reminders = useStore.getState().patients[patientId]?.reminders ?? [];
    return reminders[reminders.length - 1];
  }
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reminder),
  });
  return res.json();
}

export async function deleteReminder(patientId: string, reminderId: string): Promise<void> {
  if (USE_MOCK) {
    useStore.getState().deleteReminder(patientId, reminderId);
    return;
  }
  await fetch(`${API_BASE_URL}/reminders/${reminderId}`, { method: 'DELETE' });
}
