import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  Patient, Reminder, ActivityResult, Alert, ChatMessage,
  CognitiveProfile, DomainScores, SessionState, UserRole,
  Caregiver, HealthWorker, GameDifficultyState, MemoryGraph
} from '../types';

// ─── Seed Data ──────────────────────────────────────────────────────────────

const SEED_MEMORY_GRAPH: MemoryGraph = {
  people: [
    { id: 'p1', name: 'Ramen Devi', relation: 'Son', description: 'Lives in Guwahati, calls every Sunday', photoUrl: '' },
    { id: 'p2', name: 'Priya Devi', relation: 'Daughter-in-law', description: 'Ramen\'s wife, a schoolteacher', photoUrl: '' },
    { id: 'p3', name: 'Kabir', relation: 'Grandson', description: '8 years old, loves cricket', photoUrl: '' },
    { id: 'p4', name: 'Meena Baidew', relation: 'Sister', description: 'Lives in Jorhat, visits during Bihu', photoUrl: '' },
    { id: 'p5', name: 'Dr. Sharma', relation: 'Doctor', description: 'Neurologist at Gauhati Medical College', photoUrl: '' },
  ],
  places: [
    { id: 'pl1', name: 'Our House in Sivasagar', description: 'The family home for 40 years, near the Shiva Dol' },
    { id: 'pl2', name: 'Kamakhya Temple', description: 'We visit every Bohag Bihu' },
    { id: 'pl3', name: 'Ramen\'s flat in Guwahati', description: 'Panbajar area, 5th floor' },
    { id: 'pl4', name: 'Weekly Market', description: 'Every Tuesday, near the old bridge' },
  ],
  objects: [
    { id: 'o1', name: 'Medicine Box', usualLocation: 'Kitchen shelf, near the stove' },
    { id: 'o2', name: 'Reading Glasses', usualLocation: 'Beside the bed, on the nightstand' },
    { id: 'o3', name: 'Prayer Book', usualLocation: 'Puja room, on the small wooden stand' },
    { id: 'o4', name: 'Walking Stick', usualLocation: 'Front door, hanging on the hook' },
  ],
  songs: [
    { id: 's1', title: 'O Mur Apunar Desh', artist: 'Traditional Bihu' },
    { id: 's2', title: 'Aai Mur Aai', artist: 'Traditional Lullaby' },
    { id: 's3', title: 'Keshava Madhava', artist: 'Srimanta Sankardeva' },
  ],
  hobbies: ['Weaving on the loom', 'Tending the kitchen garden', 'Listening to Borgeet', 'Watching Bihu dances'],
  occupation: 'Retired weaving teacher (taught at Sivasagar Girls\' School for 28 years)',
  topicsToAvoid: ['The death of her husband Biren (2019)', 'Her memory difficulties', 'News about floods'],
  photoAlbum: [
    { id: 'ph1', url: '', caption: 'Bohag Bihu 2022 — with Ramen and Kabir', peopleIds: ['p1', 'p3'], date: '2022-04-14' },
    { id: 'ph2', url: '', caption: 'Kabir\'s first day of school', peopleIds: ['p3'], date: '2021-06-01' },
    { id: 'ph3', url: '', caption: 'Meena Baidew\'s visit, Magh Bihu 2023', peopleIds: ['p4'], date: '2023-01-15' },
    { id: 'ph4', url: '', caption: 'At Kamakhya Temple, family pilgrimage', peopleIds: ['p1', 'p2', 'p3'], date: '2020-04-14' },
  ],
};

