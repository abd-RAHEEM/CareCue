// CareCue - Complete TypeScript Type Definitions
// These interfaces form the shared contract between frontend and backend teammates

export interface Patient {
  id: string;
  name: string;
  age: number;
  preferredLanguage: string;
  contentPackId: string;
  memoryGraph: MemoryGraph;
  routine: RoutineStep[];
  reminders: Reminder[];
  cognitiveProfile: CognitiveProfile;
  activityLog: ActivityResult[];
  familyMembers: FamilyMember[];
  linkedCaregiverId: string;
  linkedHealthWorkerId: string;
  lastSyncedAt: string;
  pendingSyncCount: number;
  photoUrl?: string;
}

export interface MemoryGraph {
  people: MemoryPerson[];
  places: MemoryPlace[];
  objects: MemoryObject[];
  songs: MemorySong[];
  hobbies: string[];
  occupation: string;
  topicsToAvoid: string[];
  photoAlbum: PhotoAlbumEntry[];
}

export interface MemoryPerson {
  id: string;
  name: string;
  relation: string;
  photoUrl?: string;
  voiceNoteUrl?: string;
  description?: string;
}

export interface MemoryPlace {
  id: string;
  name: string;
  photoUrl?: string;
  description?: string;
}

export interface MemoryObject {
  id: string;
  name: string;
  usualLocation: string;
  photoUrl?: string;
}

export interface MemorySong {
  id: string;
  title: string;
  artist?: string;
  language?: string;
}

export interface PhotoAlbumEntry {
  id: string;
  url: string;
  caption?: string;
  peopleIds: string[];
  date?: string;
}

export interface RoutineStep {
  id: string;
  label: string;
  time?: string;
  icon?: string;
  order: number;
  completed?: boolean;
}

export interface Reminder {
  id: string;
  patientId: string;
  type: 'medicine' | 'hydration' | 'meal' | 'appointment' | 'familyCall' | 'exercise';
  label: string;
  time: string;
  status: 'pending' | 'taken' | 'snoozed' | 'needHelp' | 'missed';
  confirmedBy?: 'patient' | 'caregiver' | 'healthWorker' | 'unconfirmed';
  notes?: string;
}

export interface DomainScores {
  memory: number;
  attention: number;
  sequencing: number;
  recognition: number;
  auditoryComprehension: number;
}

export interface CognitiveProfile {
  baseline: DomainScores;
  current: DomainScores;
  history: { date: string; scores: DomainScores }[];
  dailyFunctioning: DailyFunctioning;
}

export interface DailyFunctioning {
  medicineAdherence: number;
  hydrationAdherence: number;
  routineCompletion: number;
  socialInteractionCount: number;
}

export interface ActivityResult {
  id: string;
  gameId: string;
  date: string;
  accuracy: number;
  responseTimeMs: number;
  hintsUsed: number;
  retries: number;
  difficultyLevel: number;
  abandoned: boolean;
  breakRequested: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone?: string;
}

export interface Alert {
  id: string;
  patientId: string;
  severity: 'info' | 'attention';
  message: string;
  triggeredBy?: string;
  statLabel?: string;
  statCurrent?: number | string;
  statBaseline?: number | string;
  createdAt: string;
  acknowledged: boolean;
}

export interface ChatMessage {
  id: string;
  patientId: string;
  sender: 'patient' | 'assistant';
  text: string;
  timestamp: string;
  escalateToCaregiver?: boolean;
}

// Game difficulty state per patient per game
export interface GameDifficultyState {
  [patientId: string]: {
    [gameId: string]: number; // 1-5
  };
}

// Role session
export type UserRole = 'patient' | 'caregiver' | 'healthWorker';

export interface SessionState {
  role: UserRole | null;
  patientId: string | null;
  caregiverId: string | null;
  healthWorkerId: string | null;
}

// Caregiver
export interface Caregiver {
  id: string;
  name: string;
  linkedPatientIds: string[];
}

// Health Worker
export interface HealthWorker {
  id: string;
  name: string;
  linkedPatientIds: string[];
}

// Content pack shape
export interface ContentPack {
  id: string;
  language: string;
  name: string;
  objects: ContentItem[];
  foods: ContentItem[];
  festivals: ContentFestival[];
  songs: ContentSong[];
  textiles: ContentItem[];
  landmarks: ContentItem[];
  routineSteps: ContentItem[];
  sounds: ContentSound[];
}

export interface ContentItem {
  id: string;
  label: string;
  emoji?: string;
  imageKey?: string;
}

export interface ContentFestival {
  id: string;
  name: string;
  month: number;
  emoji?: string;
  description: string;
}

export interface ContentSong {
  id: string;
  title: string;
  artist?: string;
  lyrics?: string[];
}

export interface ContentSound {
  id: string;
  label: string;
  emoji?: string;
  category: string;
}

// API response shapes
export interface AssistantReply {
  reply: string;
  escalateToCaregiver: boolean;
}

export interface SyncResult {
  syncedAt: string;
  itemsSynced: number;
}
