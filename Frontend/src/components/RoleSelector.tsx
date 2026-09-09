import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Stethoscope, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../store/store';
import { gsap } from 'gsap';

const PATIENTS = [
  { id: 'patient-1', name: 'Anima Devi', age: 72, lang: 'Assamese' },
  { id: 'patient-2', name: 'Hemanta Bora', age: 68, lang: 'English' },
];

export const RoleSelector: React.FC = () => {
  const navigate = useNavigate();
  const setRole = useStore(s => s.setRole);
  const [patientPickerOpen, setPatientPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.logo-area', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.role-card', { opacity: 0, y: 40, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.4
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const selectCaregiver = () => {
    setRole('caregiver', undefined, 'caregiver-1');
    navigate('/caregiver');
  };
  const selectHW = () => {
    setRole('healthWorker', undefined, undefined, 'hw-1');
    navigate('/healthworker');
  };
  const selectPatient = (id: string) => {
    setRole('patient', id);
    navigate('/patient');
  };

  return (
    <div ref={containerRef} className="min-h-[100dvh] bg-patient-gradient flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-indigo-200 rounded-full opacity-30 blur-3xl animate-spin-slow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-teal-200 rounded-full opacity-25 blur-3xl" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] right-[15%] w-48 h-48 bg-amber-100 rounded-full opacity-30 blur-2xl" />
      </div>

      {/* Logo */}
      <div className="logo-area text-center mb-12 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <Heart size={28} className="text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-extrabold text-indigo-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            CareCue
          </h1>
        </div>
        <p className="text-gray-600 font-medium">Cognitive care for every day</p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-xs text-gray-500 font-medium">Voice-first · Offline-ready · Dementia care</span>
          <Sparkles size={14} className="text-amber-500" />
        </div>
      </div>

      {/* Role cards */}
      <div className="w-full max-w-md flex flex-col gap-4 relative z-10">
        <p className="text-center text-sm text-gray-500 font-medium mb-2 uppercase tracking-widest">Select your role</p>

        {/* Patient card */}
        {!patientPickerOpen ? (
          <div
            className="role-card bezel-card cursor-pointer"
            onClick={() => setPatientPickerOpen(true)}
          >
            <div className="bezel-inner p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0 text-3xl shadow-sm">
                  🧓
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">I'm a Patient</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Reminders, games, and your personal helper</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        ) : (
          <div className="role-card bezel-card">
            <div className="bezel-inner p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🧓</span>
                <p className="font-semibold text-gray-800">Choose your profile:</p>
              </div>
              {PATIENTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPatient(p.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors text-left w-full"
                  style={{ minHeight: 56 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center font-bold text-indigo-700 shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">Age {p.age} · {p.lang}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 ml-auto" />
                </button>
              ))}
              <button onClick={() => setPatientPickerOpen(false)} className="text-sm text-gray-400 hover:text-gray-600 mt-1 cursor-pointer">← Back</button>
            </div>
          </div>
        )}

        {/* Caregiver card */}
        <div className="role-card bezel-card cursor-pointer" onClick={selectCaregiver}>
          <div className="bezel-inner p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                <Users size={26} className="text-teal-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">I'm a Caregiver</h2>
                <p className="text-sm text-gray-500 mt-0.5">Dashboard, reminders, and care insights</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Health Worker card */}
        <div className="role-card bezel-card cursor-pointer" onClick={selectHW}>
          <div className="bezel-inner p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope size={26} className="text-amber-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">I'm a Health Worker</h2>
                <p className="text-sm text-gray-500 mt-0.5">Multi-patient overview, sync, and reports</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-10 text-center relative z-10">
        Demo prototype · All data is local and private
      </p>
    </div>
  );
};