const SEED_ROUTINE = [
  { id: 'r1', label: 'Wake Up & Morning Prayers', time: '06:30', emoji: '🙏', order: 1, completed: false },
  { id: 'r2', label: 'Morning Tea', time: '07:00', emoji: '☕', order: 2, completed: false },
  { id: 'r3', label: 'Bath & Getting Ready', time: '07:30', emoji: '🚿', order: 3, completed: false },
  { id: 'r4', label: 'Breakfast', time: '08:30', emoji: '🍽️', order: 4, completed: false },
  { id: 'r5', label: 'Morning Medicine', time: '09:00', emoji: '💊', order: 5, completed: false },
  { id: 'r6', label: 'Morning Walk', time: '09:30', emoji: '🚶', order: 6, completed: false },
  { id: 'r7', label: 'Lunch', time: '13:00', emoji: '🍛', order: 7, completed: false },
  { id: 'r8', label: 'Afternoon Rest', time: '14:00', emoji: '😴', order: 8, completed: false },
  { id: 'r9', label: 'Evening Tea & Snack', time: '16:00', emoji: '🫖', order: 9, completed: false },
  { id: 'r10', label: 'Activity / Game Time', time: '17:00', emoji: '🎮', order: 10, completed: false },
  { id: 'r11', label: 'Dinner', time: '20:00', emoji: '🌙', order: 11, completed: false },
  { id: 'r12', label: 'Night Medicine', time: '21:00', emoji: '💊', order: 12, completed: false },
  { id: 'r13', label: 'Bedtime', time: '21:30', emoji: '🛏️', order: 13, completed: false },
];

function makeDomainScores(base: Partial<DomainScores> = {}): DomainScores {
  return {
    memory: 72,
    attention: 68,
    sequencing: 75,
    recognition: 80,
    auditoryComprehension: 70,
    ...base,
  };
}

function makeHistory(): { date: string; scores: DomainScores }[] {
  const now = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (13 - i));
    const jitter = () => Math.floor(Math.random() * 16) - 8;
    return {
      date: d.toISOString().split('T')[0],
      scores: {
        memory: Math.max(30, Math.min(95, 72 + jitter())),
        attention: Math.max(30, Math.min(95, 68 + jitter())),
        sequencing: Math.max(30, Math.min(95, 75 + jitter())),
        recognition: Math.max(30, Math.min(95, 80 + jitter())),
        auditoryComprehension: Math.max(30, Math.min(95, 70 + jitter())),
      },
    };
  });
}

const SEED_COGNITIVE: CognitiveProfile = {
  baseline: makeDomainScores(),
  current: makeDomainScores({ memory: 68, attention: 65 }),
  history: makeHistory(),
  dailyFunctioning: {
    medicineAdherence: 80,
    hydrationAdherence: 65,
    routineCompletion: 72,
    socialInteractionCount: 3,
  },
};

const SEED_REMINDERS: Reminder[] = [
  { id: 'rem1', patientId: 'patient-1', type: 'medicine', label: 'Aricept (Donepezil) 5mg', time: '09:00', status: 'pending' },
  { id: 'rem2', patientId: 'patient-1', type: 'hydration', label: 'Drink a glass of water', time: '10:00', status: 'pending' },
  { id: 'rem3', patientId: 'patient-1', type: 'medicine', label: 'Vitamin D supplement', time: '13:00', status: 'pending' },
  { id: 'rem4', patientId: 'patient-1', type: 'hydration', label: 'Afternoon water', time: '15:00', status: 'pending' },
  { id: 'rem5', patientId: 'patient-1', type: 'familyCall', label: 'Call from Ramen', time: '18:00', status: 'pending' },
  { id: 'rem6', patientId: 'patient-1', type: 'medicine', label: 'Night medicine', time: '21:00', status: 'pending' },
  { id: 'rem7', patientId: 'patient-1', type: 'appointment', label: 'Dr. Sharma — Neurology check-up', time: '11:00', status: 'pending', notes: 'At Gauhati Medical College, bring prescription card' },
];

const SEED_ACTIVITY_LOG: ActivityResult[] = [
  { id: 'act1', gameId: 'memory-basket', date: new Date(Date.now() - 86400000).toISOString(), accuracy: 75, responseTimeMs: 4200, hintsUsed: 1, retries: 0, difficultyLevel: 2, abandoned: false, breakRequested: false },
  { id: 'act2', gameId: 'my-memory-box', date: new Date(Date.now() - 86400000 * 2).toISOString(), accuracy: 88, responseTimeMs: 3800, hintsUsed: 0, retries: 0, difficultyLevel: 2, abandoned: false, breakRequested: false },
  { id: 'act3', gameId: 'recipe-recall', date: new Date(Date.now() - 86400000 * 3).toISOString(), accuracy: 60, responseTimeMs: 6100, hintsUsed: 2, retries: 1, difficultyLevel: 2, abandoned: false, breakRequested: false },
  { id: 'act4', gameId: 'daily-sequencer', date: new Date(Date.now() - 86400000 * 4).toISOString(), accuracy: 82, responseTimeMs: 3500, hintsUsed: 1, retries: 0, difficultyLevel: 2, abandoned: false, breakRequested: false },
];

