# CareCue

CareCue is an offline-first, voice-first cognitive care platform frontend designed for older adults, caregivers, and health workers. This repository contains the **frontend application** built with React, TypeScript, Vite, Zustand, Tailwind CSS, and Framer Motion.

The current implementation is designed as a realistic frontend prototype with seeded local data and clearly defined API swap points for connecting a production backend later.

> **Important:** CareCue is a software prototype and should not be treated as a medical diagnostic or treatment system. The cognitive scores, reminders, alerts, and assistant behavior in the current frontend use seeded/mock data unless a real backend is configured.

## Highlights

- Three role-based experiences: **Patient, Caregiver, Health Worker**
- Patient-focused dashboard, reminders, activities, family memory, and assistant
- **15 cognitive games** covering memory, attention, recognition, sequencing, auditory comprehension, and related skills
- Cognitive profile visualization and activity history
- Adaptive game difficulty state with a backend/ML swap point
- Memory graph for people, places, objects, songs, hobbies, and photo memories
- Routine and reminder workflows
- Caregiver alerts and health-worker reporting views
- English and Assamese content packs
- Mock/offline data mode for frontend development
- API abstraction ready for a future HTTP backend
- Responsive UI with animation libraries and reusable components

## Tech Stack

| Area | Technology |
| --- | --- |
| UI | React 19 + TypeScript |
| Build tool | Vite |
| Routing | React Router |
| State | Zustand |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion, GSAP, Anime.js, AOS |
| Icons | Lucide React |
| Charts | Recharts |
| Linting | Oxlint |

## Application Architecture

```text
Browser
  |
  v
src/main.tsx
  |
  v
src/App.tsx
  |
  +-------------------- Role Selector --------------------+
  |                                                       |
  +--> Patient routes                                     |
  |      |                                                |
  |      +--> Home / Reminders / Activities / Memory     |
  |      +--> Assistant                                   |
  |      +--> 15 Cognitive Games                          |
  |                                                       |
  +--> Caregiver routes                                   |
  |      +--> Dashboard / Memory / Reminders             |
  |      +--> Cognitive Profile / Family Community        |
  |                                                       |
  +--> Health Worker routes                               |
         +--> Patient List / Patient Summary              |
         +--> Notes / Export Report                       |

Shared application state
  |
  v
src/store/store.ts
  |
  +--> Patients / caregivers / health workers
  +--> Reminders / alerts / activity results
  +--> Cognitive profiles / difficulty state
  +--> Memory graph / routine / chat state

Service boundary
  |
  v
src/api/*.ts
  |
  +--> Mock Zustand-backed implementation
  |
  +--> Real HTTP backend implementation
```

## Project Structure

