import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleSelector } from './components/RoleSelector';
import { AppShell } from './components/AppShell';

// Patient role views
import { PatientHome } from './roles/patient/PatientHome';
import { PatientReminders } from './roles/patient/PatientReminders';
import { PatientActivities } from './roles/patient/PatientActivities';
import { PatientMemoryFamily } from './roles/patient/PatientMemoryFamily';
import { PatientChat } from './roles/patient/PatientChat';

// Caregiver role views
import { CaregiverDashboard } from './roles/caregiver/CaregiverDashboard';
import { CaregiverMemoryBuilder } from './roles/caregiver/CaregiverMemoryBuilder';
import { CaregiverReminders } from './roles/caregiver/CaregiverReminders';
import { CaregiverCognitiveProfile } from './roles/caregiver/CaregiverCognitiveProfile';
import { CaregiverFamilyCommunity } from './roles/caregiver/CaregiverFamilyCommunity';

// Health Worker role views
import { HWPatientList } from './roles/healthworker/HWPatientList';
import { HWPatientSummary } from './roles/healthworker/HWPatientSummary';
import { HWNotes } from './roles/healthworker/HWNotes';
import { HWExportReport } from './roles/healthworker/HWExportReport';

// All 15 Games
import { MemoryBasket } from './games/MemoryBasket';
import { MyMemoryBox } from './games/MyMemoryBox';
import { RecipeRecall } from './games/RecipeRecall';
import { SoundDetective } from './games/SoundDetective';
import { SimonSays } from './games/SimonSays';
import { WeavingTracker } from './games/WeavingTracker';
import { PatternBuilder } from './games/PatternBuilder';
import { DailyLifeSequencer } from './games/DailyLifeSequencer';
import { FestivalMemory } from './games/FestivalMemory';
import { ObjectDetective } from './games/ObjectDetective';
import { FamiliarPatternMatch } from './games/FamiliarPatternMatch';
import { LandmarkPuzzle } from './games/LandmarkPuzzle';
import { StoryCircle } from './games/StoryCircle';
import { MusicRhythm } from './games/MusicRhythm';
import { FamilyMusic } from './games/FamilyMusic';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Role Selector */}
        <Route path="/" element={<RoleSelector />} />

        {/* Patient Role Views inside AppShell */}
        <Route element={<AppShell />}>
          <Route path="/patient" element={<PatientHome />} />
          <Route path="/patient/reminders" element={<PatientReminders />} />
          <Route path="/patient/activities" element={<PatientActivities />} />
          <Route path="/patient/memory" element={<PatientMemoryFamily />} />
          <Route path="/patient/chat" element={<PatientChat />} />

          {/* 15 Cognitive Games */}
          <Route path="/patient/games/memory-basket" element={<MemoryBasket />} />
          <Route path="/patient/games/my-memory-box" element={<MyMemoryBox />} />
          <Route path="/patient/games/recipe-recall" element={<RecipeRecall />} />
          <Route path="/patient/games/sound-detective" element={<SoundDetective />} />
          <Route path="/patient/games/simon-says" element={<SimonSays />} />
          <Route path="/patient/games/weaving-tracker" element={<WeavingTracker />} />
          <Route path="/patient/games/pattern-builder" element={<PatternBuilder />} />
          <Route path="/patient/games/daily-sequencer" element={<DailyLifeSequencer />} />
          <Route path="/patient/games/festival-memory" element={<FestivalMemory />} />
          <Route path="/patient/games/object-detective" element={<ObjectDetective />} />
          <Route path="/patient/games/familiar-pattern" element={<FamiliarPatternMatch />} />
          <Route path="/patient/games/landmark-puzzle" element={<LandmarkPuzzle />} />
          <Route path="/patient/games/story-circle" element={<StoryCircle />} />
          <Route path="/patient/games/music-rhythm" element={<MusicRhythm />} />
          <Route path="/patient/games/family-music" element={<FamilyMusic />} />

          {/* Caregiver Role Views */}
          <Route path="/caregiver" element={<CaregiverDashboard />} />
          <Route path="/caregiver/memory" element={<CaregiverMemoryBuilder />} />
          <Route path="/caregiver/reminders" element={<CaregiverReminders />} />
          <Route path="/caregiver/profile" element={<CaregiverCognitiveProfile />} />
          <Route path="/caregiver/family" element={<CaregiverFamilyCommunity />} />

          {/* Health Worker Role Views */}
          <Route path="/healthworker" element={<HWPatientList />} />
          <Route path="/healthworker/summary/:patientId?" element={<HWPatientSummary />} />
          <Route path="/healthworker/notes" element={<HWNotes />} />
          <Route path="/healthworker/report" element={<HWExportReport />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
