# B.L.A.S.T. Framework — Soma Daily OS React Migration

## B — Blueprint (Data Schemas + Architecture Decisions)

### Project Goal
Migrate the existing vanilla HTML/CSS/JS Daily OS to a React 18 + Vite application with full feature parity, drag-and-drop Kanban for the Jobs tab, and 100% browser-width responsive layout.

### Tech Stack
| Layer | Choice | Reason |
|-------|--------|--------|
| UI Framework | React 18 (functional components + hooks) | Component re-usability, state management, lifecycle control |
| Build Tool | Vite 5 | Instant HMR, fast builds, zero config |
| Routing | React Router v6 | Dashboard (`/`) ↔ Learn & Prep (`/learn-prep`) |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable | Kanban between job status columns |
| State | React Context + useReducer | No external lib needed; 2 separate stores |
| Styling | Existing CSS (common.css, dashboard.css, learn-prep.css) | Preserve visual design; no Tailwind migration needed |
| Persistence | localStorage (existing keys preserved) | Zero backend, offline-first |

### Application Structure
```
Daily OS (React SPA)
├── Route: /                 → Dashboard (index.html equivalent)
└── Route: /learn-prep       → Learn & Prep (learn-prep.html equivalent)
```

### Dashboard State Schema
```javascript
{
  // Meta
  appTitle: string,            // "Soma's Daily OS"
  darkMode: boolean,           // persisted in localStorage['soma_dark']

  // Streak
  streakCount: number,
  streakDate: string|null,     // YYYY-MM-DD of last streak update
  streakPlan: string|null,     // "21 Day Control" etc.
  streakPlanDays: number,      // 0 = no target
  journeyStart: string|null,   // YYYY-MM-DD when journey started

  // Day
  dayType: 'full'|'exhausted'|'gap'|'interview'|'rest',

  // Mood: { [YYYY-MM-DD]: 1|2|3|4|5 }
  moods: object,

  // Non-Negotiables: [{ id, label, done }]
  nonNeg: array,

  // Pendings: [{ id, text, done, date, from }]
  pendings: array,

  // Park Ideas: [{ id, text, tag, files, date }]
  ideas: array,

  // Skills: { [skillId]: { pct, status, timer, timerDate, timerTotal } }
  skills: object,

  // Quick Wins excluded: [skillId]
  qwExcluded: array,

  // Schedule customizations: { [dayKey]: [{ time, label, type }] }
  schedule: object,

  // Schedule timer durations: { [dayKey_index]: minutes }
  scheduleTimers: object,

  // Schedule done: { [YYYY-MM-DD]: { [slotIndex]: true } }
  scheduleDone: object,

  // Notes: [{ id, type, text, date, followupDate, pinned }]
  notes: array,

  // Logs: [{ id, text, date, editing }]
  logs: array,

  // Jobs (Kanban): [{ id, company, role, linkedinUrl, salary, resume, status, source, notes, date }]
  jobs: array,

  // STAR Bank: [{ id, q, cat, sit, act, res, date }]
  starBank: array,

  // Weekly: { [day]: { type, skill } }
  weekPlan: object,

  // Hunt applications: [{ id, company, role, location, appliedDate, status, followupDate, contact, channel, source, match, notes }]
  huntApps: array,

  // Focus playlist URL
  focusPlaylist: string|null,

  // GitHub username
  githubUsername: string,

  // Day Context Reflections: { [YYYY-MM-DD]: { rating, text, date } }
  reflections: object,
}
```

### Learn & Prep State Schema
```javascript
{
  // Sessions: [{ id, date, heading, concepts, topics, skills, skillQA, createdAt }]
  // skillQA: { [skillId]: [{ id, q, a, myAnswers, score }] }
  sessions: array,

  // Companies (Interview Prep): [{ id, name, role, date, stage, prepQA }]
  // prepQA: { [prepType]: [{ id, q, a, myAnswer, done }] }
  companies: array,

  // Post-interview logs: [{ id, text, date }]
  postInterviewLogs: array,
}
```

### Jobs Kanban Columns (preserved from existing)
| Column ID | Label | Color |
|-----------|-------|-------|
| applied | Applied | #3b82f6 |
| screened | Screened | #f59e0b |
| round1 | Round 1 | #6c47ff |
| round2 | Round 2 | #8b5cf6 |
| offer | Offer ✅ | #22c55e |
| rejected | Rejected | #ef4444 |
| withdrawn | Withdrawn | #6b7280 |

### New Job Card Fields (added in React migration)
| Field | Type | Description |
|-------|------|-------------|
| linkedinUrl | string | LinkedIn job posting URL |
| salary | string | "₹25-30 LPA" or "$150K" |
| resume | string | "SDE_Resume_v3" etc. |

### localStorage Keys (preserved from existing)
- `soma_state` — dashboard state JSON
- `soma_lp_state` — learn & prep state JSON
- `soma_dark` — dark mode boolean
- `soma_timers_YYYY-MM-DD` — skill study timers per date

---

## L — Link (API / Data Connections)
- **No external API calls** — 100% local localStorage
- **Web Speech API** — voice input on all textareas
- **Web Audio API** — slot timer alarm (arpeggio A5→C#6→A5→E6)
- **Browser Notifications API** — schedule slot reminders
- **ICS export** — standard calendar format
- **PDF export** — browser print API

---

## A — Architect (Component Tree)

```
App.jsx (Router)
├── /  → pages/Dashboard.jsx
│   ├── components/dashboard/Header.jsx
│   ├── components/dashboard/StreakPanel.jsx
│   ├── components/dashboard/DayTypeSelector.jsx
│   ├── components/dashboard/TabBar.jsx
│   └── [active tab content]
│       ├── today/ (TodayTab, MoodTracker, RecruiterFollowups, NonNegotiables,
│       │          Pendings, ParkIdeas, QuickWins, Schedule, FocusMusic,
│       │          DayContext, BackupRestore)
│       ├── SkillsTab.jsx
│       ├── WeeklyTab.jsx
│       ├── NotesTab.jsx
│       ├── LogTab.jsx
│       ├── jobs/ (JobsTab, KanbanBoard, KanbanColumn, JobCard, AddJobModal, StarBank)
│       └── HuntTab.jsx
│
└── /learn-prep → pages/LearnPrep.jsx
    ├── components/learn-prep/LearnPrepHeader.jsx
    └── [active tab content]
        ├── SessionsTab.jsx    ← delete Q&A button added here
        ├── InterviewPrepTab.jsx
        ├── QABankTab.jsx
        ├── PracticeTab.jsx
        └── SettingsTab.jsx
```

---

## S — Stylize (UI Decisions)
- **Layout fix**: Remove `max-width: 640px` from `#app`, set `width: 100%` — full browser width
- **Kanban**: Horizontal scroll columns, each independently scrollable
- **Add Job**: Modal popup triggered by "+ Add Job" button (top-right of Jobs tab)
- **All toggle**: Button that switches between Kanban view and compact list view
- **Delete Q button**: Added next to "Edit Q" button in Learn & Prep session Q&A items
- **New fields**: LinkedIn URL (clickable icon), Salary, Resume shown on job cards

---

## T — Trigger (Deployment)
- **Local**: `npm run dev` → localhost:5173
- **Build**: `npm run build` → dist/
- **Vercel**: Connect GitHub repo → auto-deploy on push
- **Base path**: `./` (relative) for Vercel compatibility
