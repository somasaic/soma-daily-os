# Soma Daily OS — Complete Project Objective

**Version:** v2 (React 18)  
**Status:** Production-ready. Pushed to GitHub. Vercel deployment pending.  
**Repo:** https://github.com/somasaic/soma-daily-os (branch: `main`)  
**Built by:** Somasai Cheviti — SDET / QA Engineer actively job hunting

---

## What This App Is

Soma Daily OS is a **100% browser-based personal productivity system** for an SDET engineer who is simultaneously:
- Building and tracking multiple technical skills
- Actively job hunting across multiple platforms
- Preparing for interviews with a structured Q&A system
- Running a day with non-negotiables, a schedule, a rolling backlog, and daily reflection

Everything runs in the browser. No server, no backend, no login, no subscription. All data lives in `localStorage`. Works offline.

---

## Application Structure

Two pages, one React SPA with HashRouter:

```
/ (Dashboard)          → Daily operations hub (7 tabs)
/learn-prep            → Interview prep & Q&A study hub (5 tabs)
```

Both pages share the same CSS design system and localStorage data, but have separate React Context stores.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 (functional components + hooks) |
| Build | Vite 5 |
| Routing | React Router v6 — HashRouter |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| State | React Context + useReducer (2 stores) |
| Storage | localStorage — keys: `soma_state`, `soma_lp_state`, `soma_dark` |
| Voice | Web Speech API — `en-IN`, continuous, auto-restart |
| Audio | Web Audio API — 4-tone arpeggio alarm (no audio files) |
| Notifications | Browser Notifications API |
| Styling | Plain CSS with custom properties (`--p`, `--bg`, `--text`, `--border`, etc.) |

---

## File Structure

```
daily-os/
├── src/
│   ├── main.jsx                         Entry point
│   ├── App.jsx                          Router + HashRouter
│   ├── store/
│   │   ├── DashboardContext.jsx         Dashboard state + reducer + provider
│   │   └── LearnPrepContext.jsx         Learn & Prep state + reducer + provider
│   ├── utils/
│   │   ├── voice.js                     toggleVoiceInput() — mic on/off for any input
│   │   ├── storage.js                   loadDashboard(), saveDashboard(), loadLearnPrep(), saveLearnPrep()
│   │   ├── utils.js                     todayStr(), uid(), parseTimeToMins(), getCurrentDayKey(), etc.
│   │   └── alarm.js                     playAlarm() — Web Audio arpeggio
│   ├── constants/
│   │   ├── dashboard.js                 SKILLS_LIST, DEFAULT_SCHEDULES, WEEK_DAYS, HUNT_STATUS_MAP, etc.
│   │   └── learnPrep.js                 QA_BANK, PREP_TYPES, skill Q&A seed data
│   ├── pages/
│   │   ├── Dashboard.jsx                Renders Header + all 7 dashboard tabs
│   │   └── LearnPrep.jsx                Renders LearnPrepHeader + all 5 LP tabs
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Toast.jsx                Toast notification component + useToast hook
│   │   │   └── Modal.jsx                Generic modal wrapper
│   │   ├── dashboard/
│   │   │   ├── Header.jsx               App title, streak badge, dark mode, nav to Learn & Prep
│   │   │   ├── StreakPanel.jsx          Streak counter, plan selection, progress bar, journey date
│   │   │   ├── DayTypeSelector.jsx      5 day mode buttons
│   │   │   ├── TabBar.jsx               Today/Skills/Weekly/Notes/Log/Jobs/Hunt tab navigation
│   │   │   ├── today/
│   │   │   │   ├── TodayTab.jsx         Assembles all Today sub-components
│   │   │   │   ├── MoodTracker.jsx      5-emoji daily check-in
│   │   │   │   ├── RecruiterFollowups.jsx  Banner for urgent follow-ups
│   │   │   │   ├── NonNegotiables.jsx   Daily habits — check/add/delete/mic
│   │   │   │   ├── Pendings.jsx         Rolling backlog with carry-forward
│   │   │   │   ├── ParkIdeas.jsx        Tag-based idea capture with file attach + edit
│   │   │   │   ├── QuickWins.jsx        Tap-count chips — built-in + custom + reset + delete
│   │   │   │   ├── Schedule.jsx         7-day schedule with timers, bell reminders, ICS export
│   │   │   │   ├── FocusMusic.jsx       Focus playlist URL launcher
│   │   │   │   ├── DayContext.jsx       Daily reflection — emoji rating + text + edit + delete
│   │   │   │   └── BackupRestore.jsx    JSON export/import of full app state
│   │   │   ├── tabs/
│   │   │   │   ├── SkillsTab.jsx        18 skills across 5 tiers + custom skills + timers
│   │   │   │   ├── WeeklyTab.jsx        7-day grid + review stats + GitHub chart
│   │   │   │   ├── NotesTab.jsx         7-type notes + pin + search + voice
│   │   │   │   ├── LogTab.jsx           End-of-day log entries + voice
│   │   │   │   └── HuntTab.jsx          Job hunt pipeline with follow-up urgency tracking
│   │   │   └── jobs/
│   │   │       ├── KanbanBoard.jsx      7-column drag-drop Kanban for Job Tracker
│   │   │       ├── JobCard.jsx          Single draggable job card
│   │   │       └── StarBank.jsx         STAR behavioral story bank
│   │   └── learn-prep/
│   │       ├── LearnPrepHeader.jsx      LP page header + back nav
│   │       ├── SessionsTab.jsx          Study sessions with per-skill Q&A
│   │       ├── InterviewPrepTab.jsx     Company-specific interview prep
│   │       ├── QABankTab.jsx            Full 60+ question reference bank
│   │       ├── PracticeTab.jsx          Flashcard self-evaluation mode
│   │       └── SettingsTab.jsx          LP backup/restore + stats
│   └── styles/
│       ├── common.css                   Shared tokens, dark mode, typography, buttons
│       ├── dashboard.css                Dashboard-specific layout + component styles
│       └── learn-prep.css               Learn & Prep specific styles
├── seed/
│   ├── README_0.md                      Marketing README (used as root README.md)
│   ├── B.L.A.S.T.md                     B.L.A.S.T. framework reference
│   └── Objective.md                     ← This file — complete project feature reference
├── docs/
│   ├── LLM.md                           State schemas + architecture decisions
│   ├── task_plan.md                     Phase checklist + bug fix sprint log
│   ├── findings.md                      Technical gotchas + architecture discoveries
│   └── progress.md                      Day-by-day progress log with root cause analysis
└── README.md                            Root README (copy of seed/README_0.md)
```

