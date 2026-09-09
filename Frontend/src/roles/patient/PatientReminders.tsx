import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, AlarmClock, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/store';
import { updateReminderStatus } from '../../api/reminderApi';
import type { Reminder } from '../../types';

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.pitch = 1.1; u.lang = 'en-IN';
    window.speechSynthesis.speak(u);
  }
}

const TYPE_EMOJI: Record<Reminder['type'], string> = {
  medicine: '💊', hydration: '💧', meal: '🍽️',
  appointment: '🏥', familyCall: '📞', exercise: '🚶',
};

const TYPE_BG: Record<Reminder['type'], string> = {
  medicine: 'from-purple-100 to-indigo-100',
  hydration: 'from-blue-100 to-cyan-100',
  meal: 'from-orange-100 to-amber-100',
  appointment: 'from-indigo-100 to-blue-100',
  familyCall: 'from-pink-100 to-rose-100',
  exercise: 'from-emerald-100 to-teal-100',
};

export const PatientReminders: React.FC = () => {
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const patient = session.patientId ? patients[session.patientId] : null;
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState('');

  const reminders = patient?.reminders ?? [];
  const reminder = reminders[idx] ?? null;

  useEffect(() => {
    if (reminder) {
      speak(`Reminder ${idx + 1} of ${reminders.length}. ${reminder.label} at ${reminder.time}.`);
    }
  }, [idx]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAction = async (status: Reminder['status']) => {
    if (!patient || !reminder) return;
    await updateReminderStatus(patient.id, reminder.id, status, 'patient');
    const messages: Record<string, string> = {
      taken: '✅ Great job! Marked as done.',
      snoozed: '⏰ Reminder snoozed.',
      needHelp: '🆘 Your caregiver has been notified.',
    };
    showToast(messages[status] ?? '');
    speak(messages[status] ?? '');
    if (idx < reminders.length - 1) setTimeout(() => setIdx(i => i + 1), 800);
  };

  if (!patient || reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-6xl">✅</div>
        <h2 className="text-3xl font-bold text-emerald-700">All done!</h2>
        <p className="text-gray-500 text-xl">No reminders right now.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold text-lg shadow-xl z-50 animate-fade-slide-up">
          {toast}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2 w-full">
        {reminders.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i === idx ? 'bg-indigo-500' : i < idx ? 'bg-indigo-200' : 'bg-gray-200'}`} />
        ))}
        <span className="text-sm text-gray-500 ml-2 shrink-0">{idx + 1}/{reminders.length}</span>
      </div>

      {/* Current reminder */}
      {reminder && (
        <div className="w-full bezel-card">
          <div className={`bezel-inner bg-gradient-to-br ${TYPE_BG[reminder.type]} p-8`}>
            {/* Speak button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => speak(`${reminder.label} at ${reminder.time}. ${reminder.notes ?? ''}`)}
                className="w-14 h-14 rounded-2xl bg-white/70 hover:bg-white text-indigo-700 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                aria-label="Read aloud"
              >
                <Volume2 size={26} />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="text-7xl mb-4">{TYPE_EMOJI[reminder.type]}</div>
              <h2 className="text-3xl font-extrabold text-gray-900">{reminder.label}</h2>
              <p className="text-2xl text-indigo-600 font-bold mt-2">⏰ {reminder.time}</p>
              {reminder.notes && <p className="text-gray-600 mt-3 text-lg">{reminder.notes}</p>}
            </div>

            {reminder.status === 'pending' ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleAction('taken')}
                  className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xl font-bold cursor-pointer active:scale-95 transition-all"
                  style={{ minHeight: 72 }}
                >
                  <CheckCircle2 size={28} /> Done / Taken
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAction('snoozed')}
                    className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl text-lg font-bold cursor-pointer active:scale-95 transition-all"
                    style={{ minHeight: 64 }}
                  >
                    <AlarmClock size={22} /> Snooze
                  </button>
                  <button
                    onClick={() => handleAction('needHelp')}
                    className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl text-lg font-bold cursor-pointer active:scale-95 transition-all"
                    style={{ minHeight: 64 }}
                  >
                    <HelpCircle size={22} /> Need Help
                  </button>
                </div>
              </div>
            ) : (
              <div className={`text-center py-5 rounded-2xl text-2xl font-bold ${reminder.status === 'taken' ? 'bg-emerald-100 text-emerald-700' : reminder.status === 'snoozed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                {reminder.status === 'taken' ? '✅ Done!' : reminder.status === 'snoozed' ? '⏰ Snoozed' : '🆘 Help requested'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-4 w-full">
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-gray-200 text-gray-700 font-semibold disabled:opacity-40 cursor-pointer hover:bg-gray-50 transition-all"
          style={{ minHeight: 56 }}
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setIdx(i => Math.min(reminders.length - 1, i + 1))}
          disabled={idx === reminders.length - 1}
          className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-gray-200 text-gray-700 font-semibold disabled:opacity-40 cursor-pointer hover:bg-gray-50 transition-all"
          style={{ minHeight: 56 }}
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
