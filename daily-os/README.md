# ⚡ Soma's Daily OS v2 — React Edition

<div align="center">

**A full-stack personal productivity system for SDET job hunters.**  
React 18 · Vite · Drag-and-drop Kanban · Learn & Prep Hub · 100% offline

[![🔴 Live Demo](https://img.shields.io/badge/🔴_Live_Demo-Vercel-6c47ff?style=for-the-badge)](https://soma-daily-os.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/somasaic/soma-daily-os?style=for-the-badge&color=f59e0b)](https://github.com/somasaic/soma-daily-os/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

**[🔴 Try it live →](https://soma-daily-os.vercel.app)** &nbsp;|&nbsp; **[⭐ Star on GitHub →](https://github.com/somasaic/soma-daily-os)**

</div>

---

## 🎯 Why I Built This

Job hunting + active skill building + constant life interruptions = **chaos**.

I needed something that combined a day planner, job tracker, skill tracker, recruiter pipeline, and interview prep bank — without subscriptions or servers. So I built **Daily OS**: a React app that runs entirely in the browser, stores everything in localStorage, and works 100% offline.

---

## ✨ What's New in v2

| Feature | v1 (Vanilla) | v2 (React) |
|---------|:---:|:---:|
| Full browser width (no 640px cap) | ❌ | ✅ |
| Job Tracker — Kanban drag-and-drop | ❌ | ✅ |
| Delete individual Q&A in sessions | ❌ | ✅ |
| LinkedIn URL + Salary + Resume per job | ❌ | ✅ |
| React 18 + Vite + HashRouter | ❌ | ✅ |
| @dnd-kit drag-and-drop | ❌ | ✅ |
| All existing features preserved | ✅ | ✅ |

---

## ✨ Everything It Does

### 📋 DASHBOARD — Today Tab

#### 🗓️ Day Type Engine — 5 Modes
Your entire schedule adapts:

| Mode | When | What changes |
|------|------|--------------|
| ⚡ Full Day | Normal productive day | 3 deep work blocks, 5AM–11PM |
| 😮‍💨 Exhausted | Low energy | Lighter load, passive learning only |
| ✈️ Gap / Travel | Commute, city trip | Micro tasks + podcast learning |
| 🎯 Interview | Interview day | Calm prep, STAR practice, debrief |
| 🌿 Rest | Recovery | Non-negotiables only |

#### 📅 Mon–Sun Schedule Templates
- 7 pre-built daily templates (5AM–11PM) with your personal routine
- Tab navigation to switch any day's schedule — today's auto-selected
- Fully editable per-day — changes saved independently
- Reset any day to default with one click

#### ⏱️ Per-Slot Countdown Timers
- Every schedule slot has its own start/pause/reset timer
- Editable duration in minutes
- Live MM:SS countdown display
- Audio alarm on completion (Web Audio API, 4-tone arpeggio — no files)
- Browser notification on slot completion

#### ✅ Schedule Completion Tracking
- ⬜/✅ checkboxes on each slot
- Completion progress bar: `X/Y slots done (%)` — resets daily

#### 😊 Mood Tracker
- 5 emoji check-in buttons (😫 to 🤩)
- Logged once per day, shown in Weekly Review

#### ⚡ Non-Negotiables
- Fully editable daily habits list
- Toggle done, add new, delete, reset to defaults
- Voice input on add field

#### ⏳ Pendings — Rolling Backlog
- Undone items carry forward automatically with ↩ From [date] tag
- Edit · mark done · delete · collapsible done section

#### 💡 Park Ideas
- Tag-based idea capture (💡 Idea, 🔧 Feature, 📚 Learn, ⚡ Automate, etc.)
- File attachments support
- Filter by tag

#### ⚡ Quick Wins
- Tap any skill/habit chip → instant log of the action
- Right-click to hide chips you don't need
- Shows total actions logged

#### 🎵 Focus Music
- Quick-launch Spotify playlists (Lo-fi, Deep Focus, Piano, Brain Food)
- Save custom URL (Spotify/YouTube)

#### 📅 Reflections & Day Context
- Daily journal entry with 5-star emoji rating
- Last 7 reflections shown
- Voice input support

#### 💾 Backup & Restore
- Export all data as JSON
- Import from JSON backup file

---

### 🧠 DASHBOARD — Skills Tab

**18 built-in SDET skills across 5 tiers + custom skill support:**

| Tier | Skills |
|------|--------|
| 🔴 Tier 1 — Critical | Playwright, TypeScript |
| 🟠 Tier 2 — High Value | API Testing (Playwright, Postman, Contract, Strategy) |
| 🟡 Tier 3 — Employability | CI/CD GitHub Actions, SQL, Docker, Jenkins |
| 🟣 Tier 4 — Differentiators | AI Agents, Prompt Engineering, LLM Testing, Selenium→Playwright |
| 🟢 Tier 5 — Edge | Claude Code, Agile/Scrum/SAFe, GitHub Actions Advanced |

- Progress bars with +5%/-5% controls
- Status buttons: Active · Paused · Done
- Per-skill session timers (start/stop, running total)
- Add custom skills with tier, level %, and note
- Total study hours across all skills

---

### 📅 DASHBOARD — Weekly Tab

- Visual 7-day week grid — tap day to edit plan
- Set day type + skill focus per day
- Week plan table overview
- Weekly review stats (study days, interviews, rest)
- GitHub contribution chart (ghchart.rshah.org)

---

### 📝 DASHBOARD — Notes Tab

7 note types with color coding:  
📞 Recruiter · 🎯 Interview · 📚 Learning · 💡 Idea · ⚠️ Follow-up · ⚡ Interrupt · 📝 General

- Filter by type · search text
- Pin to top · edit · delete
- Follow-up date field for recruiter notes
- Voice input

---

### 📖 DASHBOARD — Log Tab

- End-of-day journal entries
- Full edit + delete history
- Voice input

---

### 💼 DASHBOARD — Job Tracker Tab (NEW in v2)

#### Kanban Board (drag-and-drop with @dnd-kit)
7 pipeline stages as visual columns:

| Stage | Color |
|-------|-------|
| Applied | 🔵 Blue |
| Screened | 🟡 Amber |
| Round 1 | 🟣 Purple |
| Round 2 | 🟣 Violet |
| Offer ✅ | 🟢 Green |
| Rejected | 🔴 Red |
| Withdrawn | ⚫ Gray |

- Drag cards between columns to update status
- **View toggle**: Kanban board ↔ Compact list view
- **"All" in list view** — see all jobs with filter chips per stage

#### Job Card Fields (NEW fields in v2)
- Company · Role · Location
- LinkedIn/Job URL (clickable 🔗 on card)
- Salary Range
- Resume Used
- Notes / contact

#### Add Job Modal
- Full form popup with all fields
- "+ Add Job" button opens modal

#### CSV Export
- Download full pipeline as spreadsheet

#### ⭐ STAR Prep Bank (below the Kanban)
- Add behavioral stories: Question + S + T + A + R
- 5 categories: Behavioral · Technical · Leadership · Conflict · Achievement
- Filter by category · expand/collapse
- Voice input on Situation field

---

### 🎯 DASHBOARD — Hunt Tab

Full job application tracker with urgency management:

- **Day mode banner** — daily hunt strategy (Apply Hard Mon/Tue/Wed/Thu, Outreach Fri/Sat, Build Sun)
- **Overdue & today follow-up alerts** with snooze (3 days)
- **Follow-up message templates** — tap to copy
- Add applications with company, role, channel, contact, follow-up date
- Pipeline grouped by: HOT · APPLIED · STALE · CLOSED
- Pre-seeded with 18 real applications as examples

---

### 🔥 Streak & Journey Tracking

- Daily streak with manual set / reset / mark today
- Target plans: 7 Day · 21 Day · 30 Day · 66 Day · 100 Day
- Progress bar (current / target)
- Journey start date → "Day X" display
- Click streak badge in header to open panel

---

## 📚 LEARN & PREP HUB (Separate Page)

Navigate to `/learn-prep` via header button.

### 📚 Sessions Tab

Create study sessions with loaded Q&A:

1. Set date, heading, concepts, topics
2. Select skills → Q&A bank auto-loaded from the skill's question set
3. Per-session, per-skill tab navigation

**Q&A Item Actions (NEW in v2):**
- **▸ Show Answer** — reveal model answer
- **✏️ Edit Q** — edit question and model answer inline
- **🗑️ Delete Q** — remove individual question (NEW!)
- **+ Add Question** — add custom Q&A to any skill panel
- **"Practice my answer"** — type or speak your answer, saved with date

### 🎯 Interview Prep Tab

Company-specific interview preparation:

- Add company + role + date + stage (Shortlisted → Offer)
- 7 prep type tabs: Self Intro · HR Behavioral · Technical · Experience · Project · Hypothetical · Salary
- Add Q&A per prep type
- Mark questions done with ✅
- Write your prepared answer per question

### 🗂 Q&A Bank Tab

Reference bank of 60+ questions across 13 skills:
- Playwright, TypeScript, JavaScript, API Testing, CI/CD, Selenium, Python, Docker, SQL, Jira, Azure, Git, General/HR
- Filter by skill · search text
- Click question to expand model answer

### ⚡ Practice Tab

Flashcard-style practice mode:

- Select skill and source (Q&A Bank or My Sessions)
- Card shows question → type/speak answer → reveal model answer
- Self-score: 😅 Needs Work · 🙂 Almost · ✅ Nailed It
- Previous · Random · Next navigation
- Saves answers back to sessions

### ⚙️ Settings Tab

- Export Learn & Prep data as JSON
- Import from JSON backup
- Stats: sessions, total Q&As, companies
- Clear all data (danger zone)

---

## 🌐 App-Wide Features

### 🎙️ Voice Input
Every text field has a 🎤 mic button:
- Tap → speak → text appends live
- Indian English tuned (`en-IN`)
- Auto-restarts on silence
- Continuous mode with stop button

### 🌙 Dark Mode
- Toggle in header
- Full dark theme across both pages
- Persists in localStorage

### 🔔 Browser Notifications
- Schedule slot bell reminders (🔔 per slot)
- Slot timer alarm when countdown ends
- Recruiter follow-up banner on load

### 📅 ICS Calendar Export
- Export schedule to Google / Apple Calendar
- One `.ics` file per day

### 📄 PDF Export
- Print-optimized daily plan
- Non-schedule elements hidden in print CSS

---

## 🚀 Tech Stack

| | |
|---|---|
| Framework | React 18 with functional components + hooks |
| Build tool | Vite 5 |
| Routing | React Router v6 (HashRouter) |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| State | React Context + useReducer |
| Storage | localStorage (soma_state, soma_lp_state) |
| Voice | Web Speech API |
| Audio | Web Audio API (no files, pure JS) |
| Notifications | Browser Notifications API |
| Styling | CSS custom properties (dark mode via data-theme) |
| Hosting | Vercel (via GitHub integration) |

---

## ⚡ Run It Locally

```bash
# Clone
git clone https://github.com/somasaic/soma-daily-os.git
cd soma-daily-os/daily-os

# Install
npm install

# Dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Root directory: `daily-os`
4. Framework: Vite (auto-detected)
5. Deploy → get live URL

---

## 🙋 Who Is This For?

- **SDET / QA Engineers** actively job hunting with multiple skills to track
- Anyone learning 3+ things simultaneously
- People who get constantly interrupted and need a rolling backlog
- Anyone who wants Notion-level power without the subscription

---

## 📬 Connect

Built by **Somasai Cheviti**  
🔗 [LinkedIn](https://www.linkedin.com/in/somasaidinesh/) · 💻 [GitHub](https://github.com/somasaic)

---

## 📄 License

MIT — free to use, fork, and customize.

---

*SDET · Playwright · TypeScript · AI Testing · Job Hunting in Progress 🔥*
