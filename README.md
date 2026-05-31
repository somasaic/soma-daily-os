# ⚡ Daily OS — Your Personal Productivity System

<div align="center">

**A self-contained daily planner built for SDET job hunters.**  
No app. No backend. No subscription. One HTML file. Works offline.

[![🔴 Live Demo](https://img.shields.io/badge/🔴_Live_Demo-somasaic.github.io-6c47ff?style=for-the-badge)](https://somasaic.github.io/soma-daily-os)
[![GitHub Stars](https://img.shields.io/github/stars/somasaic/soma-daily-os?style=for-the-badge&color=f59e0b)](https://github.com/somasaic/soma-daily-os/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

**[🔴 Try it live →](https://somasaic.github.io/soma-daily-os)**  &nbsp;|&nbsp;  **[⭐ Star on GitHub →](https://github.com/somasaic/soma-daily-os)**  &nbsp;|&nbsp;  **[📥 Download index.html →](https://github.com/somasaic/soma-daily-os/raw/main/index.html)**

</div>

---

## 📸 Screenshots

| Today Tab | Skills Tab |
|:---------:|:----------:|
| ![Today Tab](https://github.com/user-attachments/assets/ad109716-83c0-496b-8a39-95361f415861) | ![Skills Tab](https://github.com/user-attachments/assets/64774152-3735-47db-8b29-3009f788106d) |

| Weekly Tab | Notes Tab |
|:----------:|:---------:|
| ![Weekly Tab](https://github.com/user-attachments/assets/339fe120-b040-4a9f-abd3-800f87f1d95a) | ![Notes Tab](https://github.com/user-attachments/assets/c7aae367-ab85-49d0-afcb-bd3abbe77327) |

---

## 🎯 Why I Built This

Job hunting + active skill building + constant life interruptions = **chaos**.

I kept losing track of what to study, skipping GitHub pushes, forgetting recruiter follow-ups, and burning out from random task switching. No existing app fit my exact situation as an SDET learning Playwright, TypeScript, CI/CD, and preparing for interviews simultaneously.

So I built my own **Daily Operating System** — in a single HTML file.

---

## ✨ Everything It Does

### 🗓️ Day Type Engine — 5 Modes
Your entire schedule adapts based on what kind of day it is:

| Mode | When to use | What changes |
|------|-------------|--------------|
| ⚡ Full Day | Normal productive day | 3 deep work blocks, 5AM–11PM |
| 😮‍💨 Exhausted | Low energy, rough day | Lighter load, passive learning only |
| ✈️ Gap / Travel | City trips, commutes | Micro tasks, podcasts, stay connected |
| 🎯 Interview | Interview day | Calm prep, behavioral practice, post-debrief |
| 🌿 Rest | Rest day | Non-negotiables only, recovery focus |

### 📅 Mon–Sun Day Schedule Templates
- **7 pre-built day templates** (Monday → Sunday) with full fixed routines from 5AM to 11PM
- Each day auto-selected on load — Monday shows Monday's schedule, Sunday shows Sunday's
- **Fully editable** per-day templates — edit, add, delete items; changes saved separately per day
- **⚙️ Mode button** — switch back to the 5-mode engine at any time
- Templates editable independently — Mon changes don't affect Tue

### ⏱️ Per-Slot Countdown Timers
Every schedule item has its own countdown timer for time-boxing:
- **Auto-calculates duration** from the gap to the next slot (e.g. 5AM→6AM = 60 min)
- **Editable duration** (in minutes) — change at any time, saved per slot per day
- **▶ Start** → countdown begins with MM:SS live display
- **⏹ Stop** → pause mid-session
- **↺ Reset** → restore to full duration
- **Alarm at 0** → 4-tone audio beep (Web Audio API, no files) + browser notification "⏰ Time up!"
- Works on all Mon–Sun templates AND all 5 mode schedules

### ✅ Daily Schedule Completion Tracking
- Each schedule item has a **⬜/✅ checkbox** — tap to mark done
- **Completion bar** at top of schedule: `X/Y done today (%)` — resets daily
- Completion data feeds into **Weekly Review** live stats

### ⚡ Non-Negotiables — Fully Editable
Daily habit tracker — add your own, delete any, reset to defaults:
- 📤 Push to GitHub (even 1 commit)
- 💼 LinkedIn: 1 post OR 3 comments
- 🗓️ Plan tomorrow (5 min)

### ⏳ Pendings — Rolling Backlog
- Add tasks you didn't finish
- Undone items carry forward automatically with **↩ From [date]** tag
- Edit · mark done · delete · collapsible done section

### 🎯 Skills Tracker — 18 Built-in + Custom
Progress tracker across 5 tiers built for SDET job hunting:

| Tier | Skills |
|------|--------|
| 🔴 Tier 1 — Critical | Playwright, TypeScript |
| 🟠 Tier 2 — High Value | API Testing (Playwright, Postman, Contract, Strategy) |
| 🟡 Tier 3 — Employability | CI/CD GitHub Actions, SQL, Docker, Jenkins |
| 🟣 Tier 4 — Differentiators | AI Agents, Prompt Engineering, LLM Testing, Selenium→Playwright |
| 🟢 Tier 5 — Edge | Claude Code, Agile/Scrum/SAFe, GitHub Actions Advanced |

**Quick Wins** — tap skill chip on Today tab → instant **+5%** progress  
**↩0% reset** — reset any skill back to 0% with one tap  
**Custom skills** — add your own with tier, starting %, and note  

### ⏱️ Skill Study Timers
Per-skill session timers in the Skills tab:
- **▶ Study** → starts timer for that skill
- **⏹ Stop** → saves elapsed time to daily total
- **Live display** updates every second
- Daily totals stored per skill per date (`soma_timers_YYYY-MM-DD`)

### 😊 Mood Tracker
Daily mood check-in on the Today tab:
- 5 emoji buttons: 😞 😕 😐 🙂 😄
- **7-day average** shown with emoji + decimal score
- Mood data feeds into **Weekly Review** stats

### 📌 Notes Board
7 note types with color coding:  
📞 Recruiter · 🎯 Interview · 📚 Learning · 💡 Idea · ⚠️ Follow-up · ⚡ Interrupt · 📝 General

- Pin important notes to top
- Search across all notes
- Filter by type
- Edit + delete
- **Recruiter notes** support an optional **follow-up date** field

### 📞 Recruiter Follow-Up Tracker
- **Dedicated section on Today tab** — always visible, sorted by follow-up date
- Color-coded urgency badges: 🔴 Overdue · 🟡 Due today · 🟢 Upcoming · ⬜ No date
- **Top banner** fires on load if any follow-up is due or overdue
- "+ Add Note" button drops directly into Notes tab with Recruiter type pre-selected

### 📆 Weekly Planner
- Visual week grid — tap any day to cycle its type
- Set skill focus per day — fully editable

### 📊 Weekly Review — Live Auto-Summary
Live stats card in the Weekly tab that reads real data:
- **5 stats**: 🔥 Streak · NN Hit % · Skill Avg % · Schedule Done % · Mood Avg
- **7-day bar chart** — one bar per day, height = schedule completion %, colour-coded green/yellow/red
- **Best day** highlighted (highest schedule completion %)
- Smart headline: adjusts based on NN rate + schedule performance
- Refreshes every time you open the Weekly tab

### 🔥 Streak + Target Plans
- Tracks daily streak automatically
- Set a target plan: **7 Day Sprint** · **21 Day Control** · **60 Day Journey** · or Custom
- Progress bar shows % complete + days remaining
- Edit streak manually or reset to 0

### 📝 Daily Log
- End-of-day journal entries
- Full edit + delete history (last 15 entries)

### 📊 Live Stats Dashboard
- Skill average % · Non-Negotiables count · Active skills count
- Streak counter · Journey Day

### 💼 Job Application Tracker
Track every application through the full pipeline (Jobs tab):

| Stage | Meaning |
|-------|---------|
| Applied | Submitted application |
| Phone Screened | HR call done |
| Round 1 | First technical round |
| Round 2 | Second technical round |
| Offer ✅ | Got the offer |
| Rejected | Didn't make it |
| Withdrawn | You pulled out |

- Filter by stage — see counts per stage
- Add company · role · source · notes per application
- Edit status and notes inline
- Delete applications
- **📥 Export to CSV** — download full pipeline as spreadsheet

### ⭐ STAR Prep Bank
Structured behavioral answer bank in the Jobs tab:
- Add **Question + Category + Situation/Task + Action + Result**
- 5 categories: Behavioral · Technical · Leadership · Conflict · Achievement
- **Search** across all answers instantly
- Delete individual answers
- Color-coded by category

### 🎵 Focus Music
- **▶ Open Focus Playlist** — opens your saved Spotify/YouTube URL in a new tab
- **✏️ Set URL** — paste any playlist URL and save it
- URL persists across sessions
- Falls back to URL editor if no link saved yet

### 🌙 Dark Mode
- Toggle button in top-right header
- Full dark theme across all cards, inputs, charts, buttons
- Preference persists across sessions

### 🐙 GitHub Contributions Widget
- Displays your GitHub contribution chart (via ghchart.rshah.org)
- **Inline username editor** — click ✏️ Username → type → Save (no browser popup)
- Links to your GitHub profile
- Graceful fallback if offline

### 💾 Backup & Restore
- **📤 Export JSON** — downloads a full backup of all localStorage data (notes, skills, jobs, schedule edits, moods, etc.)
- **📥 Restore JSON** — drag in a backup file to restore all data
- **📋 Export Jobs CSV** — downloads job pipeline as a spreadsheet

### 🎙️ Voice Input (Mic) on All Textareas
Every text input area has a **🎙️ mic button**:
- Tap 🎙️ → browser mic permission prompt → speak → text appends live
- **Continuous mode** — keeps listening until you tap ⏹️ to stop
- **Interim results** shown in real-time as you speak
- **Indian English accent** tuned (`en-IN`) for better recognition
- Clear error messages if mic blocked (tells you exactly where to click to allow)
- Covered: Note input · Note edit · Log input · Log edit · Job notes · STAR S/A/R fields

### 🔔 Browser Notifications
- Per-schedule-item bell reminders — set for any time-tagged item
- Slot timer alarm notification when countdown hits 0
- Recruiter follow-up banner on app load
- ICS export → Google/Apple Calendar integration for phone alerts

### 📄 Export Options
- 📅 **ICS Calendar export** — import schedule into Google / Apple Calendar for phone reminders
- 📄 **PDF export** — print-ready daily plan, shareable via WhatsApp
- 📋 **Jobs CSV** — full pipeline export
- 💾 **Full JSON backup** — export all data

---

## ⚔️ Daily OS vs Paid Tools — Full Comparison

> Legend: ✅ Full support · 🟡 Partial / paid addon · ❌ Not available

### Scheduling

| Feature | Daily OS (free) | Notion $10/mo | Todoist $5/mo | Motion $19/mo | Any.do $6/mo |
|---------|:-:|:-:|:-:|:-:|:-:|
| Day-type engine (5 modes) — Full/Exhausted/Gap/Interview/Rest | ✅ | ❌ | ❌ | 🟡 | ❌ |
| Mon–Sun pre-built templates — editable per-day routines | ✅ | 🟡 | ❌ | ❌ | ❌ |
| Per-slot countdown timers — audio alarm + reset, auto-duration | ✅ | ❌ | ❌ | ✅ | ❌ |
| Schedule completion % bar — daily done tracking with checkboxes | ✅ | 🟡 | ✅ | ✅ | ✅ |

### Skill & Progress

| Feature | Daily OS (free) | Notion $10/mo | Todoist $5/mo | Motion $19/mo | Any.do $6/mo |
|---------|:-:|:-:|:-:|:-:|:-:|
| Role-specific skill tiers — 18 SDET skills across 5 tiers + custom | ✅ | ❌ | ❌ | ❌ | ❌ |
| Per-skill session timers — start/stop, daily study totals | ✅ | ❌ | ❌ | ❌ | ❌ |
| Quick Wins chips (+5%) — tap-to-progress on Today tab | ✅ | ❌ | ❌ | ❌ | ❌ |

### Job Hunt Specific

| Feature | Daily OS (free) | Notion $10/mo | Todoist $5/mo | Motion $19/mo | Any.do $6/mo |
|---------|:-:|:-:|:-:|:-:|:-:|
| Job pipeline tracker — 7-stage kanban + CSV export | ✅ | 🟡 | ❌ | ❌ | ❌ |
| STAR prep bank — S+A+R per question, searchable | ✅ | ❌ | ❌ | ❌ | ❌ |
| Recruiter follow-up tracker — due/overdue badges + banner | ✅ | 🟡 | ❌ | ❌ | 🟡 |

### Analytics & Review

| Feature | Daily OS (free) | Notion $10/mo | Todoist $5/mo | Motion $19/mo | Any.do $6/mo |
|---------|:-:|:-:|:-:|:-:|:-:|
| Weekly review — live 7-day bar chart, mood avg, best day | ✅ | 🟡 | 🟡 | ✅ | ❌ |
| Mood tracker — daily + 7-day average | ✅ | 🟡 | ❌ | ❌ | ❌ |
| Streak + target plans — 7/21/60/custom day goals | ✅ | ❌ | ✅ | ❌ | 🟡 |

### Infrastructure & UX

| Feature | Daily OS (free) | Notion $10/mo | Todoist $5/mo | Motion $19/mo | Any.do $6/mo |
|---------|:-:|:-:|:-:|:-:|:-:|
| Zero cost, zero account — one HTML file, works offline | ✅ | ❌ | ❌ | ❌ | ❌ |
| Data privacy — 100% local, no server ever | ✅ | ❌ | ❌ | ❌ | ❌ |
| Voice input (mic) on all fields — Web Speech API | ✅ | ❌ | ❌ | ❌ | ❌ |
| Dark mode | ✅ | ✅ | ✅ | ✅ | ✅ |
| Full JSON backup + restore — export/import all data | ✅ | 🟡 | ❌ | ❌ | ❌ |
| ICS calendar + PDF export | ✅ | 🟡 | 🟡 | ✅ | 🟡 |

### Verdict

| Tool | Score | Summary |
|------|:-----:|---------|
| **Daily OS** *(yours — free)* | **22/22** | Only tool with SDET skill tiers, STAR bank, slot timers, recruiter pipeline, voice input, AND zero cost. Beats every paid tool on job-hunt specificity. |
| Notion $10/mo | 12/22 | Flexible but blank canvas. No native timers, no skill tiers, no voice. You'd pay to build what Daily OS does out of the box. |
| Motion $19/mo | 11/22 | Good AI scheduler for meetings. No skill tracking, no job pipeline, no STAR bank. Wrong tool for SDET job hunting. |
| Todoist $5/mo | 9/22 | Task list only. Zero scheduling context, zero skill tracking, zero job hunt features. |
| Any.do $6/mo | 8/22 | Mobile-first, clean UI. No scheduling depth, no analytics. Daily OS wins on every dimension that matters. |

> **Unique advantages no paid tool has:** day-type engine · Mon–Sun slot timers with alarm · SDET-specific skill tiers · STAR prep bank · recruiter follow-up section · voice input on all fields · 100% offline + zero account · free forever

---

## 🚀 Tech Stack

| | |
|---|---|
| Language | Vanilla HTML + CSS + JavaScript |
| Storage | `localStorage` — 100% offline, no server |
| Dependencies | **Zero** — single self-contained file |
| Works on | Chrome (full), Safari, Firefox, Edge |
| Voice Input | Web Speech API — Chrome recommended |

---

## ⚡ How to Use It — Pick Your Option

### Option 1 — Use Live (Instant, No Setup)
**[→ Open Live App](https://somasaic.github.io/soma-daily-os)**  
Just open the link. Tap the title to enter your name. Your data saves in your browser.

---

### Option 2 — Fork & Host Your Own (Free, 2 min)
Run your own copy with your name on it:

1. Click **Fork** on this repo (top-right)
2. In your forked repo → **Settings → Pages**
3. Source: **Deploy from branch → main → / (root)** → Save
4. Your live URL: `https://YOUR-USERNAME.github.io/soma-daily-os`
5. Open it → tap the title → type your name → done ✅

---

### Option 3 — Download & Run Locally (Offline)
```bash
# Download just the one file
curl -O https://github.com/somasaic/soma-daily-os/raw/main/index.html

# Open in any browser
open index.html
# or double-click the file
```
No install. No Node. No npm. Just open.

---

### Option 4 — Netlify Drop (Instant Live Link, No Account)
1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag `index.html` onto the page
3. Get a live URL instantly — share it with anyone

---

## 📱 Mobile Tips

**WhatsApp reference:** Tap 📄 PDF → save file → share to WhatsApp Saved Messages → check throughout the day → note undone items → add to Pendings

**Phone calendar alerts:** Tap 📅 Export → download `.ics` file → open on phone → import into Google Calendar or Apple Calendar → get reminders at each scheduled time (one-time setup)

**Notifications:** Tap 🔔 bell on any schedule item → browser will ask permission → get notified at that exact time

---

## 🙋 Who Is This For?

- **SDET / QA Engineers** actively job hunting with multiple skills to track
- **Anyone** learning 3+ things simultaneously who keeps losing focus
- People who get constantly interrupted and need a rolling backlog
- Anyone who wants Notion-style power without the subscription

---

## 📬 Connect & Share

If this helped you — drop a **⭐ star** on the repo. It helps others find it.

**Built by Somasai Cheviti**  
🔗 [LinkedIn](https://www.linkedin.com/in/somasaidinesh/) · 💻 [GitHub](https://github.com/somasaic)

> **Want to use it as your own?**  
> Fork it → host it → tap the title → type your name. Done.  
> Your data never leaves your device.

---

## 📄 License

MIT — free to use, fork, and customize. Credit appreciated but not required.

---

*SDET | Playwright | TypeScript | AI Testing | Job Hunting in Progress 🔥*
