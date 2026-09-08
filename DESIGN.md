# CareCue Design Document

## 1. Purpose

CareCue is a role-based cognitive-care web application frontend designed around three user experiences:

- **Patient**: daily routine support, reminders, cognitive activities, family/memory content, and a conversational helper.
- **Caregiver**: patient dashboard, memory graph editing, reminders, cognitive profile, alerts, and family/community information.
- **Health Worker**: multi-patient overview, patient summaries, notes, synchronization, and report export.

The current repository is a **frontend prototype**. It is implemented as a React + TypeScript + Vite single-page application and currently defaults to seeded local/mock data. The API layer already defines explicit swap points for a future backend.

> **Implementation status:** The design below describes the code that is present in this repository. It does not assume a backend, authentication service, database, or production AI service that is not currently implemented.

---

## 2. High-Level Architecture

```text
                         +----------------------+
                         |    Browser / PWA     |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | React Application    |
                         | src/App.tsx           |
                         +----------+-----------+
                                    |
                     +--------------+--------------+
                     |                             |
                     v                             v
          +---------------------+       +---------------------+
          | React Router        |       | Shared UI           |
          | Role + page routes  |       | AppShell, buttons,  |
          +----------+----------+       | charts, alerts,     |
                     |                  | sync indicator      |
                     |                  +---------------------+
          +----------+----------+
          |                     |
          v                     v
+-------------------+  +-------------------------+
| Role Screens      |  | Cognitive Games         |
| Patient           |  | GameShell + 15 games   |
| Caregiver         |  +------------+------------+
| Health Worker     |               |
+---------+---------+               |
          |                         |
          +------------+------------+
                       |
                       v
             +----------------------+
             | Zustand Store        |
             | src/store/store.ts   |
             +----------+-----------+
                        |
             +----------+-----------+
             |                      |
             v                      v
   +------------------+    +----------------------+
   | Seed / Mock Data |    | Domain/API Adapters  |
   | patients, alerts,|    | src/api/*.ts         |
   | notes, etc.      |    | mock OR HTTP backend |
   +------------------+    +----------+-----------+
                                     |
                              VITE_USE_MOCK_DATA
                                     |
                      +--------------+--------------+
                      |                             |
                      v                             v
                Local Zustand              REST-style backend
                  behavior                    at API_BASE_URL
```

### Architectural style

The application follows a lightweight **feature/domain-oriented frontend architecture**:

1. **Routing layer** selects the user-facing role/page.
2. **Screens** compose UI and call store actions or API adapters.
3. **Shared components** provide navigation, feedback, charts, buttons, reminders, alerts, and synchronization indicators.
4. **Zustand** owns the central client-side domain state.
5. **API modules** isolate backend access and provide mock implementations when enabled.
6. **Typed domain models** in `src/types.ts` provide the shared contract between screens, store logic, and future backend integration.

---

## 3. Technology Stack

| Area | Technology | Current Role |
|---|---|---|
| UI | React 19 | Component-based application UI |
| Language | TypeScript | Static typing and shared domain contracts |
| Build/dev | Vite 8 | Development server and production bundling |
| Routing | React Router 7 | SPA navigation and route composition |
| State | Zustand 5 | Global application/domain state |
| State middleware | `subscribeWithSelector` | Fine-grained store subscriptions |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Tailwind integration | `@tailwindcss/vite` | Vite plugin for Tailwind |
| Charts | Recharts 3 | Cognitive profile and longitudinal charts |
| Icons | Lucide React | UI iconography |
| Motion | GSAP, Framer Motion, AOS, Anime.js | Visual/interaction effects; actual usage varies by component |
| Linting | Oxlint | Static linting |
| Module system | ES modules | Vite/TypeScript module environment |

### Build commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

The production build runs TypeScript project compilation followed by the Vite build:

```bash
npm run build
# tsc -b && vite build
```

---