```text
.
├── public/
├── src/
│   ├── api/
│   │   ├── activityApi.ts
│   │   ├── alertApi.ts
│   │   ├── assistantApi.ts
│   │   ├── cognitiveProfileApi.ts
│   │   ├── config.ts
│   │   ├── memoryGraphApi.ts
│   │   ├── patientApi.ts
│   │   ├── reminderApi.ts
│   │   └── syncApi.ts
│   │
│   ├── assets/
│   ├── components/
│   │   ├── AlertChip.tsx
│   │   ├── AppShell.tsx
│   │   ├── Button.tsx
│   │   ├── CognitiveDomainChart.tsx
│   │   ├── ReminderCard.tsx
│   │   ├── RoleSelector.tsx
│   │   └── SyncIndicator.tsx
│   │
│   ├── content-packs/
│   │   ├── assamese.json
│   │   └── english.json
│   │
│   ├── games/
│   │   ├── GameShell.tsx
│   │   ├── MemoryBasket.tsx
│   │   ├── MyMemoryBox.tsx
│   │   ├── RecipeRecall.tsx
│   │   ├── SoundDetective.tsx
│   │   ├── SimonSays.tsx
│   │   ├── WeavingTracker.tsx
│   │   ├── PatternBuilder.tsx
│   │   ├── DailyLifeSequencer.tsx
│   │   ├── FestivalMemory.tsx
│   │   ├── ObjectDetective.tsx
│   │   ├── FamiliarPatternMatch.tsx
│   │   ├── LandmarkPuzzle.tsx
│   │   ├── StoryCircle.tsx
│   │   ├── MusicRhythm.tsx
│   │   └── FamilyMusic.tsx
│   │
│   ├── roles/
│   │   ├── patient/
│   │   ├── caregiver/
│   │   └── healthworker/
│   │
│   ├── store/
│   │   └── store.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

## User Roles

### Patient

The patient experience is optimized for simple, familiar interactions. It includes:

- Personal home dashboard
- Reminders and daily routine
- Cognitive activity launcher
- Memory and family information
- Conversational assistant
- 15 cognitive games
- Sync status and alerts

Routes are under `/patient` and `/patient/games/*`.

### Caregiver

The caregiver experience focuses on supervising a linked patient:

- Dashboard
- Memory graph builder
- Reminder management
- Cognitive profile
- Family/community area

Routes are under `/caregiver`.

### Health Worker

The health-worker experience focuses on a broader patient list and reporting workflow:

- Patient list
- Patient summary
- Notes
- Report export

Routes are under `/healthworker`.

## Cognitive Games

The frontend currently includes 15 dedicated game modules:

1. Memory Basket
2. My Memory Box
3. Recipe Recall
4. Sound Detective
5. Simon Says
6. Weaving Tracker
7. Pattern Builder
8. Daily Life Sequencer
9. Festival Memory
10. Object Detective
11. Familiar Pattern Match
12. Landmark Puzzle
13. Story Circle
14. Music Rhythm
15. Family Music

Game results use the shared `ActivityResult` model and can be recorded through `activityApi.ts`. Difficulty is represented per patient and per game on a 1-5 scale.

## State Management

The frontend uses a centralized Zustand store in `src/store/store.ts`.

The store contains the current prototype dataset for:

- Patients
- Caregivers
- Health workers
- Session/role state
- Reminders
- Alerts
- Activity results
- Cognitive profiles
- Game difficulty
- Chat messages
- Memory graphs
- Routine state
- Sync metadata

The TypeScript contracts for these objects are defined in `src/types.ts` and are intended to serve as a shared frontend/backend data contract.

## API Layer

The frontend deliberately separates UI/state logic from backend integration through modules under `src/api/`.

Current API modules include:

- `patientApi.ts` for patient retrieval and role-linked patient lists
- `reminderApi.ts` for reminder operations
- `activityApi.ts` for recording activity results, retrieving history, and next-difficulty requests
- `cognitiveProfileApi.ts` for cognitive profile retrieval
- `memoryGraphApi.ts` for memory graph data
- `alertApi.ts` for alerts and acknowledgement
- `assistantApi.ts` for assistant interactions
- `syncApi.ts` for patient synchronization

This makes it possible to develop the frontend independently while the backend is being implemented.

## Mock Mode and Backend Mode

The current frontend defaults to mocked/local data.

Configuration is controlled by:

```text
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:4000/api
```

With mock mode enabled, API functions read/write through the Zustand store and may simulate network latency.

To connect to a real backend, create a `.env.local` file and set:

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:4000/api
```

The backend should implement the endpoints expected by the files in `src/api/`.

## Getting Started

### Requirements

- Node.js with npm
- A modern browser

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Vite will start the development server and print the local URL in the terminal.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_USE_MOCK_DATA` | `true` | Selects local/mock data versus the HTTP backend |
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | Base URL used by the API modules when mock mode is disabled |

Do not place secrets or private credentials in Vite client-side environment variables. Values prefixed with `VITE_` are exposed to the browser.

## Frontend-to-Backend Handoff

The backend can be developed independently against the TypeScript interfaces in `src/types.ts` and the request patterns already present in `src/api/`.

A typical integration sequence is:

```text
Frontend UI
    |
    v
src/api/*.ts
    |
    v
HTTP API
    |
    +--> Patient data
    +--> Reminders
    +--> Cognitive activity records
    +--> Cognitive profile
    +--> Memory graph
    +--> Alerts
    +--> Assistant
    +--> Sync
```

The current code already contains explicit swap points for real assistant/ML services. In particular, the assistant can move from the local rule-based implementation to an HTTP assistant service, and adaptive difficulty can move from the local calculation to an ML-backed endpoint.

## Localization and Cultural Content

Two content packs are included:

- `src/content-packs/english.json`
- `src/content-packs/assamese.json`

The shared content-pack structure supports culturally relevant objects, foods, festivals, songs, textiles, landmarks, routines, and sounds. This is intended to allow the same interaction patterns to use familiar local content for different users.

## Design Principles

### Familiarity over complexity

The patient-facing experience emphasizes recognizable concepts such as family, routine, reminders, music, food, places, and everyday activities.

### Role separation

Patient, caregiver, and health-worker workflows are separated at the route and UI layer while sharing common data contracts and state primitives.

### Offline-first development

The frontend can operate with seeded local data without requiring a live backend, which makes development, demonstrations, and frontend/backend parallel work possible.

### Replaceable services

Backend integrations are isolated in `src/api/`, so replacing mock implementations does not require rewriting the page and game components.

### Accessible interaction goals

The product is designed around clear actions, reusable controls, familiar content, and reduced cognitive load for the patient-facing experience.

## Current Prototype Limitations

This repository is a frontend implementation and is not yet a full production platform. In particular:

- Authentication and authorization are not implemented as a production identity system.
- Patient data is seeded/local in mock mode.
- Real-time synchronization requires the backend implementation.
- The assistant is mock/rule-based when mock mode is enabled.
- Adaptive difficulty has a backend/ML swap point rather than a production ML service.
- Production persistence, encryption, audit logging, monitoring, and compliance controls still need to be implemented on the complete system.
- Clinical interpretation of cognitive scores is outside the scope of this frontend prototype.

## Suggested Team Workflow

For a team working on this repository, keep `main` stable and use feature branches:

```text
main
├── feature/patient
├── feature/caregiver
├── feature/healthworker
├── feature/games
└── feature/api-integration
```

Each contributor should open a pull request for their branch. A designated integrator can review, resolve conflicts, run the build/lint checks, and merge approved work into `main`.

## Related Documentation

- [`DESIGN.md`](./DESIGN.md) for the detailed frontend architecture and implementation design.

## License

