import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Edit,
  Pill,
  Droplets,
  UtensilsCrossed,
  Calendar,
  Phone,
  Dumbbell,
  CheckCircle2,
  AlarmClock,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useStore } from '../../store/store';
import { createReminder, updateReminderStatus, deleteReminder } from '../../api/reminderApi';
import type { Reminder } from '../../types';

export const CaregiverReminders: React.FC = () => {
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);

  const patientId = session.patientId || Object.keys(patients)[0];
  const patient = patients[patientId];

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  const [newReminder, setNewReminder] = useState<{
    type: Reminder['type'];
    label: string;
    time: string;
    notes: string;
  }>({
    type: 'medicine',
    label: '',
    time: '08:00',
    notes: ''
  });

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800">No Patient Selected</h2>
      </div>
    );
  }

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.label.trim()) return;

    await createReminder(patient.id, {
      patientId: patient.id,
      type: newReminder.type,
      label: newReminder.label.trim(),
      time: newReminder.time,
      status: 'pending',
      notes: newReminder.notes.trim() || undefined
    });

    setNewReminder({
      type: 'medicine',
      label: '',
      time: '08:00',
      notes: ''
    });
    setIsAdding(false);
  };

  const handleStatusChange = async (id: string, status: Reminder['status']) => {
    await updateReminderStatus(patient.id, id, status, 'caregiver');
  };

  const handleDelete = async (id: string) => {
    await deleteReminder(patient.id, id);
  };

  const filteredReminders = patient.reminders.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Reminders & Daily Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage routine cues, medicines, and notifications for {patient.name}. Synchronized instantly with Patient UI.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Plus size={18} />
          {isAdding ? 'Cancel' : 'Add Reminder'}
        </button>
      </div>

      {/* Add New Reminder Modal/Drawer */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-xl animate-fade-in">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Daily Cue</h2>
          <form onSubmit={handleCreateReminder} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700">Category</label>
              <select
                value={newReminder.type}
                onChange={e => setNewReminder({ ...newReminder, type: e.target.value as Reminder['type'] })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="medicine">💊 Medicine</option>
                <option value="hydration">💧 Hydration (Water)</option>
                <option value="meal">🍲 Meal</option>
                <option value="appointment">🏥 Doctor / Appointment</option>
                <option value="familyCall">📞 Family Call</option>
                <option value="exercise">🧘 Walk / Exercise</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Cue Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Morning BP tablet with water"
                value={newReminder.label}
                onChange={e => setNewReminder({ ...newReminder, label: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Time</label>
              <input
                type="time"
                required
                value={newReminder.time}
                onChange={e => setNewReminder({ ...newReminder, time: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Save Cue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Filter:</span>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-700 outline-none"
        >
          <option value="all">All Types</option>
          <option value="medicine">Medicines</option>
          <option value="hydration">Hydration</option>
          <option value="meal">Meals</option>
          <option value="appointment">Appointments</option>
          <option value="familyCall">Family Calls</option>
          <option value="exercise">Exercise</option>
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-700 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="taken">Confirmed Taken</option>
          <option value="snoozed">Snoozed</option>
          <option value="needHelp">Needs Help</option>
        </select>

        <div className="ml-auto text-xs text-gray-500 font-medium pr-2">
          Showing {filteredReminders.length} of {patient.reminders.length}
        </div>
      </div>

      {/* Reminders List Table/Cards */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100">
            No reminders match the selected criteria.
          </div>
        ) : (
          filteredReminders.map(r => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl p-4 border transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                r.status === 'taken'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : r.status === 'needHelp'
                  ? 'border-rose-300 bg-rose-50/30'
                  : r.status === 'snoozed'
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                  {r.type === 'medicine' && '💊'}
                  {r.type === 'hydration' && '💧'}
                  {r.type === 'meal' && '🍲'}
                  {r.type === 'appointment' && '🏥'}
                  {r.type === 'familyCall' && '📞'}
                  {r.type === 'exercise' && '🧘'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">{r.label}</span>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 flex items-center gap-1">
                      <Clock size={12} /> {r.time}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>Type: {r.type}</span>
                    {r.confirmedBy && <span>• Confirmed by: {r.confirmedBy}</span>}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleStatusChange(r.id, r.status === 'taken' ? 'pending' : 'taken')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    r.status === 'taken'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  {r.status === 'taken' ? 'Taken' : 'Mark Taken'}
                </button>

                <button
                  onClick={() => handleStatusChange(r.id, 'snoozed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    r.status === 'snoozed'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-800'
                  }`}
                >
                  <AlarmClock size={14} />
                  Snooze
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="Delete Reminder"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
