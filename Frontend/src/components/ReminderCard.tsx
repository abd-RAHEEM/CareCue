import React from 'react';
import { Pill, Droplets, UtensilsCrossed, Calendar, Phone, Dumbbell, Clock, CheckCircle2, AlarmClock, HelpCircle } from 'lucide-react';
import type { Reminder } from '../types';

const REMINDER_ICONS: Record<Reminder['type'], React.ReactNode> = {
  medicine: <Pill size={20} />,
  hydration: <Droplets size={20} />,
  meal: <UtensilsCrossed size={20} />,
  appointment: <Calendar size={20} />,
  familyCall: <Phone size={20} />,
  exercise: <Dumbbell size={20} />,
};

const TYPE_COLORS: Record<Reminder['type'], string> = {
  medicine: 'bg-purple-100 text-purple-700 border-purple-200',
  hydration: 'bg-blue-100 text-blue-700 border-blue-200',
  meal: 'bg-orange-100 text-orange-700 border-orange-200',
  appointment: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  familyCall: 'bg-pink-100 text-pink-700 border-pink-200',
  exercise: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const STATUS_BADGE: Record<Reminder['status'], { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  taken: { label: '✓ Done', color: 'bg-emerald-100 text-emerald-700' },
  snoozed: { label: 'Snoozed', color: 'bg-blue-100 text-blue-700' },
  needHelp: { label: '! Need Help', color: 'bg-red-100 text-red-700' },
  missed: { label: 'Missed', color: 'bg-gray-100 text-gray-600' },
};

interface ReminderCardProps {
  reminder: Reminder;
  mode?: 'patient' | 'caregiver' | 'compact';
  onTaken?: () => void;
  onSnooze?: () => void;
  onNeedHelp?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder, mode = 'caregiver', onTaken, onSnooze, onNeedHelp, onEdit, onDelete
}) => {
  const iconColors = TYPE_COLORS[reminder.type] ?? 'bg-gray-100 text-gray-600';
  const badge = STATUS_BADGE[reminder.status];

  if (mode === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${reminder.status === 'taken' ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${iconColors} shrink-0`}>
          {REMINDER_ICONS[reminder.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-800 truncate">{reminder.label}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} />{reminder.time}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.color}`}>{badge.label}</span>
      </div>
    );
  }

  if (mode === 'patient') {
    return (
      <div className="rounded-3xl bg-white border-2 border-indigo-100 p-6 shadow-xl shadow-indigo-50 flex flex-col gap-6">
        {/* Icon + label */}
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 text-3xl ${iconColors}`}>
            {REMINDER_ICONS[reminder.type]}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{reminder.label}</p>
            <p className="text-gray-500 flex items-center gap-1 mt-1"><Clock size={16} />{reminder.time}</p>
            {reminder.notes && <p className="text-sm text-gray-500 mt-2">{reminder.notes}</p>}
          </div>
        </div>

        {reminder.status === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-3">
            {onTaken && (
              <button onClick={onTaken} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-6 py-4 text-lg font-bold cursor-pointer active:scale-95 transition-all" style={{ minHeight: 68 }}>
                <CheckCircle2 size={24} /> Done
              </button>
            )}
            {onSnooze && (
              <button onClick={onSnooze} className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl px-6 py-4 text-lg font-bold cursor-pointer active:scale-95 transition-all" style={{ minHeight: 68 }}>
                <AlarmClock size={24} /> Snooze
              </button>
            )}
            {onNeedHelp && (
              <button onClick={onNeedHelp} className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl px-6 py-4 text-lg font-bold cursor-pointer active:scale-95 transition-all" style={{ minHeight: 68 }}>
                <HelpCircle size={24} /> Need Help
              </button>
            )}
          </div>
        )}
        {reminder.status !== 'pending' && (
          <div className={`text-center py-4 rounded-2xl font-bold text-lg ${badge.color}`}>{badge.label}</div>
        )}
      </div>
    );
  }

  // Caregiver mode
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border bg-white hover:shadow-sm transition-all">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${iconColors} shrink-0`}>
        {REMINDER_ICONS[reminder.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{reminder.label}</p>
        <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={12} />{reminder.time}</p>
        {reminder.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{reminder.notes}</p>}
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${badge.color}`}>{badge.label}</span>
      {(onEdit || onDelete) && (
        <div className="flex gap-1 shrink-0">
          {onEdit && <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-indigo-600 cursor-pointer rounded-lg hover:bg-indigo-50 transition-colors">✏️</button>}
          {onDelete && <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer rounded-lg hover:bg-red-50 transition-colors">🗑️</button>}
        </div>
      )}
    </div>
  );
};
