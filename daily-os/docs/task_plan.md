# Task Plan — Soma Daily OS React Migration

## Phase Checklist

### B — Blueprint ✅
- [x] Define data schemas for Dashboard and Learn & Prep
- [x] Define component tree architecture
- [x] Define new job card fields (LinkedIn URL, salary, resume)
- [x] Define Kanban column layout
- [x] Define localStorage key strategy (preserve existing)

### L — Link ✅
- [x] Web Speech API mapped to useVoiceInput hook
- [x] Web Audio API mapped to alarm.js utility
- [x] Browser Notifications API preserved in Schedule component
- [x] localStorage R/W mapped to storage.js utility
- [x] ICS export utility preserved
- [x] PDF export (window.print) preserved

### A — Architect 🔄
- [x] Project setup: package.json, vite.config.js, index.html
- [x] Entry: src/main.jsx, src/App.jsx
- [x] State: DashboardContext.jsx, LearnPrepContext.jsx
- [x] Utils: storage.js, utils.js, alarm.js, voice.js
- [x] Constants: dashboard.js, learnPrep.js
- [ ] Dashboard components (20+ files)
- [ ] Learn & Prep components (5+ files)

### S — Stylize 🔄
- [ ] CSS with max-width fix (full browser width)
- [ ] Kanban column CSS (horizontal scroll)
- [ ] Add Job modal CSS
- [ ] Job card with new fields
- [ ] Delete Q button in Learn & Prep

### T — Trigger ⏳
- [ ] npm install
- [ ] npm run dev (verify all features work)
- [ ] npm run build (verify no errors)
- [ ] Push to GitHub
- [ ] Deploy to Vercel

## Feature Checklist (must not regress)

### Dashboard Features
- [ ] App title editable (click to rename)
- [ ] Streak badge + streak panel
- [ ] Day type selector (5 modes)
- [ ] Tab navigation (Today/Skills/Weekly/Notes/Log/Jobs/Hunt)
- [ ] Dark mode toggle (persistent)

#### Today Tab
- [ ] Notification banner (browser permission)
- [ ] Recruiter follow-up banner (auto-shows on load)
- [ ] Mode banner (changes per day type)
- [ ] Mood tracker (5 emoji, 7-day avg)
- [ ] Recruiter follow-ups section
- [ ] Stats row (Skill Avg, Non-Neg, Active)
- [ ] Non-negotiables (check/uncheck, add, delete, reset)
- [ ] Pendings (add, edit, delete, carry-forward, clear done)
- [ ] Park Ideas (tags, text, file attachments, voice input, edit, delete)
- [ ] Quick Wins chips (+5% per tap, 0% reset, hide/show)
- [ ] Today's Focus Skill card
- [ ] Schedule (day tabs Mon-Sun + 5 mode templates)
- [ ] Schedule slot checkboxes + completion bar
- [ ] Slot countdown timers (auto-duration, start/stop/reset, alarm)
- [ ] Schedule edit mode (add/delete/reorder slots)
- [ ] ICS calendar export
- [ ] PDF export modal
- [ ] Focus music (URL save, open in new tab)
- [ ] Day Context reflection (6-way rating + textarea + history)
- [ ] Backup/Restore (JSON export/import)
- [ ] Jobs CSV export from backup bar

#### Skills Tab
- [ ] Skill tiers 1-5 with tier headers and colors
- [ ] Per-skill progress bar
- [ ] Status toggle (active/done/pause)
- [ ] Study timer (start/stop, daily total display)
- [ ] 0% reset button per skill
- [ ] Add custom skill form (name, note, tier, start%)

#### Weekly Tab
- [ ] Mon-Sun day grid (tap to cycle type)
- [ ] Week skill plan (per-day focus, editable)
- [ ] Weekly review card (5 live stats)
- [ ] 7-day bar chart
- [ ] Best day highlight
- [ ] GitHub contributions widget (username editable inline)

#### Notes Tab
- [ ] Add note form (7 types)
- [ ] Follow-up date field (recruiter notes)
- [ ] Voice input on note textarea
- [ ] Search bar
- [ ] Filter by type chips
- [ ] Pin toggle per note
- [ ] Edit + delete notes

#### Log Tab
- [ ] Log entry textarea with voice input
- [ ] Save log entry
- [ ] Log history (edit + delete)

#### Jobs Tab — REDESIGNED
- [ ] "Job Tracker" tab label
- [ ] "+ Add Job" button triggers modal
- [ ] Modal: company, role, LinkedIn URL, salary, resume, status, source, notes
- [ ] "All" toggle: switches between Kanban view and compact list view
- [ ] Kanban board with 7 columns
- [ ] Drag-and-drop cards between columns (@dnd-kit)
- [ ] Column header with count badge
- [ ] Job card: company, role, resume tag, days since applied, LinkedIn link, salary
- [ ] Edit job (inline or modal)
- [ ] Delete job (with confirm)
- [ ] STAR Prep Bank (below pipeline — MUST NOT BE REMOVED)
- [ ] STAR add form (Q, category, S+T, Action, Result + voice inputs)
- [ ] STAR search
- [ ] STAR delete per answer

#### Hunt Tab
- [ ] Hunt day banner (mode by day of week)
- [ ] Follow-ups due section (urgency badges)
- [ ] Log application form (all fields)
- [ ] Application pipeline with status groups (Hot/Applied/Stale/Closed)
- [ ] Filter buttons per status
- [ ] Edit + delete hunt apps
- [ ] Copy follow-up template

### Learn & Prep Features
- [ ] Sessions tab (add session, skill pills, Q&A panels)
- [ ] **Delete Q button on each Q&A item** (NEW — next to Edit Q)
- [ ] Add Q&A to skill
- [ ] Edit Q&A item
- [ ] Save my answer (voice + text)
- [ ] Delete my saved answer
- [ ] Interview Prep tab (company prep, 7 prep types)
- [ ] Q&A Bank tab (filter by skill, reveal answers)
- [ ] Practice tab (flashcard mode, self-evaluation)
- [ ] Settings tab (backup, import, clear data, post-interview log)