---

## Dashboard State Schema (`soma_state`)

```js
{
  appTitle: string,                  // "Soma's Daily OS" — editable in header
  darkMode: boolean,                 // persisted separately in soma_dark

  // Streak
  streakCount: number,
  streakDate: string|null,           // YYYY-MM-DD of last streak update
  streakPlan: string|null,           // "21 Day Control" etc.
  streakPlanDays: number,            // 0 = no target
  journeyStart: string|null,         // YYYY-MM-DD when user started

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
  //   status: 'active' | 'done' | 'paused'
  skills: object,

  // Quick Wins excluded (built-in chips hidden by user): [skillId]
  qwExcluded: array,

  // Quick Wins custom chips: [{ id, label }]
  qwCustomChips: array,

  // Schedule customizations: { [dayKey]: [{ time, label, type }] }
  //   dayKey: 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun'
  schedule: object,

  // Schedule done per day: { [YYYY-MM-DD]: { [slotIndex]: true } }
  scheduleDone: object,

  // Notes: [{ id, type, text, date, followupDate, pinned }]
  notes: array,

  // Logs: [{ id, text, date }]
  logs: array,

  // Jobs (Kanban): [{ id, company, role, linkedinUrl, salary, resume, status, source, notes, date }]
  //   status: 'applied'|'screened'|'round1'|'round2'|'offer'|'rejected'|'withdrawn'
  jobs: array,

  // STAR Bank: [{ id, q, cat, sit, act, res, date }]
  starBank: array,

  // Weekly plan: { [dayKey]: { type, skill } }
  weekPlan: object,

  // Hunt apps: [{ id, company, role, location, appliedDate, status, followupDate, contact, channel, source, match, notes }]
  huntApps: array,

  // Focus playlist URL
  focusPlaylist: string|null,

  // GitHub username for contribution chart
  githubUsername: string,

  // Day Context reflections: { [YYYY-MM-DD]: { rating, text, savedAt } }
  reflections: object,
}
```

---

## Learn & Prep State Schema (`soma_lp_state`)

