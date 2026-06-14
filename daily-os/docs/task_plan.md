# Task Plan — Soma Daily OS React Migration

## Phase Checklist

### B — Blueprint ✅
- [x] Define data schemas for Dashboard and Learn & Prep
- [x] Define component tree architecture
- [x] Define new job card fields (LinkedIn URL, salary, resume)
- [x] Define Kanban column layout
- [x] Define localStorage key strategy (preserve existing)

### L — Link ✅
- [x] Web Speech API mapped to voice.js utility
- [x] Web Audio API mapped to alarm.js utility
- [x] Browser Notifications API preserved in Schedule component
- [x] localStorage R/W mapped to storage.js utility
- [x] ICS export utility preserved
- [x] PDF export (window.print) preserved

### A — Architect ✅
- [x] Project setup: package.json, vite.config.js, index.html
- [x] Entry: src/main.jsx, src/App.jsx
- [x] State: DashboardContext.jsx, LearnPrepContext.jsx
- [x] Utils: storage.js, utils.js, alarm.js, voice.js
- [x] Constants: dashboard.js, learnPrep.js
- [x] Dashboard components (20+ files)
- [x] Learn & Prep components (5+ files)

### S — Stylize ✅
- [x] CSS with full browser width (removed max-width 640px)
- [x] Kanban column CSS (horizontal scroll)
- [x] Job card with new fields (LinkedIn URL, salary, resume)
- [x] Schedule slot spacing (sched-slot-wrap layout)
- [x] QuickWins chip grid with reset + delete + add
- [x] Skills Pause button CSS (btn-paused)
- [x] DayContext dc-entry-date flex row for action buttons

### T — Trigger ✅
- [x] npm install
- [x] npm run dev (verified all features work)
- [x] npm run build (clean — 80 modules, 3.45s, no errors)
- [x] Pushed to GitHub (somasaic/soma-daily-os, main branch)
- [ ] Deploy to Vercel (pending)

---

## Bug Fix Sprint — 2026-06-14 ✅

All 14 reported bugs fixed and pushed in commit `827f513`.

| # | Feature | Bug | Status |
|---|---------|-----|--------|
| 1 | Header | Streak badge showing `0` below badge | ✅ Fixed |
| 2 | Voice input | Mic not working app-wide | ✅ Fixed |
| 3 | Non-Negotiables | Add button + Mic not working | ✅ Fixed |
| 4 | Pendings | Add button + Mic not working | ✅ Fixed |
| 5 | Schedule | Checkbox/content/timer cramped | ✅ Fixed |
| 6 | Quick Wins | No reset count, no add chip, no delete chip | ✅ Fixed |
| 7 | Park Ideas | No Edit button for parked ideas | ✅ Fixed |
| 8 | Day Context | No Edit/Delete for saved reflections | ✅ Fixed |
| 9 | Skills Tab | Pause button not visually active | ✅ Fixed |
| 10 | Notes Tab | Mic not working | ✅ Fixed |
| 11 | Daily Log Tab | Mic not working | ✅ Fixed |
| 12 | Export | JSON only shows `{ "exported": "..." }` | ✅ Fixed |
| 13 | Job Tracker | Drag-drop not working to empty columns | ✅ Fixed |
| 14 | Hunt Tab | Edit form not visible (rendered off-screen) | ✅ Fixed |
| 15 | Voice Input | Second sentence replaces first after pause | ✅ Fixed |
| 16 | Hunt Tab | Edit still invisible — inline form hidden in collapsed group / unreachable from follow-up section | ✅ Fixed |

---

## Feature Checklist (must not regress)

### Dashboard Features
- [x] App title editable (click to rename)
- [x] Streak badge + streak panel
- [x] Day type selector (5 modes)
- [x] Tab navigation (Today/Skills/Weekly/Notes/Log/Jobs/Hunt)
- [x] Dark mode toggle (persistent)

#### Today Tab
- [x] Notification banner (browser permission)
- [x] Recruiter follow-up banner (auto-shows on load)
- [x] Mode banner (changes per day type)
- [x] Mood tracker (5 emoji, 7-day avg)
- [x] Recruiter follow-ups section
- [x] Stats row (Skill Avg, Non-Neg, Active)
- [x] Non-negotiables (check/uncheck, add, delete, reset, mic)
- [x] Pendings (add, edit, delete, carry-forward, clear done, mic)
- [x] Park Ideas (tags, text, file attachments, voice input, edit, delete)
- [x] Quick Wins chips (+tap count, reset count, add custom chip, delete chip, hide/show)
- [x] Today's Focus Skill card
- [x] Schedule (day tabs Mon-Sun + 5 mode templates)
- [x] Schedule slot checkboxes + completion bar
- [x] Slot countdown timers (auto-duration, start/stop/reset, alarm)
- [x] Schedule edit mode (add/delete slots)
- [x] ICS calendar export
- [x] PDF export (window.print)
- [x] Focus music (URL save, open in new tab)
- [x] Day Context reflection (5-emoji rating + textarea + history + edit + delete)
- [x] Backup/Restore (JSON export with full state, JSON import)

#### Skills Tab
- [x] Skill tiers 1-5 with tier headers and colors
- [x] Per-skill progress bar
- [x] Status toggle (active/done/paused)
- [x] Study timer (start/stop, daily total display)
- [x] 0% reset button per skill
- [x] Add custom skill form (name, note, tier, start%)

#### Weekly Tab
- [x] Mon-Sun day grid (tap to cycle type)
- [x] Week skill plan (per-day focus, editable)
- [x] Weekly review card (live stats)
- [x] 7-day bar chart
- [x] Best day highlight
- [x] GitHub contributions widget (username editable inline)

#### Notes Tab
- [x] Add note form (7 types)
- [x] Follow-up date field (recruiter notes)
- [x] Voice input on note textarea
- [x] Search bar
- [x] Filter by type chips
- [x] Pin toggle per note
- [x] Edit + delete notes

#### Log Tab
- [x] Log entry textarea with voice input
- [x] Save log entry
- [x] Log history (edit + delete)

#### Jobs Tab
- [x] Kanban board with 7 columns
- [x] Drag-and-drop cards between all columns including empty ones
- [x] Status auto-updates on drop
- [x] Column header with count badge
- [x] Job card: company, role, resume tag, days since applied, LinkedIn link, salary
- [x] Edit job (inline)
- [x] Delete job (with confirm)
- [x] List view toggle
- [x] STAR Prep Bank (add, search, delete)
- [x] STAR add form with voice inputs

#### Hunt Tab
- [x] Hunt day banner (mode by day of week)
- [x] Follow-ups due section (urgency badges — overdue/today/upcoming)
- [x] Log application form (all fields)
- [x] Application pipeline with status groups
- [x] Inline edit per row (visible at scroll position)
- [x] Delete hunt app
- [x] Copy follow-up template
- [x] Snooze follow-up 3 days

### Learn & Prep Features
- [x] Sessions tab (add session, skill pills, Q&A panels)
- [x] Delete Q button on each Q&A item
- [x] Add Q&A to skill
- [x] Edit Q&A item
- [x] Save my answer (voice + text)
- [x] Delete my saved answer
- [x] Interview Prep tab (company prep, 7 prep types)
- [x] Q&A Bank tab (filter by skill, reveal answers)
- [x] Practice tab (flashcard mode, self-evaluation)
- [x] Settings tab (backup, import, clear data, post-interview log)