## 4. Repository Structure

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
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
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── AlertChip.tsx
│   │   ├── AppShell.tsx
│   │   ├── Button.tsx
│   │   ├── CognitiveDomainChart.tsx
│   │   ├── ReminderCard.tsx
│   │   ├── RoleSelector.tsx
│   │   └── SyncIndicator.tsx
│   ├── content-packs/
│   │   ├── assamese.json
│   │   └── english.json
│   ├── games/
│   │   ├── GameShell.tsx
│   │   └── 15 game modules
│   ├── roles/
│   │   ├── caregiver/
│   │   ├── healthworker/
│   │   └── patient/
│   ├── store/
│   │   └── store.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
└── .oxlintrc.json
```

### Important repository hygiene note

The uploaded project archive contains generated/local directories such as `node_modules`, `dist`, and `.git`. The repository's `.gitignore` correctly excludes `node_modules`, build output, logs, local environment files, and editor artifacts. These generated folders should not be committed to the source repository.

---

## 5. Application Entry and Routing

### `src/main.tsx`

The application entry point:

1. Loads global CSS through `index.css`.
2. Gets the root DOM element.
3. Renders `<App />` inside React `StrictMode`.

### `src/App.tsx`

`App.tsx` is the central route registry and wraps the application in `BrowserRouter`.

The route model has three layers:

```text
/                         Role selection
|
+-- /patient              Patient home
|   +-- /reminders
|   +-- /activities
|   +-- /memory
|   +-- /chat
|   +-- /games/*           15 cognitive games
|
+-- /caregiver             Caregiver dashboard
|   +-- /memory
|   +-- /reminders
|   +-- /profile
|   +-- /family
|
+-- /healthworker          Health worker patient list
    +-- /summary/:patientId?
    +-- /notes
    +-- /report
```

A wildcard route redirects unknown URLs back to `/`.

### `AppShell`

All role-specific pages use the shared `AppShell` route element. `AppShell` provides:

- Sticky top navigation
- Role-specific navigation items
- Mobile navigation drawer
- Role switcher
- Patient switching for the caregiver view
- Patient synchronization indicator
- Shared page container and role-specific visual backgrounds
- `<Outlet />` for page content

---

## 6. Role-Based UX Model

### 6.1 Patient experience

Patient navigation contains:

- Home
- Reminders
- Activities
- Memory & Family
- Ask CareCue

The patient UI intentionally increases base font size and button/touch target size through `.patient-ui` styling.

### 6.2 Caregiver experience

Caregiver navigation contains:

- Dashboard
- Memory Builder
- Reminders
- Cognitive Profile
- Family

The caregiver can also switch the currently viewed patient from the role dropdown.

### 6.3 Health worker experience

Health worker navigation contains:

- Patient List
- Notes
- Report

The health worker experience is designed for multi-patient review, synchronization, notes, and reporting rather than direct patient interaction.

### Role/session representation

Session state is held in Zustand:

```ts
interface SessionState {
  role: UserRole | null;
  patientId: string | null;
  caregiverId: string | null;
  healthWorkerId: string | null;
}
```

Current role selection is a frontend demo mechanism, not an authentication/authorization system.

---

## 7. Core Domain Model

`src/types.ts` is the shared type contract.

### Patient

The `Patient` aggregate contains:

- Identity and language
- Content pack selection
- Memory graph
- Daily routine
- Reminders
- Cognitive profile
- Activity history
- Family members
- Linked caregiver/health worker IDs
- Synchronization metadata

### Memory graph

The memory graph models personal context used by the patient experience:

```text
Patient
  |
  +-- People
  |     +-- name
  |     +-- relation
  |     +-- photo/voice metadata
  |
  +-- Places
  |
  +-- Objects
  |     +-- usual location
  |
  +-- Songs
  |
  +-- Hobbies
  |
  +-- Occupation
  |
  +-- Topics to avoid
  |
  +-- Photo album
```

### Reminders

Reminder types include:

- medicine
- hydration
- meal
- appointment
- familyCall
- exercise

Reminder status includes:

- pending
- taken
- snoozed
- needHelp
- missed

A reminder may record who confirmed it: patient, caregiver, health worker, or unconfirmed.

### Cognitive profile

Five tracked domains are represented:

- Memory
- Attention
- Sequencing
- Recognition
- Auditory comprehension

The profile stores baseline scores, current scores, history, and daily functioning metrics.

### Activity result

Each game session can record:

- game ID
- timestamp
- accuracy
- response time
- hints used
- retries
- difficulty level
- abandoned state
- break requested state

This activity data feeds current cognitive score calculation, adaptive difficulty, routine-completion metrics, and alert generation.

---

## 8. State Management

`src/store/store.ts` defines the global Zustand store.

### Main state areas

```text
patients
caregivers
healthWorkers
alerts
chatMessages
gameDifficulty
hwNotes
chatUsageToday
session
```

### Store responsibilities

The store is responsible for both data and domain behavior, including:

- Role/session selection
- Reminder status changes and CRUD
- Recording cognitive activity results
- Adaptive game difficulty
- Alert acknowledgement
- Chat message storage and usage tracking
- Memory graph updates
- Health worker notes
- Routine completion
- Synchronization simulation
- Social interaction counting
- Computed lookups for patients, pending reminders, and unacknowledged alerts

### Important design characteristic

The store currently acts as the **client-side domain engine** for mock mode. This keeps the prototype interactive without requiring a backend.

For production, the API adapters should become the primary persistence boundary and the store should become a client cache/state coordinator rather than the system of record.

---

## 9. Mock Data and Local Prototype Mode

The repository is seeded with two demonstration patients and associated caregiver/health worker records.

Example seeded data includes:

- Patient 1 with Assamese content
- Patient 2 with English content
- Family relationships
- Personal places and objects
- Reminder schedules
- Cognitive profiles
- Activity history
- Alerts
- Health worker notes
- Initial game difficulty

The store generates a 14-day cognitive history using seeded values plus bounded random variation. This is demo data and should not be treated as clinical measurement.

### Mock/real backend switch

`src/api/config.ts` controls the integration mode:

```ts
export const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') === 'true';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';
```

Therefore:

```text
VITE_USE_MOCK_DATA=true   -> local Zustand-backed behavior
VITE_USE_MOCK_DATA=false  -> HTTP requests to API_BASE_URL
```

---

## 10. API Adapter Layer

The API modules form a clear backend integration seam.

### Patient API: `patientApi.ts`

```text
GET  /patients/:patientId
GET  /caregivers/:caregiverId/patients
GET  /health-workers/:healthWorkerId/patients
```

### Activity API: `activityApi.ts`

```text
POST /patients/:patientId/activity
GET  /patients/:patientId/activity
GET  /patients/:patientId/activity?gameId=:gameId
GET  /patients/:patientId/difficulty/:gameId
```

`getNextDifficulty` is explicitly marked as a future **ML-based adaptive engine swap point**.

### Alert API: `alertApi.ts`

```text
GET   /patients/:patientId/alerts
PATCH /alerts/:alertId/acknowledge
```

### Cognitive profile API: `cognitiveProfileApi.ts`

```text
GET /patients/:patientId/cognitive-profile
```

### Memory graph API: `memoryGraphApi.ts`

```text
GET   /patients/:patientId/memory-graph
PATCH /patients/:patientId/memory-graph
```

### Reminder API: `reminderApi.ts`

```text
GET    /patients/:patientId/reminders
POST   /patients/:patientId/reminders
PATCH  /reminders/:reminderId/status
DELETE /reminders/:reminderId
```

### Assistant API: `assistantApi.ts`

```text
POST /patients/:patientId/assistant
```

In mock mode, this call is served by a local rule-based assistant and writes both patient and assistant messages to the Zustand store.

### Sync API: `syncApi.ts`

```text
POST /patients/:patientId/sync
```

Mock mode simulates network delay and clears the patient's pending sync count.

---

## 11. Cognitive Activity Architecture

The game system uses a shared wrapper, `src/games/GameShell.tsx`, rather than making each game responsible for persistence and difficulty state.

### GameShell responsibilities

`GameShell` handles:

1. Reading the active patient from session state.
2. Reading the current game difficulty.
3. Providing `onComplete` to the child game.
4. Tracking hint usage and break state.
5. Recording an `ActivityResult`.
6. Updating difficulty through the activity pipeline.
7. Displaying the result/success state.
8. Returning to the activities screen.

### Child game contract

Games receive a renderer callback with:

```ts
{
  difficulty: number;
  onComplete: (accuracy: number, details?: {
    hintsUsed?: number;
    retries?: number;
  }) => void;
  onHintUsed: () => void;
}
```

This creates a consistent interface across all activities.

### Games included

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

---

## 12. Cognitive Scoring and Adaptive Difficulty

### Domain mapping

Game results are mapped to cognitive domains:

| Game | Domain |
|---|---|
| Memory Basket | Memory |
| My Memory Box | Memory |
| Recipe Recall | Sequencing |
| Sound Detective | Auditory comprehension |
| Simon Says | Attention |
| Weaving Tracker | Attention |
| Pattern Builder | Attention |
| Daily Life Sequencer | Sequencing |
| Festival Memory | Memory |
| Object Detective | Recognition |
| Familiar Pattern Match | Recognition |
| Landmark Puzzle | Recognition |
| Story Circle | Memory |
| Music Rhythm | Auditory comprehension |
| Family Music | Auditory comprehension |

### Current score calculation

The current implementation recomputes each domain score from recent activity accuracy:

- Only the most recent 20 activity records are considered.
- Results are grouped by mapped cognitive domain.
- Each domain becomes the rounded average accuracy of its mapped activities.
- If there are no applicable recent activities, the prior current score is retained.

This is a **prototype scoring model**, not a validated clinical assessment method.

### Adaptive difficulty

Current rule-based difficulty logic:

```text
accuracy >= 85 AND hints <= 1  -> difficulty + 1, capped at 5
accuracy < 50 OR retries >= 2  -> difficulty - 1, floored at 1
otherwise                       -> unchanged
```

Initial difficulty is level 2 for every seeded patient/game combination.

### Alert generation

A new attention alert can be generated when:

- current session accuracy is at least 20 percentage points below the rolling comparison average, or
- hints used are at least 4.

Alerts contain the game, current statistic, baseline/comparison statistic, timestamp, and acknowledgement state.

---

## 13. Daily Functioning and Routine Tracking

The application tracks four daily-functioning metrics:

- Medicine adherence
- Hydration adherence
- Routine completion
- Social interaction count

Reminder status changes recalculate medicine and hydration adherence from the reminder set.

Routine completion is updated when a patient completes a routine step.

Activity recording also updates a routine-completion metric in the current prototype. This should be reviewed before production because the current implementation uses number of completed non-abandoned activities against a fixed denominator of five, rather than the number of actual routine steps.

---

## 14. Conversational Assistant Design

`src/api/assistantApi.ts` contains a local rule-based assistant for mock mode.

It interprets a patient's message against the patient's memory graph and current data and can respond to categories such as:

- Person/family lookup
- What to do next / routine
- Medicine
- Appointment
- Family call
- Object location
- Music/song
- Emotional distress
- Greetings
- Hydration
- Unknown requests

The assistant can return an `escalateToCaregiver` boolean. In mock mode, this is stored with the assistant's chat message.

### Production swap point

The same `getAssistantReply(patientId, message)` API can be retained while replacing the local rule engine with a backend AI service.

For production, the backend should own:

- Model/provider credentials
- Prompt/instruction management
- Safety policies
- Context retrieval
- Rate limits
- Audit logging
- Escalation policy
- Sensitive-data controls

---

## 15. Internationalization / Content Packs

The project currently includes two content packs:

```text
src/content-packs/assamese.json
src/content-packs/english.json
```

Each pack contains structured culturally contextual content for:

- Objects
- Foods
- Festivals
- Songs
- Textiles
- Landmarks
- Routine steps
- Sounds

Both packs currently provide the same content categories and are represented through the `ContentPack` type.

The patient model references the selected content pack through `contentPackId`.

This structure provides a clean path toward additional languages and localized activity content without coupling all game logic to one language.

---

## 16. UI and Design System

### Visual language

The UI uses a calm care-oriented visual system with:

- Indigo as the primary brand family
- Teal/green for calm/success states
- Warm amber for supportive/attention states
- Red for higher-severity alerts
- Rounded cards and large touch targets
- Soft gradients and glassmorphism-inspired surfaces

### Global styles

`src/index.css` defines:

- Tailwind import/theme values
- Brand color tokens
- Typography defaults
- Patient accessibility sizing
- Glass-card styles
- Double-bezel card styles
- Role-specific gradients
- Focus-visible styling
- Motion utilities
- Reduced-motion handling
- Recharts tooltip styling

### Accessibility-oriented choices

The implementation includes:

- Larger patient typography
- Minimum 64px patient button/touch target sizing
- `:focus-visible` outlines
- `aria-label` usage on important icon-only buttons
- Reduced-motion support with `prefers-reduced-motion`
- Responsive navigation and layout

These are good foundations, but a production accessibility audit is still required.

---

## 17. Shared Components

### `RoleSelector`

Landing screen used to select:

- Patient and patient profile
- Caregiver
- Health worker

It uses GSAP for entrance animations.

### `AppShell`

Global layout wrapper responsible for navigation, role switching, mobile menu behavior, and shared visual structure.

### `Button`

Reusable button component with variants:

- primary
- secondary
- ghost
- danger
- success

And sizes:

- sm
- md
- lg
- xl

It also supports loading state, icons, disabled state, and full-width rendering.

### `ReminderCard`

Presentation component for reminder information, status, and caregiver edit/delete affordances.

### `AlertChip`

Displays informational or attention alerts and supports acknowledgement actions.

### `SyncIndicator`

Shows last synchronization time and pending item count and changes between recent-synced and stale/offline-like visual states.

### `CognitiveDomainChart`

Uses Recharts to visualize:

- Current vs baseline domain balance via radar chart
- Historical domain scores via line chart

---

## 18. Main User Flows

### Patient flow

```text
Role selection
   -> choose patient
   -> patient home
      -> reminders
      -> activities
         -> choose game
         -> play through GameShell
         -> record result
         -> update cognitive scores
         -> adapt difficulty
         -> possible alert
      -> memory/family
      -> Ask CareCue
```

### Caregiver flow

```text
Role selection
   -> caregiver dashboard
      -> review patients
      -> inspect alerts
      -> acknowledge alert
      -> manage reminders
      -> edit patient memory graph
      -> inspect cognitive profile
      -> view family/community data
      -> synchronize patient
```

### Health worker flow

```text
Role selection
   -> patient list
      -> select patient
      -> patient summary
         -> review cognitive data
         -> review alerts
         -> synchronize
         -> export report
      -> notes
      -> report
```

---

## 19. Data Flow Examples

### Recording a game result

```text
Game component
    |
    | onComplete(accuracy, details)
    v
GameShell
    |
    | recordActivityResult(...)
    v
activityApi
    |
    +--> mock mode --> Zustand recordActivityResult
    |
    +--> real mode --> POST /patients/:id/activity

Zustand recordActivityResult
    |
    +--> append activityLog
    +--> recompute cognitive scores
    +--> update historical score for today
    +--> calculate adaptive difficulty
    +--> maybe create alert
    +--> increment pendingSyncCount
```

### Updating reminder status

```text
Patient/Caregiver UI
        |
        v
reminderApi.updateReminderStatus()
        |
   +----+----+
   |         |
 mock      real
   |         |
   v         v
Zustand   PATCH /reminders/:id/status
   |
   +--> reminder status
   +--> medicine adherence
   +--> hydration adherence
   +--> pendingSyncCount
```

### Memory graph update

```text
Caregiver Memory Builder
        |
        v
memoryGraphApi.updateMemoryGraph()
        |
   +----+----+
   |         |
 mock      real
   |         |
   v         v
Zustand   PATCH /patients/:id/memory-graph
```

---

## 20. Offline / Synchronization Model

The code already models offline-friendly concepts through:

- Local state
- Pending synchronization count
- Last synchronized timestamp
- Sync indicator
- Explicit sync operation
- Mock sync delay

Current behavior is **offline-capable at the prototype state level**, but it is not yet a complete offline-first persistence system.

### What exists now

```text
Local state
   -> changes update immediately
   -> pendingSyncCount increments for selected changes
   -> sync operation clears the pending count
```

### What is still needed for production offline-first behavior

- Durable local persistence such as IndexedDB
- Operation queue/outbox
- Retry strategy
- Conflict resolution
- Versioning or timestamps for concurrent edits
- Partial-sync handling
- Background synchronization
- Explicit connectivity detection
- Reliable recovery after browser/device restart

---

## 21. Security and Privacy Considerations

The current prototype is explicitly demo/local and does not implement production authentication or authorization.

Sensitive domain data represented by the model includes:

- Patient identity
- Health/cognitive data
- Medication reminders
- Family contact information
- Personal memories
- Health worker notes
- Conversational messages

Before production deployment, the system should add:

1. Real authentication and session management.
2. Server-side authorization on every patient/caregiver/health-worker operation.
3. Encryption in transit and secure storage.
4. Secure handling of health-related and personal data.
5. Audit logging for clinical/care actions.
6. Backend enforcement of patient-to-caregiver/worker relationships.
7. Secure file/media storage for photos, voice notes, and future audio.
8. Secrets management for AI/API credentials.
9. Rate limiting and abuse protection.
10. Data retention/deletion policies appropriate to the deployment context.

The current role selector must not be considered a security boundary.

---

## 22. Backend Integration Contract

The frontend has already established a useful integration contract through typed models and API adapter functions.

A future backend can preserve the frontend domain model while replacing implementation details behind the existing adapter functions.

### Suggested backend domains

```text
/patients
/caregivers
/health-workers
/reminders
/activity
/cognitive-profile
/memory-graph
/alerts
/assistant
/sync
/reports
```

The frontend's current REST paths can serve as an initial contract, but request/response schemas, authentication, validation, pagination, error formats, and authorization policies should be explicitly documented when the backend is implemented.

---

## 23. Production Evolution Plan

### Phase 1: Prototype stabilization

- Remove generated files from version control.
- Add automated tests for core store behavior.
- Add route-level and component-level error handling.
- Standardize API error handling and loading states.
- Validate the existing TypeScript/lint/build pipeline.

### Phase 2: Backend integration

- Implement the REST API behind the existing adapters.
- Add database persistence.
- Add real authentication/authorization.
- Replace seed records with server data.
- Add server-side validation.

### Phase 3: Real offline-first storage

- Persist relevant state locally.
- Introduce sync queue and conflict handling.
- Make synchronization incremental and resilient.
- Detect online/offline state explicitly.

### Phase 4: Intelligence layer

- Replace rule-based assistant with a controlled backend AI service.
- Replace heuristic cognitive difficulty with a validated/approved adaptive engine.
- Add model observability and safety controls.

### Phase 5: Production hardening

- Accessibility audit
- Security audit
- Performance profiling
- End-to-end testing
- Monitoring/logging
- Data governance
- Disaster recovery

---

## 24. Testing Strategy

The repository currently does not include a dedicated automated test suite in the inspected source tree.

A production-ready test strategy should cover:

### Unit tests

- Zustand actions
- Cognitive score recomputation
- Adaptive difficulty rules
- Alert generation
- Reminder adherence calculations
- Content-pack parsing
- Assistant rule behavior in mock mode

### Component tests

- Role selection
- Reminder interactions
- GameShell completion behavior
- Alert acknowledgement
- Memory graph editing
- Cognitive charts

### Integration tests

- Patient activity -> store -> dashboard update
- Reminder status -> adherence -> caregiver view
- Memory graph -> patient memory experience
- Assistant -> escalation behavior
- Sync -> pending count / timestamp

### End-to-end tests

- Complete patient journey
- Caregiver review and reminder update
- Health worker patient review and reporting
- Mobile navigation
- Offline/reconnect scenarios after persistence is implemented

---

## 25. Observability Recommendations

The current frontend has no dedicated production telemetry layer.

When deployed, instrument at least:

- Route/page errors
- API latency and failure rate
- Sync failures/retries
- Activity completion/abandonment
- Assistant request failures
- Unexpected client exceptions
- Build/version identifiers

Care should be taken not to log sensitive patient content, conversation transcripts, medication details, or personal memory data unnecessarily.

---

## 26. Architectural Strengths

### Clear separation of backend integration

The API adapter layer creates an explicit swap point between local prototype behavior and a future backend.

### Shared game infrastructure

`GameShell` prevents duplication of activity recording, difficulty handling, completion UI, and result persistence across 15 games.

### Shared typed domain model

The types file gives frontend and backend contributors a common vocabulary for patients, reminders, activities, alerts, memory graphs, and cognitive profiles.

### Role-oriented navigation

The route structure makes the three primary experiences easy to understand and extend.

### Accessibility foundations

The patient experience includes larger touch targets, stronger focus styling, and reduced-motion support.

### Localization-ready content model

Content is separated into language-specific packs instead of embedding all game content directly in components.

---

## 27. Architectural Risks / Current Limitations

### No real authentication

Role selection is a demo switch and does not provide security.

### In-memory application state

Refreshing the browser loses Zustand state changes because the current store is not persisted to durable storage.

### Mock data is embedded in source

Seed records are stored in `store.ts`, which is useful for demonstration but should move to backend fixtures or development seed mechanisms.

### Clinical interpretation risk

Cognitive scores and alerts are implemented with simple heuristics. They should not be represented as clinically validated measurements without appropriate validation, governance, and domain review.

### API errors are minimally handled

Real HTTP branches generally call `res.json()` directly and do not consistently check `res.ok`, normalize errors, retry, or provide structured failure handling.

### Synchronization is simulated

The current sync model does not provide conflict resolution or a durable outbox.

### Reporting/export depth is frontend-specific

The health worker report UI exists, but a production reporting pipeline still needs explicit backend data contracts and secure export generation.

### Styling debt from template remnants

`App.css` still contains substantial default Vite/template styles that appear unrelated to the current CareCue UI. These can be removed once confirmed unused.

### Multiple animation libraries

GSAP, Framer Motion, AOS, and Anime.js are present in dependencies, while the inspected source prominently uses GSAP and CSS transitions/animations. Reducing overlapping animation libraries would simplify bundle and maintenance cost if the unused libraries are confirmed unnecessary.

---

## 28. Recommended Module Ownership for Team Development

For multi-person development, the repository naturally decomposes into these work areas:

```text
Role A: Patient experience
  src/roles/patient/
  selected patient games

Role B: Caregiver experience
  src/roles/caregiver/

Role C: Health worker experience
  src/roles/healthworker/

Role D: Games / cognitive interactions
  src/games/

Integrator / architecture owner
  src/store/
  src/api/
  src/types.ts
  src/App.tsx
  cross-role integration
```

The shared files should receive extra review because changes there can affect multiple contributors simultaneously.

---

## 29. Environment Configuration

The current application recognizes these environment variables:

```text
VITE_USE_MOCK_DATA
VITE_API_BASE_URL
```

Example development configuration:

```env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:4000/api
```

Example backend-connected configuration:

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://your-api.example.com/api
```

Do not place secrets in Vite environment variables intended for backend-only credentials. Vite-exposed environment variables are part of the client application.

---

## 30. Design Principles

The current implementation is shaped around these design principles:

1. **Role-focused experiences**: each user type gets a dedicated workflow.
2. **Personal context**: patient memories, routines, family relationships, and preferences drive the experience.
3. **Large, calm interactions**: the patient interface favors simple, touch-friendly controls.
4. **Consistent cognitive activity infrastructure**: all games share a common lifecycle.
5. **Backend replaceability**: domain APIs are isolated from UI components.
6. **Localized activity content**: cultural/language content lives outside the game framework.
7. **Care-team visibility**: activity results, alerts, reminders, and cognitive summaries flow into caregiver/health-worker views.
8. **Privacy by design direction**: sensitive information should be minimized in logs and moved behind authenticated backend boundaries before production.

---

## 31. Summary

CareCue is currently a well-structured **frontend prototype for a three-role cognitive-care platform**. Its strongest architectural feature is the clear seam between the UI/domain store and the future backend: API adapters already define the principal patient, reminder, activity, cognitive-profile, memory, alert, assistant, and synchronization operations.

The recommended next architectural step is not a wholesale rewrite. Instead, preserve the existing role/page/game organization and progressively move persistence, authentication, synchronization, AI, validation, and clinical-grade scoring into server-side services while keeping the current frontend contracts stable.