```js
{
  // Sessions: [{ id, date, heading, concepts, topics, skills, skillQA, createdAt }]
  // skillQA: { [skillId]: [{ id, q, a, myAnswers: [{ text, date, score }] }] }
  sessions: array,

  // Companies (Interview Prep): [{ id, name, role, date, stage, prepQA }]
  // prepQA: { [prepType]: [{ id, q, a, myAnswer, done }] }
  companies: array,

  // Post-interview reflection logs: [{ id, text, date }]
  postInterviewLogs: array,
}
```

---

## Dashboard — Feature Reference

### Header
- App title: click to rename inline, Enter to save
- Streak badge: click to open/close StreakPanel
- Journey day counter: shows "Journey day N" only when N > 0
- Dark mode toggle: persists in `soma_dark`
- "Learn & Prep" button: navigates to `/learn-prep`

### Streak Panel
- Shows current streak count with flame emoji
- Plan selector: 7 / 21 / 30 / 66 / 100 Day — sets target
- Progress bar: streak / target
- "Mark Today" button: increments streak, sets today's date
- "Reset Streak" button: resets to 0
- Journey start date input: saves YYYY-MM-DD, drives "Day N" counter in header

### Day Type Selector
5 modes that change the schedule template shown in Today's schedule:
- ⚡ Full Day — standard 5AM–11PM deep work day
- 😮‍💨 Exhausted — lighter load
- ✈️ Gap/Travel — micro tasks
- 🎯 Interview — calm prep and debrief
- 🌿 Rest — non-negotiables only

### Tab Navigation
7 tabs: Today · Skills · Weekly · Notes · Log · Jobs · Hunt

---

### TODAY TAB

#### Recruiter Follow-up Banner
- Auto-shows on load if any hunt app has a follow-up date ≤ today
- Shows company name + urgency (OVERDUE vs TODAY)
- Links to Hunt Tab

#### Mode Banner
- Contextual motivational banner based on selected day type

#### Mood Tracker
- 5 emoji buttons: 😫 😔 😐 😊 🤩
- One selection per day — saved to `moods[YYYY-MM-DD]`

#### Stats Row
- Skill Avg %: average of all active skill percentages
- Non-Neg done: X/Y non-negotiables completed today
- Active skills count

#### Non-Negotiables
- List of daily must-do habits
- Check/uncheck each item
- Add new with text input + mic button (voice input)
- Delete individual items
- Reset to defaults

#### Pendings
- Rolling task backlog
- Undone items from previous days auto-carry with "↩ From YYYY-MM-DD" tag
- Add new task with text input + mic button
- Mark done / edit / delete each item
- "Clear Done" button to remove all completed items

#### Park Ideas
- Capture ideas before they slip
- Tag picker: 💡 Idea · 🔧 Feature · 📚 Learn · ⚡ Automate · 🎯 Apply · 🤔 Question
- Textarea with mic input
- File attachments (stored as file names — not base64 in this version)
- Filter ideas by tag
- Edit existing idea (inline: change tag + text + mic)
- Delete idea

#### Quick Wins
- Tap chip to log action (count increments per tap session)
- Count badge on each chip shows tap count
- Click count badge to reset that chip's count to 0 (stopPropagation prevents double-tap)
- Right-click or × button to hide built-in chips (exclude from view)
- "Add chip" button: type name → create custom chip
- Custom chips have × delete button (visible on hover)
- Built-in chips: Playwright, TypeScript, API, CI/CD, Docker, SQL, Problem Solving, Communication, LeetCode, Recruiter Ping

#### Focus Music
- Quick-launch Spotify playlist buttons (Lo-fi, Deep Focus, Piano, Brain Food)
- "Save custom URL" field for any Spotify/YouTube link
- Opens in new tab

#### Schedule
**Day Tabs:** Mon · Tue · Wed · Thu · Fri · Sat · Sun (auto-selects today)

**Per-Slot layout (sched-slot-wrap):**
- Checkbox (✅/⬜) to mark slot done (today only)
- Color dot (type indicator)
- Time + label
- 🔔 bell button → browser notification reminder at slot's time
- ✏️ edit button → inline edit mode (time, label, type dropdown)
- 🗑️ delete button

**Countdown Timer per slot:**
- Duration input (minutes, editable)
- MM:SS display
- ▶ Start / ⏸ Pause / ↺ Reset buttons
- Audio alarm on completion (Web Audio arpeggio)
- Running state shown with green glow