const SEED_PATIENT: Patient = {
  id: 'patient-1',
  name: 'Anima Devi',
  age: 72,
  preferredLanguage: 'Assamese',
  contentPackId: 'assamese',
  memoryGraph: SEED_MEMORY_GRAPH,
  routine: SEED_ROUTINE,
  reminders: SEED_REMINDERS,
  cognitiveProfile: SEED_COGNITIVE,
  activityLog: SEED_ACTIVITY_LOG,
  familyMembers: [
    { id: 'fm1', name: 'Ramen Devi', relation: 'Son', phone: '+91-98540-00001' },
    { id: 'fm2', name: 'Priya Devi', relation: 'Daughter-in-law', phone: '+91-98540-00002' },
    { id: 'fm3', name: 'Meena Baidew', relation: 'Sister', phone: '+91-98540-00003' },
  ],
  linkedCaregiverId: 'caregiver-1',
  linkedHealthWorkerId: 'hw-1',
  lastSyncedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  pendingSyncCount: 4,
};

const SEED_PATIENT_2: Patient = {
  id: 'patient-2',
  name: 'Hemanta Bora',
  age: 68,
  preferredLanguage: 'English',
  contentPackId: 'english',
  memoryGraph: {
    people: [
      { id: 'p21', name: 'Dipali Bora', relation: 'Wife', description: 'Primary caregiver at home' },
      { id: 'p22', name: 'Nilufar', relation: 'Daughter', description: 'Works in Kolkata as a doctor' },
    ],
    places: [
      { id: 'pl21', name: 'Family Home, Jorhat', description: 'Near the tea garden' },
    ],
    objects: [
      { id: 'o21', name: 'Walking Stick', usualLocation: 'Front door' },
      { id: 'o22', name: 'Medicine Box', usualLocation: 'Bedside table' },
    ],
    songs: [{ id: 'sg21', title: 'Jana Gana Mana', artist: 'National Anthem' }],
    hobbies: ['Reading newspapers', 'Listening to radio', 'Chess'],
    occupation: 'Retired bank manager',
    topicsToAvoid: ['Financial worries', 'Partition stories'],
    photoAlbum: [
      { id: 'ph21', url: '', caption: 'Nilufar\'s graduation ceremony', peopleIds: ['p22'], date: '2015-06-01' },
    ],
  },
  routine: SEED_ROUTINE.map(s => ({ ...s, id: 'p2-' + s.id, completed: false })),
  reminders: [
    { id: 'rem-p2-1', patientId: 'patient-2', type: 'medicine', label: 'Blood pressure tablet', time: '08:00', status: 'taken', confirmedBy: 'patient' },
    { id: 'rem-p2-2', patientId: 'patient-2', type: 'medicine', label: 'Evening tablet', time: '18:00', status: 'pending' },
  ],
  cognitiveProfile: {
    baseline: makeDomainScores({ memory: 65, attention: 62 }),
    current: makeDomainScores({ memory: 60, attention: 58, sequencing: 70 }),
    history: makeHistory(),
    dailyFunctioning: {
      medicineAdherence: 90,
      hydrationAdherence: 75,
      routineCompletion: 80,
      socialInteractionCount: 2,
    },
  },
  activityLog: [],
  familyMembers: [
    { id: 'fm21', name: 'Dipali Bora', relation: 'Wife' },
    { id: 'fm22', name: 'Nilufar', relation: 'Daughter' },
  ],
  linkedCaregiverId: 'caregiver-1',
  linkedHealthWorkerId: 'hw-1',
  lastSyncedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  pendingSyncCount: 12,
};

const SEED_CAREGIVER: Caregiver = {
  id: 'caregiver-1',
  name: 'Ramen Devi',
  linkedPatientIds: ['patient-1', 'patient-2'],
};

