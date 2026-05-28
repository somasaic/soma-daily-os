# ⚡ Soma's Daily OS

> A self-contained personal productivity system built for SDET job hunters — no app, no backend, no subscription. One HTML file. Works offline.

**[🔴 Live Demo →](https://somasaic.github.io/soma-daily-os)**

---

## 🎯 Why I Built This

Job hunting + active skill building + life interruptions = chaos.

I kept losing track of what to work on, burning out from random task switching, skipping GitHub pushes, forgetting recruiter follow-ups. No productivity app fit my exact situation as an SDET learning Playwright, TypeScript, CI/CD, and preparing for interviews simultaneously.

So I built my own **Daily Operating System**.

---

## ✨ Features

### 🗓️ Day Type Engine
Five modes that auto-adapt your entire schedule:
- ⚡ **Full Day** — 3 deep work blocks, 5AM–11PM
- 😮‍💨 **Exhausted** — lighter load, passive learning
- ✈️ **Gap/Travel** — micro tasks, stay connected
- 🎯 **Interview** — calm prep, behavioral practice, debrief
- 🌿 **Rest** — non-negotiables only, recovery

### 📅 Editable Schedule
- Custom schedule per day type
- Add/edit/delete items with types: Work, Ritual, Break, Habit, Health, Review, Plan, **Interrupt**, **Screening**, **Relaxation**, Sleep
- 🔔 Bell reminders (browser notifications) per schedule item
- 📅 ICS export → import to Google Calendar / Apple Calendar / phone
- 📄 PDF export → save & share to WhatsApp for offline reference

### ⚡ Non-Negotiables (Every Day)
Three fixed daily habits tracked with checkboxes:
- Push to GitHub (even 1 commit)
- LinkedIn: 1 post OR 3 comments
- Plan tomorrow (5 min)

### ⏳ Pendings — Rolling Backlog
- Add tasks that didn't get done
- Undone items carry forward with **↩ From [date]** tag
- Edit, mark done, delete
- Collapsible "done" section

### 🎯 Skills Tracker
18 built-in skills across 5 tiers + add your own custom skills:

| Tier | Skills |
|------|--------|
| Tier 1 — Critical | Playwright, TypeScript |
| Tier 2 — High Value | API Testing (Playwright, Postman, Contract, Strategy) |
| Tier 3 — Employability | CI/CD GitHub Actions, SQL, Docker, Jenkins |
| Tier 4 — Differentiators | AI Agents, Prompt Engineering, LLM Testing, Selenium→Playwright |
| Tier 5 — Edge | Claude Code, Agile/Scrum/SAFe, GitHub Actions Advanced |

- Status: 🔥 Active / ✅ Done / ⏸ Pause
- Manual ±10% progress adjust
- **Quick Wins** — tap skill chip on Today tab → instant +5% (tracks per day)
- Add custom skills with tier, starting %, note

### 📌 Notes Board
7 note types: 📞 Recruiter · 🎯 Interview · 📚 Learning · 💡 Idea · ⚠️ Follow-up · ⚡ Interrupt · 📝 General
- Pin important notes
- Search + filter by type
- Edit + delete

### 📆 Weekly Planner
- Visual week grid — tap day to cycle type
- Week skill plan per day

### 📝 Daily Log
- Write end-of-day diary entries
- Full edit history (last 15 entries)

### 📊 Stats Dashboard
- Skill average %, Non-Negotiables count, Active skills count
- 🔥 Streak counter + Journey Day

---

## 🚀 Tech Stack

| What | How |
|------|-----|
| Language | Vanilla HTML + CSS + JavaScript |
| Storage | `localStorage` (100% offline, no server) |
| Dependencies | Zero — single self-contained file |
| Deployment | Any static host (GitHub Pages, Netlify, etc.) |

---

## 🛠️ Setup (30 seconds)

### Option A — Run locally
```bash
# Clone repo
git clone https://github.com/YOUR-USERNAME/soma-daily-os.git

# Open in browser
open index.html
# or just double-click index.html
```

### Option B — Live via GitHub Pages
1. Fork this repo
2. Go to repo **Settings → Pages**
3. Source: **Deploy from branch → main → / (root)**
4. Your live URL: `https://YOUR-USERNAME.github.io/soma-daily-os`

### Option C — Netlify Drop (instant, no account needed)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag `index.html` onto the page
3. Get live URL instantly

---

## 📱 Sharing the Schedule

**WhatsApp:** Tap 📄 PDF → save file → share to WhatsApp Saved Messages → reference throughout day

**Phone Calendar:** Tap 📅 Export → download `.ics` file → open on phone → import into Google Calendar / Apple Calendar (one-time setup)

---

## 📸 Screenshots

> *(Add screenshots here after deploying)*

| Today Tab | Skills Tab | Weekly Tab || Notes Tab || Logs Tab |
|-----------|------------|-----------||-----------||-----------|
| ![today](<img width="1898" height="639" alt="image" src="https://github.com/user-attachments/assets/ad109716-83c0-496b-8a39-95361f415861" />)(<img width="1892" height="829" alt="image" src="https://github.com/user-attachments/assets/12a59f3e-0bd0-4bb8-9f40-f5017e8ff825" />
) | ![skills](<img width="1900" height="826" alt="image" src="https://github.com/user-attachments/assets/64774152-3735-47db-8b29-3009f788106d" />
) | ![Weekly](<img width="1919" height="590" alt="image" src="https://github.com/user-attachments/assets/339fe120-b040-4a9f-abd3-800f87f1d95a" />
) | ![notes](<img width="1919" height="655" alt="image" src="https://github.com/user-attachments/assets/c7aae367-ab85-49d0-afcb-bd3abbe77327" />
) | ![log](<img width="1919" height="392" alt="image" src="https://github.com/user-attachments/assets/f2ffbcc6-0798-4f57-8902-cd033a8f4069" />
) |

---

## 🙋 Who Is This For?

- SDET / QA Engineers actively job hunting
- Anyone learning multiple tech skills simultaneously
- People who get interrupted often and lose track of priorities
- Anyone who wants a personal OS without paying for Notion / Monday / etc.

---

## 📬 Share & Connect

If this helps you — drop a ⭐ on the repo and connect on [LinkedIn](https://www.linkedin.com/in/somasaidinesh/).

**Want to use it?** Just fork or download `index.html` — it's self-contained. Your data stays in your browser, never leaves your device.

---

## 📄 License

MIT — free to use, fork, customize. Credit appreciated but not required.

---

*Built by Somasai Cheviti — SDET | Playwright | AI Testing | Job Hunting in Progress 🔥*