**Completion Bar:** X/Y slots done (%) — resets daily

**Schedule Actions:**
- 📅 ICS export → `.ics` file for that day's slots
- 🖨️ Print → `window.print()` PDF export
- Reset → restores day's default template

**Add slot form:** Time + label + type → "+ Add slot" button

#### Day Context & Reflections
- 5-emoji day rating: 😫 😔 😐 😊 🤩
- Textarea with mic input
- "Save Reflection" button
- Shows last 7 reflections in reverse chronological order
- Each reflection shows: date · emoji rating · saved time · text
- ✏️ edit button per reflection (inline: change rating + text + mic)
- 🗑️ delete button per reflection (with confirm)

#### Backup & Restore
- "Export JSON" → downloads JSON file with full `dashboard` + `learnPrep` state + timestamp
- "Import JSON" → file picker → restores full dashboard state
- "Export Jobs CSV" → downloads jobs as spreadsheet

---

### SKILLS TAB

18 built-in SDET skills across 5 tiers + user-created custom skills:

| Tier | Color | Skills |
|------|-------|--------|
| Tier 1 — Critical | Red | Playwright, TypeScript |
| Tier 2 — High Value | Orange | API Testing (Playwright), API Testing (Postman), Contract Testing, API Test Strategy |
| Tier 3 — Employability | Yellow | CI/CD GitHub Actions, SQL, Docker, Jenkins |
| Tier 4 — Differentiators | Purple | AI Agents, Prompt Engineering, LLM Testing, Selenium→Playwright |
| Tier 5 — Edge | Green | Claude Code, Agile/Scrum/SAFe, GitHub Actions Advanced |

**Per-skill card:**
- Name + note (if set)
- Progress bar with +5% / −5% control buttons
- % display
- Status buttons: Active · Paused · Done (each pill highlights when selected)
- Study timer: Start / Pause, shows HH:MM:SS running total for today
- 0% reset button

**Add Custom Skill form:**
- Name, note, tier (1–5), starting %
- Appears at bottom of list under its tier

---

### WEEKLY TAB

**7-Day Grid:**
- Mon–Sun buttons showing day type icon
- Click to cycle day type (Full → Exhausted → Gap → Interview → Rest → Full)
- Click "skill" field to set that day's focus skill

**Week Plan Table:**
- Mon–Sun columns with type + focus skill shown

**Weekly Review Stats:**
- Study days count
- Interview days count
- Rest days count
- Total skill taps (Quick Wins)
- Mood average for the week

**7-Day Bar Chart:**
- Visual bars per day based on skill progress
- Best day highlighted

**GitHub Contributions Widget:**
- Embeds `ghchart.rshah.org` contribution graph
- GitHub username editable inline in the tab

---

### NOTES TAB

7 note types (color-coded chips):
- 📞 Recruiter · 🎯 Interview · 📚 Learning · 💡 Idea · ⚠️ Follow-up · ⚡ Interrupt · 📝 General

**Add Note form:**
- Type selector (chips)
- Textarea with mic input
- Follow-up date field (shown for Recruiter and Follow-up types)
- Save button

**Notes list:**
- Filter by type (chip buttons)
- Text search bar
- Each note shows: type tag · date · text · follow-up date (if set)
- 📌 pin toggle (pinned notes appear at top)
- ✏️ edit inline
- 🗑️ delete

---

### LOG TAB

- Textarea with mic input
- "Save Entry" button
- Shows all past log entries (newest first)
- Each entry: date + text
- ✏️ edit inline
- 🗑️ delete

---

### JOB TRACKER TAB (Kanban)

**Kanban Board — 7 columns:**

| Column | Status ID | Color |
|--------|-----------|-------|
| Applied | applied | Blue |
| Screened | screened | Amber |
| Round 1 | round1 | Purple |
| Round 2 | round2 | Violet |
| Offer ✅ | offer | Green |
| Rejected | rejected | Red |
| Withdrawn | withdrawn | Gray |