const SEED_HW: HealthWorker = {
  id: 'hw-1',
  name: 'ASHA Worker Bonita',
  linkedPatientIds: ['patient-1', 'patient-2'],
};

const SEED_ALERTS: Alert[] = [
  {
    id: 'alert1',
    patientId: 'patient-1',
    severity: 'attention',
    message: 'Memory accuracy dropped significantly in last session',
    triggeredBy: 'memory-basket',
    statLabel: 'Memory Basket accuracy',
    statCurrent: 55,
    statBaseline: 75,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert2',
    patientId: 'patient-1',
    severity: 'info',
    message: 'Hydration reminder snoozed twice today',
    statLabel: 'Hydration adherence',
    statCurrent: '65%',
    statBaseline: '80%',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    acknowledged: false,
  },
];

const SEED_NOTES: Record<string, { id: string; text: string; timestamp: string }[]> = {
  'patient-1': [
    { id: 'note1', text: 'Patient was in good spirits during visit. Responded well to family photos.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'note2', text: 'Slight confusion about day of week. Reminded about weekly market on Tuesday.', timestamp: new Date(Date.now() - 86400000).toISOString() },
  ],
  'patient-2': [
    { id: 'note3', text: 'Blood pressure stable. Patient reading newspaper daily.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  ],
};

// ─── Game Difficulty State ────────────────────────────────────────────────────

const GAME_IDS = [
  'memory-basket', 'my-memory-box', 'recipe-recall', 'sound-detective',
  'simon-says', 'weaving-tracker', 'pattern-builder', 'daily-sequencer',
  'festival-memory', 'object-detective', 'familiar-pattern', 'landmark-puzzle',
  'story-circle', 'music-rhythm', 'family-music',
];

function makeInitialDifficulty(): GameDifficultyState {
  const state: GameDifficultyState = {};
  ['patient-1', 'patient-2'].forEach(pid => {
    state[pid] = {};
    GAME_IDS.forEach(gid => { state[pid][gid] = 2; });
  });
  return state;
}

// ─── Domain Score Update Logic ────────────────────────────────────────────────

const GAME_DOMAIN_MAP: Record<string, keyof DomainScores> = {
  'memory-basket': 'memory',
  'my-memory-box': 'memory',
  'recipe-recall': 'sequencing',
  'sound-detective': 'auditoryComprehension',
  'simon-says': 'attention',
  'weaving-tracker': 'attention',
  'pattern-builder': 'attention',
  'daily-sequencer': 'sequencing',
  'festival-memory': 'memory',
  'object-detective': 'recognition',
  'familiar-pattern': 'recognition',
  'landmark-puzzle': 'recognition',
  'story-circle': 'memory',
  'music-rhythm': 'auditoryComprehension',
  'family-music': 'auditoryComprehension',
};

function recomputeCurrentScores(profile: CognitiveProfile, log: ActivityResult[]): DomainScores {
  const recentLog = log.slice(-20);
  const domainAccs: Record<string, number[]> = {
    memory: [], attention: [], sequencing: [], recognition: [], auditoryComprehension: [],
  };
  recentLog.forEach(r => {
    const domain = GAME_DOMAIN_MAP[r.gameId] ?? 'memory';
    domainAccs[domain].push(r.accuracy);
  });
  const avg = (arr: number[], fallback: number) =>
    arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : fallback;
  return {
    memory: avg(domainAccs.memory, profile.current.memory),
    attention: avg(domainAccs.attention, profile.current.attention),
    sequencing: avg(domainAccs.sequencing, profile.current.sequencing),
    recognition: avg(domainAccs.recognition, profile.current.recognition),
    auditoryComprehension: avg(domainAccs.auditoryComprehension, profile.current.auditoryComprehension),
  };
}

function calcAdaptiveDifficulty(current: number, accuracy: number, hints: number, retries: number): number {
  if (accuracy >= 85 && hints <= 1) return Math.min(5, current + 1);
  if (accuracy < 50 || retries >= 2) return Math.max(1, current - 1);
  return current;
}

function generateAlert(patientId: string, result: ActivityResult, avgAcc: number): Alert | null {
  const drop = avgAcc - result.accuracy;
  if (drop >= 20 || result.hintsUsed >= 4) {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      patientId,
      severity: 'attention',
      message: `Performance dip in ${result.gameId.replace(/-/g, ' ')}`,
      triggeredBy: result.gameId,
      statLabel: 'Accuracy (this session vs. rolling avg)',
      statCurrent: result.accuracy,
      statBaseline: Math.round(avgAcc),
      createdAt: new Date().toISOString(),
      acknowledged: false,
    };
  }
  return null;
}

// ─── Store Type ───────────────────────────────────────────────────────────────

interface CareCueStore {
  // Data
  patients: Record<string, Patient>;
  caregivers: Record<string, Caregiver>;
  healthWorkers: Record<string, HealthWorker>;
  alerts: Alert[];
  chatMessages: ChatMessage[];
  gameDifficulty: GameDifficultyState;
  hwNotes: Record<string, { id: string; text: string; timestamp: string }[]>;
  chatUsageToday: Record<string, number>; // patientId → count

  // Session
  session: SessionState;

  // Actions — Session
  setRole: (role: UserRole, patientId?: string, caregiverId?: string, healthWorkerId?: string) => void;
  clearSession: () => void;

  // Actions — Reminders
  updateReminderStatus: (patientId: string, reminderId: string, status: Reminder['status'], confirmedBy?: Reminder['confirmedBy']) => void;
  addReminder: (patientId: string, reminder: Omit<Reminder, 'id'>) => void;
  deleteReminder: (patientId: string, reminderId: string) => void;
  updateReminder: (patientId: string, reminderId: string, patch: Partial<Reminder>) => void;

  // Actions — Activity / Games
  recordActivityResult: (patientId: string, result: Omit<ActivityResult, 'id'>) => ActivityResult;
  getNextDifficulty: (patientId: string, gameId: string) => number;

  // Actions — Alerts
  acknowledgeAlert: (alertId: string) => void;

  // Actions — Chat
  addChatMessage: (msg: Omit<ChatMessage, 'id'>) => void;

  // Actions — Memory Graph
  updateMemoryGraph: (patientId: string, patch: Partial<Patient['memoryGraph']>) => void;

  // Actions — HW Notes
  addNote: (patientId: string, text: string) => void;

  // Actions — Routine
  completeRoutineStep: (patientId: string, stepId: string) => void;

  // Actions — Sync Simulation
  simulateSync: (patientId: string) => { syncedAt: string; itemsSynced: number };

  // Actions — Social Interaction
  incrementSocialInteraction: (patientId: string) => void;

  // Computed helpers
  getPatient: (id: string) => Patient | undefined;
  getPendingReminders: (patientId: string) => Reminder[];
  getUnacknowledgedAlerts: (patientId: string) => Alert[];
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useStore = create<CareCueStore>()(
  subscribeWithSelector((set, get) => ({
    patients: {
      'patient-1': SEED_PATIENT,
      'patient-2': SEED_PATIENT_2,
    },
    caregivers: { 'caregiver-1': SEED_CAREGIVER },
    healthWorkers: { 'hw-1': SEED_HW },
    alerts: SEED_ALERTS,
    chatMessages: [],
    gameDifficulty: makeInitialDifficulty(),
    hwNotes: SEED_NOTES,
    chatUsageToday: {},
    session: { role: null, patientId: null, caregiverId: null, healthWorkerId: null },

    // Session
    setRole: (role, patientId, caregiverId, healthWorkerId) => {
      set({ session: { role, patientId: patientId ?? null, caregiverId: caregiverId ?? null, healthWorkerId: healthWorkerId ?? null } });
    },
    clearSession: () => set({ session: { role: null, patientId: null, caregiverId: null, healthWorkerId: null } }),

    // Reminders
    updateReminderStatus: (patientId, reminderId, status, confirmedBy) => {
      set(state => {
        const patient = state.patients[patientId];
        if (!patient) return state;
        const updatedReminders = patient.reminders.map(r =>
          r.id === reminderId ? { ...r, status, confirmedBy: confirmedBy ?? r.confirmedBy } : r
        );
        // Update daily functioning
        const total = updatedReminders.filter(r => r.type === 'medicine').length;
        const taken = updatedReminders.filter(r => r.type === 'medicine' && r.status === 'taken').length;
        const hydTotal = updatedReminders.filter(r => r.type === 'hydration').length;
        const hydTaken = updatedReminders.filter(r => r.type === 'hydration' && r.status === 'taken').length;
        const medAdherence = total > 0 ? Math.round((taken / total) * 100) : patient.cognitiveProfile.dailyFunctioning.medicineAdherence;
        const hydAdherence = hydTotal > 0 ? Math.round((hydTaken / hydTotal) * 100) : patient.cognitiveProfile.dailyFunctioning.hydrationAdherence;

        return {
          patients: {
            ...state.patients,
            [patientId]: {
              ...patient,
              reminders: updatedReminders,
              cognitiveProfile: {
                ...patient.cognitiveProfile,
                dailyFunctioning: {
                  ...patient.cognitiveProfile.dailyFunctioning,
                  medicineAdherence: medAdherence,
                  hydrationAdherence: hydAdherence,
                },
              },
              pendingSyncCount: patient.pendingSyncCount + 1,
            },
          },
        };
      });
    },

    addReminder: (patientId, reminder) => {
      set(state => {
        const patient = state.patients[patientId];
        if (!patient) return state;
        const newReminder: Reminder = { ...reminder, id: `rem-${Date.now()}` };
        return {
          patients: {
            ...state.patients,
            [patientId]: { ...patient, reminders: [...patient.reminders, newReminder] },
          },
        };
      });
    },

    deleteReminder: (patientId, reminderId) => {
      set(state => {
        const patient = state.patients[patientId];
        if (!patient) return state;
        return {
          patients: {
            ...state.patients,
            [patientId]: { ...patient, reminders: patient.reminders.filter(r => r.id !== reminderId) },
          },
        };
      });
    },

    updateReminder: (patientId, reminderId, patch) => {
      set(state => {
        const patient = state.patients[patientId];
        if (!patient) return state;
        return {
          patients: {
            ...state.patients,
            [patientId]: {
              ...patient,
              reminders: patient.reminders.map(r => r.id === reminderId ? { ...r, ...patch } : r),
            },
          },
        };
      });
    },

    // Activity / Games
    recordActivityResult: (patientId, resultInput) => {
      const result: ActivityResult = { ...resultInput, id: `act-${Date.now()}` };
      set(state => {
        const patient = state.patients[patientId];
        if (!patient) return state;
        const newLog = [...patient.activityLog, result];

        // Recompute cognitive scores
        const newScores = recomputeCurrentScores(patient.cognitiveProfile, newLog);
        const today = new Date().toISOString().split('T')[0];
        const existingHistIdx = patient.cognitiveProfile.history.findIndex(h => h.date === today);
        const newHistory = existingHistIdx >= 0
          ? patient.cognitiveProfile.history.map((h, i) => i === existingHistIdx ? { ...h, scores: newScores } : h)
          : [...patient.cognitiveProfile.history, { date: today, scores: newScores }];

        // Adaptive difficulty
        const currentDiff = state.gameDifficulty[patientId]?.[result.gameId] ?? 2;
        // Compute rolling average accuracy for this game
        const gameLog = newLog.filter(a => a.gameId === result.gameId && !a.abandoned);
        const avgAcc = gameLog.length > 1
          ? gameLog.slice(0, -1).reduce((s, a) => s + a.accuracy, 0) / (gameLog.length - 1)
          : result.accuracy;
        const newDiff = calcAdaptiveDifficulty(currentDiff, result.accuracy, result.hintsUsed, result.retries);

        // Generate alert if needed
        const maybeAlert = generateAlert(patientId, result, avgAcc);
        const newAlerts = maybeAlert ? [...state.alerts, maybeAlert] : state.alerts;

        // Routine completion
        const completedSteps = newLog.filter(a => !a.abandoned).length;
        const routineCompletion = Math.min(100, Math.round((completedSteps / 5) * 100));

        return {
          patients: {
            ...state.patients,
            [patientId]: {
              ...patient,
              activityLog: newLog,
              cognitiveProfile: {
                ...patient.cognitiveProfile,
                current: newScores,
                history: newHistory,
                dailyFunctioning: {
                  ...patient.cognitiveProfile.dailyFunctioning,
                  routineCompletion,
                },
              },
              pendingSyncCount: patient.pendingSyncCount + 1,
            },
          },
          gameDifficulty: {
            ...state.gameDifficulty,
            [patientId]: {
              ...state.gameDifficulty[patientId],
              [result.gameId]: newDiff,
            },
          },
          alerts: newAlerts,
        };
      });
      return result;
    },

    getNextDifficulty: (patientId, gameId) => {
      return get().gameDifficulty[patientId]?.[gameId] ?? 2;
    },

    // Alerts
    acknowledgeAlert: (alertId) => {
      set(state => ({
        alerts: state.alerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a),
      }));
    },

    // Chat
    addChatMessage: (msg) => {
      const newMsg: ChatMessage = { ...msg, id: `chat-${Date.now()}` };
      set(state => {
        const todayCount = state.chatUsageToday[msg.patientId] ?? 0;
        return {
          chatMessages: [...state.chatMessages, newMsg],
          chatUsageToday: {
            ...state.chatUsageToday,
            [msg.patientId]: msg.sender === 'patient' ? todayCount + 1 : todayCount,
          },
        };
      });
      return newMsg;
    },

    // Memory Graph
    updateMemoryGraph: (patientId, patch) => {
      set(state => {
        const patient = state.patients[patientId];
        if (!patient) return state;
        return {
          patients: {
            ...state.patients,
            [patientId]: { ...patient, memoryGraph: { ...patient.memoryGraph, ...patch } },
          },
        };
      });
    },

    // HW Notes
    addNote: (patientId, text) => {
      set(state => ({
        hwNotes: {
          ...state.hwNotes,
          [patientId]: [
            ...(state.hwNotes[patientId] ?? []),
            { id: `note-${Date.now()}`, text, timestamp: new Date().toISOString() },
          ],
        },
      }));
    },

    // Routine
    completeRoutineStep: (patientId, stepId) => {
      set(state => {
        const patient = state.patients[patientId];
        if (!patient) return state;
        const updatedRoutine = patient.routine.map(s => s.id === stepId ? { ...s, completed: true } : s);
        const completedCount = updatedRoutine.filter(s => s.completed).length;
        const completion = Math.round((completedCount / updatedRoutine.length) * 100);
        return {
          patients: {
            ...state.patients,
            [patientId]: {
              ...patient,
              routine: updatedRoutine,
              cognitiveProfile: {
                ...patient.cognitiveProfile,
                dailyFunctioning: {
                  ...patient.cognitiveProfile.dailyFunctioning,
                  routineCompletion: completion,
                },
              },
            },
          },
        };
      });
    },

    // Sync
    simulateSync: (patientId) => {
      const syncedAt = new Date().toISOString();
      const itemsSynced = get().patients[patientId]?.pendingSyncCount ?? 0;
      set(state => ({
        patients: {
          ...state.patients,
          [patientId]: {
            ...state.patients[patientId],
            lastSyncedAt: syncedAt,
            pendingSyncCount: 0,
          },
        },
      }));
      return { syncedAt, itemsSynced };
    },

    // Social
    incrementSocialInteraction: (patientId) => {
      set(state => {
        const patient = state.patients[patientId];
        if (!patient) return state;
        return {
          patients: {
            ...state.patients,
            [patientId]: {
              ...patient,
              cognitiveProfile: {
                ...patient.cognitiveProfile,
                dailyFunctioning: {
                  ...patient.cognitiveProfile.dailyFunctioning,
                  socialInteractionCount: patient.cognitiveProfile.dailyFunctioning.socialInteractionCount + 1,
                },
              },
            },
          },
        };
      });
    },

    // Computed
    getPatient: (id) => get().patients[id],
    getPendingReminders: (patientId) =>
      get().patients[patientId]?.reminders.filter(r => r.status === 'pending') ?? [],
    getUnacknowledgedAlerts: (patientId) =>
      get().alerts.filter(a => a.patientId === patientId && !a.acknowledged),
  }))
);

export { GAME_IDS };
