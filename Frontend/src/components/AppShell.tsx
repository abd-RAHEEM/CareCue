import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart, Home, Bell, Gamepad2, ImageIcon, MessageCircle,
  LayoutDashboard, Brain, Calendar, Users, Stethoscope,
  List, FileText, Download, RefreshCw, ChevronDown, LogOut, Menu, X
} from 'lucide-react';
import { useStore } from '../store/store';
import { SyncIndicator } from './SyncIndicator';

// ── Patient Nav ──────────────────────────────────────────────────────────────
const PATIENT_NAV = [
  { label: 'Home', icon: Home, path: '/patient' },
  { label: 'Reminders', icon: Bell, path: '/patient/reminders' },
  { label: 'Activities', icon: Gamepad2, path: '/patient/activities' },
  { label: 'Memory & Family', icon: ImageIcon, path: '/patient/memory' },
  { label: 'Ask CareCue', icon: MessageCircle, path: '/patient/chat' },
  { label: 'QR Sync', icon: RefreshCw, path: '/patient/sync' },
];

// ── Caregiver Nav ──────────────────────────────────────────────────────────
const CAREGIVER_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/caregiver' },
  { label: 'Connect Patient', icon: RefreshCw, path: '/caregiver/sync' },
  { label: 'Memory Builder', icon: Brain, path: '/caregiver/memory' },
  { label: 'Reminders', icon: Calendar, path: '/caregiver/reminders' },
  { label: 'Cognitive Profile', icon: Brain, path: '/caregiver/profile' },
  { label: 'Family', icon: Users, path: '/caregiver/family' },
];

// ── Health Worker Nav ────────────────────────────────────────────────────────
const HW_NAV = [
  { label: 'Patient List', icon: List, path: '/healthworker' },
  { label: 'QR Sync', icon: RefreshCw, path: '/healthworker/sync' },
  { label: 'Notes', icon: FileText, path: '/healthworker/notes' },
  { label: 'Report', icon: Download, path: '/healthworker/report' },
];

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const setRole = useStore(s => s.setRole);
  const clearSession = useStore(s => s.clearSession);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const role = session.role;
  const currentPatient = session.patientId ? patients[session.patientId] : null;

  const nav = role === 'patient' ? PATIENT_NAV
    : role === 'caregiver' ? CAREGIVER_NAV
    : HW_NAV;

  const roleLabel = role === 'patient' ? `👤 ${currentPatient?.name ?? 'Patient'}`
    : role === 'caregiver' ? '👨‍👩‍👧 Caregiver'
    : '🏥 Health Worker';

  const roleBg = role === 'patient' ? 'bg-indigo-50 border-indigo-200'
    : role === 'caregiver' ? 'bg-teal-50 border-teal-200'
    : 'bg-amber-50 border-amber-200';

  const handleSwitchRole = () => {
    clearSession();
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handlePatientSwitch = (pid: string) => {
    setRole('patient', pid);
    setRoleDropdownOpen(false);
    navigate('/patient');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer shrink-0" aria-label="CareCue home">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Heart size={16} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-indigo-900 text-lg hidden sm:block">CareCue</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
            {nav.map(item => {
              const active = location.pathname === item.path || (item.path !== '/patient' && item.path !== '/caregiver' && item.path !== '/healthworker' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all ${active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex-1 md:hidden" />

          {/* Sync indicator (patient / HW) */}
          {currentPatient && role === 'patient' && (
            <SyncIndicator compact lastSyncedAt={currentPatient.lastSyncedAt} pendingSyncCount={currentPatient.pendingSyncCount} />
          )}

          {/* Role dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold cursor-pointer transition-all hover:opacity-80 ${roleBg}`}
            >
              <span className="hidden sm:inline">{roleLabel}</span>
              <span className="sm:hidden">{role === 'patient' ? '👤' : role === 'caregiver' ? '👨‍👩‍👧' : '🏥'}</span>
              <ChevronDown size={14} className={`transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {roleDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl p-2 min-w-[200px] z-50">
                {role === 'caregiver' && (
                  <>
                    {Object.values(patients).map(p => (
                      <button key={p.id} onClick={() => handlePatientSwitch(p.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-xl cursor-pointer">
                        <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">{p.name[0]}</span>
                        View as {p.name.split(' ')[0]}
                      </button>
                    ))}
                    <div className="border-t my-1" />
                  </>
                )}
                <button onClick={handleSwitchRole} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl cursor-pointer">
                  <LogOut size={14} /> Switch Role
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 pt-16">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 flex flex-col gap-1">
            {nav.map((item, i) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium cursor-pointer transition-all ${active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={`flex-1 ${role === 'patient' ? 'patient-ui bg-patient-gradient' : role === 'caregiver' ? 'bg-caregiver-gradient' : 'bg-hw-gradient'}`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
