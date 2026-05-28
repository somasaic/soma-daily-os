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

### 📅 Editable Schedule
- Full schedule per day type — add, edit, delete any item
- 12 item types: Work · Ritual · Break · Habit · Health · Review · Plan · **Interrupt** · **Screening** · **Relaxation** · Wind · Sleep
- 🔔 Bell reminder per schedule item (browser notifications)
- 📅 ICS export → import to Google / Apple Calendar → phone alerts
- 📄 PDF export → save + share to WhatsApp for offline reference

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

### 📌 Notes Board
7 note types with color coding:
📞 Recruiter · 🎯 Interview · 📚 Learning · 💡 Idea · ⚠️ Follow-up · ⚡ Interrupt · 📝 General

- Pin important notes to top
- Search across all notes
- Filter by type
- Edit + delete

### 📆 Weekly Planner
- Visual week grid — tap any day to cycle its type
- Set skill focus per day — fully editable

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

---

## 🚀 Tech Stack

| | |
|---|---|
| Language | Vanilla HTML + CSS + JavaScript |
| Storage | `localStorage` — 100% offline, no server |
| Dependencies | **Zero** — single self-contained file |
| Works on | Any browser — Chrome, Safari, Firefox, Edge |

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
