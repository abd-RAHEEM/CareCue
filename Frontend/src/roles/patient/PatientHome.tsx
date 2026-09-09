import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Gamepad2, MessageCircle, Volume2, Mic, Sun, Moon, Coffee } from 'lucide-react';
import { useStore } from '../../store/store';
import { gsap } from 'gsap';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', icon: <Sun size={28} className="text-amber-500" /> };
  if (h < 17) return { text: 'Good afternoon', icon: <Coffee size={28} className="text-orange-500" /> };
  return { text: 'Good evening', icon: <Moon size={28} className="text-indigo-500" /> };
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.pitch = 1.1; u.lang = 'en-IN';
    window.speechSynthesis.speak(u);
  }
}

export const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const patient = session.patientId ? patients[session.patientId] : null;
  const ref = useRef<HTMLDivElement>(null);
  const greeting = getGreeting();

  useEffect(() => {
    if (!patient) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.home-greeting', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      gsap.fromTo('.home-reminder-card', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' });
      gsap.fromTo('.home-action-btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.5, ease: 'power3.out' });
    }, ref);
    return () => ctx.revert();
  }, [patient]);

  useEffect(() => {
    if (patient) {
      const greetText = `${greeting.text}, ${patient.name.split(' ')[0]}. Welcome to CareCue.`;
      speak(greetText);
    }
  }, []);

  if (!patient) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">No patient selected. <button onClick={() => navigate('/')} className="text-indigo-600 underline cursor-pointer">Go back</button></p>
    </div>
  );

  const nextReminder = patient.reminders.find(r => r.status === 'pending');
  const todayGames = patient.activityLog.filter(a => a.date.startsWith(new Date().toISOString().split('T')[0])).length;

  const speakReminder = () => {
    if (nextReminder) speak(`Your next reminder is: ${nextReminder.label} at ${nextReminder.time}`);
    else speak('You have no pending reminders. Great job!');
  };

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="home-greeting flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0">
          {greeting.icon}
        </div>
        <div>
          <p className="text-xl text-gray-500 font-medium">{greeting.text},</p>
          <h1 className="text-4xl font-extrabold text-indigo-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {patient.name.split(' ')[0]} 🌸
          </h1>
          <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Next Reminder Card */}
      <div className="home-reminder-card bezel-card">
        <div className="bezel-inner p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Next Reminder</span>
              {nextReminder ? (
                <>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{nextReminder.label}</h2>
                  <p className="text-2xl text-indigo-600 font-semibold mt-1">⏰ {nextReminder.time}</p>
                </>
              ) : (
                <p className="text-2xl font-bold text-emerald-600 mt-1">✅ All done for now!</p>
              )}
            </div>
            <button
              onClick={speakReminder}
              className="w-14 h-14 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
              aria-label="Read reminder aloud"
            >
              <Volume2 size={24} />
            </button>
          </div>
          {nextReminder && (
            <button
              onClick={() => navigate('/patient/reminders')}
              className="w-full bg-indigo-600 text-white rounded-2xl py-5 text-xl font-bold cursor-pointer hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ minHeight: 72 }}
            >
              <Bell size={24} /> View Reminders
            </button>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="home-action-btn bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm">
          <p className="text-3xl font-extrabold text-indigo-700">{todayGames}</p>
          <p className="text-sm text-gray-500 mt-1">Games played today</p>
        </div>
        <div className="home-action-btn bg-white rounded-2xl p-4 border border-teal-100 shadow-sm">
          <p className="text-3xl font-extrabold text-teal-700">{patient.reminders.filter(r => r.status === 'taken').length}</p>
          <p className="text-sm text-gray-500 mt-1">Reminders completed</p>
        </div>
      </div>

      {/* Main action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/patient/activities')}
          className="home-action-btn flex flex-col items-center gap-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-6 cursor-pointer hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all shadow-xl shadow-indigo-200"
          style={{ minHeight: 140 }}
        >
          <Gamepad2 size={36} />
          <span className="text-xl font-bold">Start Activity</span>
          <span className="text-sm opacity-80">Brain games & exercises</span>
        </button>
        <button
          onClick={() => navigate('/patient/chat')}
          className="home-action-btn flex flex-col items-center gap-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-3xl p-6 cursor-pointer hover:from-teal-600 hover:to-emerald-700 active:scale-95 transition-all shadow-xl shadow-teal-200"
          style={{ minHeight: 140 }}
        >
          <MessageCircle size={36} />
          <span className="text-xl font-bold">Ask CareCue</span>
          <span className="text-sm opacity-80">Your personal helper</span>
        </button>
        <button
          onClick={() => navigate('/patient/memory')}
          className="home-action-btn flex flex-col items-center gap-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-3xl p-6 cursor-pointer hover:from-amber-500 hover:to-orange-600 active:scale-95 transition-all shadow-xl shadow-amber-100"
          style={{ minHeight: 140 }}
        >
          <span className="text-4xl">📷</span>
          <span className="text-xl font-bold">My Family</span>
          <span className="text-sm opacity-80">Photos & memories</span>
        </button>
      </div>

      {/* Today's routine */}
      <div className="home-action-btn bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Today's Routine</h3>
        <div className="flex flex-col gap-2">
          {patient.routine.slice(0, 6).map(step => (
            <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl ${step.completed ? 'bg-emerald-50' : 'bg-gray-50'}`}>
              <span className="text-xl">{step.icon ?? '•'}</span>
              <span className={`font-medium ${step.completed ? 'text-emerald-700 line-through' : 'text-gray-700'}`}>{step.label}</span>
              {step.time && <span className="text-gray-400 text-sm ml-auto">{step.time}</span>}
              {step.completed && <span className="text-emerald-500 ml-2">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