**Drag & Drop:**
- Drag any job card from one column to another
- Status auto-updates to the destination column's ID
- Empty columns are valid drop targets (useDroppable registered on each column's card container)
- Visual highlight on the column being dragged over

**Job Card fields:**
- Company name
- Role
- Resume label
- Days since applied
- LinkedIn/job URL (clickable 🔗 icon)
- Salary range
- Notes

**View Toggle:**
- "All" button switches between Kanban and flat list view
- List view: all jobs sorted by date with filter chips per status

**Add Job form (modal or inline):**
- Company, role, LinkedIn URL, salary, resume, status, source, notes

**Edit job:** Inline edit form per card  
**Delete job:** With confirm dialog  
**Export CSV:** Downloads all jobs as a spreadsheet

**STAR Prep Bank (below Kanban):**
- Add behavioral story: Q + Category + Situation + Task + Action + Result
- 5 categories: Behavioral · Technical · Leadership · Conflict · Achievement
- Search by keyword
- Filter by category
- Expand/collapse each story
- Voice input on Situation field
- Delete per story

---

### HUNT TAB

Full application follow-up tracker, separate from the Kanban Jobs tab.

**Day Mode Banner (changes by day of week):**
- Mon–Thu: Apply Hard mode
- Fri–Sat: Outreach mode
- Sun: Build mode

**Overdue & Today Follow-up Alerts:**
- Shows applications with `followupDate <= today` that aren't Rejected/Closed
- OVERDUE badge (red) for past dates
- TODAY badge (amber) for today
- Each alert has: "Snooze 3d" button + ✏️ edit
- Edit opens inline edit form on that row

**Upcoming Follow-ups section:**
- Shows next 5 follow-ups with future dates
- Blue badge with date

**Follow-up Message Templates:**
- 3 ready-made recruiter follow-up messages
- Tap any template → copies to clipboard

**Add Application form (collapsible):**
- Company, Role, Status, Channel, Contact Person, Follow-up Date, Notes
- Status options: Applied · Screening · Interview · Consideration · Offer Received · Rejected · Closed
- Channel options: LinkedIn DM · Email · Wellfound · Indeed · Referral · Direct · Naukri · Other

**Application Pipeline (grouped by status group):**
- HOT group: Interview · Consideration · Offer
- APPLIED group: Applied · Screening
- STALE group: (no activity)
- CLOSED group: Rejected · Closed
- Each group collapsible
- Count badge per group
- Edit panel renders above the pipeline whenever any ✏️ is clicked — visible from any scroll position, not affected by group collapse state
- Delete per application

Pre-seeded with sample applications on first run (HUNT_SEED data).

---

## Learn & Prep Hub — Feature Reference

Navigate via "📚 Learn & Prep" button in dashboard header → route `/learn-prep`.

### SESSIONS TAB

Study sessions with structured Q&A practice.

**Create Session form:**
- Date, heading, concepts, topics
- Select skills (checkboxes from SKILLS_LIST)
- Submit → creates session with empty Q&A for selected skills

**Session view:**
- Skill tabs across top (one tab per selected skill)
- Per-skill Q&A list from the Q&A Bank seed data

**Per Q&A item:**
- ▸ Show Answer — reveals model answer inline
- ✏️ Edit Q — inline edit for question and model answer
- 🗑️ Delete Q — removes this question from the session
- "Practice my answer" → textarea + mic to type/speak your answer
- "Save Answer" → saves with date and score
- View past saved answers per question

**Add custom Q&A:**
- "+ Add Question" button per skill tab
- Input: question + model answer

### INTERVIEW PREP TAB

Company-specific prep workspace.

**Add Company form:**
- Company name, Role, Interview date, Stage (Shortlisted → Offer)

**Company workspace (7 prep type tabs):**
- Self Intro · HR Behavioral · Technical · Experience · Project · Hypothetical · Salary
- Add Q&A per prep type
- Each Q: model answer + "Write my answer" field + mic
- Mark question done ✅ / undone

### Q&A BANK TAB

Reference bank of 60+ interview questions across 13 skills:
- Playwright, TypeScript, JavaScript, API Testing, CI/CD, Selenium, Python, Docker, SQL, Jira, Azure, Git, General/HR

- Filter by skill (chip buttons)
- Text search
- Click question → expand model answer

### PRACTICE TAB

Flashcard self-evaluation mode.

- Select skill + source (Q&A Bank OR My Sessions)
- Shows question card
- Type or speak your answer (textarea + mic)
- "Reveal Answer" → shows model answer below
- Self-score: 😅 Needs Work · 🙂 Almost · ✅ Nailed It
- Navigation: Previous · Random · Next
- Score saves to the session's Q&A record

### SETTINGS TAB

- Export Learn & Prep data as JSON
- Import from JSON backup
- Stats: sessions count, total Q&A count, companies count
- Clear all LP data (with confirm)
- Post-interview reflection log: textarea → save entry → view/delete past entries

---

## App-Wide Features

### Voice Input
- Every textarea and text input that accepts free text has a 🎤 mic button
- `toggleVoiceInput(targetRef, btnRef, toastFn)` from `voice.js`
- Tap mic → starts recording → transcript appends to input value in real-time
- Tap mic again (or auto-stops on silence) → stops
- Uses `en-IN` locale
- Requires Chrome or Chromium (Web Speech API)
- React 18 controlled inputs: uses native property descriptor setter to trigger onChange

### Dark Mode
- Toggle button in header
- CSS variables swap via `data-theme="dark"` on `<html>`
- Persists in `soma_dark` localStorage key

### Browser Notifications
- Schedule slot bell 🔔 → sets a `setTimeout` to fire a Notification at the slot's time
- Slot timer alarm: Web Audio arpeggio (no external sound files)
- Recruiter follow-up alert banner on page load

### ICS Calendar Export
- Schedule tab → 📅 button → downloads `.ics` file for the selected day
- Compatible with Google Calendar, Apple Calendar, Outlook

### PDF / Print Export
- Schedule tab → 🖨️ button → `window.print()`
- `@media print` CSS hides everything except the schedule

---

## Data Persistence Rules

| Data | Storage Key | Notes |
|------|-------------|-------|
| All dashboard state | `soma_state` | JSON — written on every dispatch |
| Learn & Prep state | `soma_lp_state` | JSON — written on every dispatch |
| Dark mode | `soma_dark` | `"true"` or `"false"` string |
| Skill timers | Per-date in soma_state | `timerDate` + `timerTotal` per skill |

localStorage limit: ~5MB. File attachment names stored but not file contents (no base64 bloat).

---

## Known Bugs Fixed (v2.1 — commit `827f513`)

| Bug | Root Cause | Fix |
|-----|------------|-----|
| `0` showing below streak badge | `{journeyDay && <el>}` renders `0` as text when journeyDay=0 | Changed to `journeyDay > 0 &&` |
| Mic not working anywhere | voice.js expected DOM elements; callers passed React refs. React 18 controlled inputs need native setter for onChange | Rewrote voice.js with `unwrap()` + `setNativeValue()` |
| Export JSON incomplete | `exportAllData()` called with no args — both params undefined, JSON.stringify omits undefined | Build export object directly in BackupRestore using context state |
| Kanban drop to empty column broken | Plain `id=` on div is not a dnd-kit droppable; needed `useDroppable({id})` | Added `useDroppable` to KanbanColumn |
| Skills Pause button not highlighted | Status value is `'paused'` → class `btn-paused`; CSS only had `.btn-pause` | Added `.btn-paused` to CSS rule |
| Hunt Tab edit invisible (D-014) | Edit form rendered at page top, far from clicked row | Moved inline per row |
| Hunt Tab edit still invisible (D-016) | Inline form hidden in collapsed groups; unreachable from follow-up section | Single edit panel above pipeline — always visible |
| QuickWins no reset/add/delete | Feature not implemented | Added tap-count reset, custom chip add/delete, new reducer cases |
| ParkIdeas no edit | Feature not implemented | Added inline edit per idea |
| DayContext no edit/delete | Feature not implemented | Added inline edit + delete per reflection, new reducer cases |
| Schedule slot cramped | No wrapper element — checkbox/content/timer shared a single border | Added `sched-slot-wrap` wrapper with proper spacing |

---

## Deployment

**GitHub:** https://github.com/somasaic/soma-daily-os  
**Branch:** `main`  
**History:** v1 vanilla JS commits preserved + v2 React migration on top  

**Key commits:**
- `b62bc49` — v2 React migration (45 source files, 24,712 insertions)
- `827f513` — 14 bug fixes
- `d05e484` — docs update

**Vercel (pending):**
1. Import `somasaic/soma-daily-os` on vercel.com
2. Root directory: `daily-os`
3. Framework preset: Vite (auto-detected)
4. No env vars needed (100% client-side)
5. Deploy → live at `soma-daily-os.vercel.app`
