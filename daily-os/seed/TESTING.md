# Soma Daily OS — SDET Quality Portfolio

<div align="center">

**Built from real struggle. Tested like a product.**  
*An SDET's own productivity system — designed, built, and quality-assured end-to-end*

[![GitHub](https://img.shields.io/badge/GitHub-somasaic/soma--daily--os-181717?style=for-the-badge&logo=github)](https://github.com/somasaic/soma-daily-os)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## Why This Exists

Job hunting as an SDET is hard. You're tracking applications across multiple platforms, building skills across 10+ tools simultaneously, preparing for interviews with hundreds of Q&As, managing daily habits, keeping a log, and trying to stay mentally on track — all at once.

Every tool I found was either too generic, required a subscription, or didn't understand an SDET's reality. So I built **Daily OS**: a complete personal productivity system that lives 100% in the browser, works offline, and handles every part of my job hunt in one place.

But building it wasn't enough. As an SDET, I hold quality as a non-negotiable — even for a solo project. This document is the record of how I applied the **Software Testing Life Cycle (STLC)** to this product from day one.

---

## What Was Built

| | |
|---|---|
| **Type** | React 18 SPA — single-user, fully offline, localStorage-based |
| **Pages** | Dashboard (7 tabs) + Learn & Prep Hub (5 tabs) |
| **Features** | 60+ features across scheduling, skill tracking, Kanban job pipeline, hunt tracker, note system, daily log, reflections, STAR bank, interview prep, flashcard practice |
| **Browser APIs Used** | Web Speech API, Web Audio API, Browser Notifications API |
| **Migration** | Rewritten from Vanilla JS v1 → React 18 + Vite with full feature parity |
| **Commits** | 12+ commits from vanilla JS history preserved through React v2 and all bug fixes |

---

## STLC Phases Applied

### Phase 1 — Requirement Analysis

**Objective:** Understand every feature of the existing vanilla JS v1 app before migration. Define what must not regress.

**Activities performed:**
- Read and documented all existing JS files, identifying 60+ distinct features across 7 Dashboard tabs and 5 Learn & Prep tabs
- Traced data flow: how vanilla JS wrote to `soma_state` and `soma_lp_state` in localStorage
- Identified browser API dependencies: Web Speech API (voice input), Web Audio API (alarm), Notifications API (schedule reminders)
- Defined migration risk areas: voice input singleton pattern, SpeechRecognition lifecycle, drag-and-drop, countdown timers with setInterval
- **Key output:** `docs/LLM.md` — full data schema + component tree + API mapping defined before a single line of React was written

---

### Phase 2 — Test Planning

**Objective:** Define the quality gates and acceptance criteria before implementation begins.

**Activities performed:**
- Created `docs/task_plan.md` with a complete feature checklist (60+ checkboxes) — every feature must be ✅ before the project is considered complete
- Applied the **B.L.A.S.T. Framework** (Blueprint → Link → Architect → Stylize → Trigger) as a structured delivery and quality gate system
- Defined zero-regression policy: any feature present in v1 must work identically in v2
- Established data integrity requirement: localStorage keys `soma_state` and `soma_lp_state` must be preserved — existing user data must survive the migration
- Defined build quality gate: `npm run build` must complete clean (zero errors, zero warnings) before any commit is pushed

---

### Phase 3 — Test Design

**Objective:** Define how each feature would be validated.

**Test design approach — feature-based checklists:**

| Feature Area | Acceptance Criteria |
|---|---|
| Voice Input | Mic starts, transcribes in real-time, appends on gaps, stops on re-click |
| Kanban Drag-Drop | Cards move between all 7 columns including empty ones, status updates on drop |
| Schedule Timers | Start/pause/reset per slot, alarm fires at zero, concurrent timers independent |
| Data Export | JSON output contains full dashboard state + learnPrep state + timestamp |
| LocalStorage Persistence | All state survives page refresh, data readable after import |
| Dark Mode | Applies across both pages, persists on reload |
| Streak Tracking | Badge shows correct count, journey day increments, 0 does not render as text |

**Test design approach — exploratory charters:**
Before systematic testing, I defined open-ended charters:
- *"Explore all mic buttons and verify voice text lands in the correct field"*
- *"Explore drag-and-drop across all column states — with cards, without cards, between non-adjacent columns"*
- *"Explore the export/import cycle: export → inspect JSON → import → verify state restored"*
- *"Explore all edit/delete flows and observe where the edit form renders relative to the trigger"*

---

### Phase 4 — Test Environment Setup

**Environment configuration:**

| Layer | Setup |
|---|---|
| Dev server | Vite 5 HMR at `localhost:5173` via `npm run dev` |
| Production build | `npm run build` → `dist/` served via `npx live-server dist/` |
| Browser | Chrome (required for Web Speech API) |
| OS | Windows 11 |
| Storage | Browser localStorage — inspected via DevTools → Application → Local Storage |
| Network | Offline (no external calls — 100% client-side by design) |

**Environment validation checks performed before test execution:**
- `npm run build` completes clean — 80 modules, no errors
- `soma_state` key readable in DevTools localStorage panel
- Microphone permission granted in Chrome
- Web Audio API functional (alarm test)
- Browser Notifications permission granted

---

### Phase 5 — Test Execution

#### 5A — Exploratory Testing

Exploratory testing was the primary method used to discover all 15 defects (14 original + 1 post-fix). This was not random clicking — it was structured exploration using time-boxed sessions with defined charters.

**Session 1 — Voice Input Charter**
*"Explore all mic buttons across all tabs. Observe whether text appears, whether it lands in the correct field, and whether it persists after speaking."*

Findings:
- Mic buttons across the entire app produced no visible response on click
- No text appeared in any textarea regardless of tab
- Button state (active/inactive) did not toggle
- **Defects raised:** D-002 (global mic failure), D-003 (NonNegotiables mic), D-004 (Pendings mic), D-010 (Notes mic), D-011 (Daily Log mic)

**Session 2 — Header and Stats Charter**
*"Explore the header, streak badge, and stats row. Observe for rendering anomalies under all day states."*

Findings:
- Journey day 0 rendering as literal character `0` visible below the streak badge
- **Defect raised:** D-001 (zero rendered as text)

**Session 3 — Data Integrity Charter**
*"Trigger a full JSON export. Open the file and validate it contains all user data."*

Findings:
- Exported file opened in text editor contained only `{ "exported": "2026-06-14T02:31:59.339Z" }`
- No dashboard state, no skills, no jobs, no reflections — completely empty
- **Defect raised:** D-012 (broken export)

**Session 4 — Kanban Drag-and-Drop Charter**
*"Add multiple jobs. Drag cards between all 7 columns systematically. Specifically test dragging INTO empty columns."*

Findings:
- Cards dragged between columns that already had cards: worked
- Cards dragged INTO empty columns: card snapped back, no drop registered
- Status did not update when dropped into empty column
- **Defect raised:** D-013 (empty column drop failure)

**Session 5 — Skills Tab State Charter**
*"Interact with every skill button state. Toggle Active → Paused → Done and observe visual feedback."*

Findings:
- Active button: highlighted correctly
- Done button: highlighted correctly
- Paused button: clicked, state changed in data, but button showed no visual active state
- **Defect raised:** D-009 (Pause button not visually active)

**Session 6 — Edit/Delete Flow Charter**
*"Find every edit button in the app. Click it. Observe where the edit form appears relative to the button."*

Findings:
- Park Ideas: no edit button present — D-007
- Day Context: no edit or delete button — D-008
- Hunt Tab: edit button present, clicked, no visible form appeared at scroll position — D-014

**Session 7 — Layout and Spacing Charter**
*"Review all list/card views for visual congestion. Look for overlapping or cramped UI elements."*

Findings:
- Schedule slots: checkbox, time, label, timer controls all cramped into a single row with no clear visual separation
- **Defect raised:** D-005 (schedule congestion)

**Session 8 — Quick Wins Interaction Charter**
*"Tap Quick Wins chips repeatedly. Look for count management, reset capability, and chip lifecycle options."*

Findings:
- Tap count increments correctly
- No way to reset a chip's count without refreshing the page
- No way to add a custom chip
- No way to remove an unwanted built-in chip
- **Defect raised:** D-006 (missing QuickWins chip management)

**Session 9 — Voice Continuity Charter (Post-Fix)**
*"After mic is working: speak sentence 1, pause 3 seconds, speak sentence 2. Observe whether both sentences appear."*

Findings:
- Sentence 1 appears correctly after speaking
- After 3-second pause, sentence 2 replaces sentence 1 entirely
- Multi-sentence input is not supported
- **Defect raised:** D-015 (voice continuity — speech replaces instead of appending)

---

#### 5B — Functional Testing

After exploratory testing identified defects, functional testing validated each feature against its acceptance criteria.

**Voice Input — Functional Test Cases:**

| Test ID | Test Case | Expected | Actual (Pre-fix) | Actual (Post-fix) |
|---------|-----------|----------|-----------------|------------------|
| VT-01 | Click mic on NonNegotiables input | Mic activates, button highlights | No response | ✅ Activates |
| VT-02 | Speak into active mic | Text appears in textarea in real-time | No text appears | ✅ Text appears |
| VT-03 | Speak sentence 1, pause, speak sentence 2 | Both sentences in textarea | Sentence 2 replaces sentence 1 | ✅ Both appear |
| VT-04 | Click mic again to stop | Recording stops, button de-highlights | N/A (mic didn't start) | ✅ Stops |
| VT-05 | Use mic on Notes tab textarea | Text appears in notes field | No response | ✅ Activates |
| VT-06 | Use mic on Daily Log textarea | Text appears in log field | No response | ✅ Activates |

**Kanban — Functional Test Cases:**

| Test ID | Test Case | Expected | Actual (Pre-fix) | Actual (Post-fix) |
|---------|-----------|----------|-----------------|------------------|
| KB-01 | Add job, drag to next column | Status updates to target column | ✅ Worked | ✅ Works |
| KB-02 | Drag card into empty column | Card drops, status updates | Card snaps back | ✅ Drops correctly |
| KB-03 | Drag card back to original column | Status reverts | ✅ Worked | ✅ Works |
| KB-04 | Check job status after drag | Status field = column ID | Status unchanged on empty | ✅ Updates |

**Export/Import — Functional Test Cases:**

| Test ID | Test Case | Expected | Actual (Pre-fix) | Actual (Post-fix) |
|---------|-----------|----------|-----------------|------------------|
| EX-01 | Export JSON | File contains dashboard + learnPrep state | File only has `{ "exported": "..." }` | ✅ Full state exported |
| EX-02 | Open exported file | All user data visible in JSON | Empty object | ✅ All data present |
| EX-03 | Import exported file | State restored to app | N/A | ✅ State restored |
| EX-04 | Import then reload page | Data persists after reload | N/A | ✅ Persists |

---

#### 5C — Regression Testing

After every individual bug fix, a regression pass was run across the related feature area to ensure the fix did not break adjacent functionality.

**Regression pass after voice.js rewrite:**
- Tested mic on all 8 locations it appears: NonNegotiables, Pendings, Notes, Daily Log, DayContext (new + edit), ParkIdeas (new + edit), Schedule (new feature)
- Verified existing text in field is preserved when mic appends new speech
- Verified mic toggle (on → off → on) works correctly on same field
- Verified switching mic from one field to another stops the previous field correctly

**Regression pass after Kanban fix:**
- Tested drag between columns that already had cards (must not regress)
- Tested drag into empty column (the fix)
- Tested drag back to origin column
- Tested card edit and delete after a drag
- Verified status badge on card reflects new status

**Regression pass after DashboardContext reducer changes:**
- Added `qwCustomChips`, `UPDATE_REFLECTION`, `DELETE_REFLECTION` reducer cases
- Verified existing state keys (`nonNeg`, `pendings`, `ideas`, `reflections`) read/write correctly after reducer update
- Verified localStorage JSON still deserialises correctly with new keys added

---

#### 5D — UI / UX Testing

| Observation | Issue | Fix Verified |
|---|---|---|
| Schedule checkbox, time, label, and timer all cramped in one row | D-005 | ✅ Slot wrapper with clear visual separation added |
| Pause button on Skills tab shows no visual state change | D-009 | ✅ CSS class `btn-paused` added |
| Hunt Tab edit form appears at page top, invisible when scrolled down | D-014 | ✅ Edit form now inline per row |
| `0` renders as visible text below streak badge | D-001 | ✅ Guarded with `journeyDay > 0` |
| No way to delete a reflection once saved | D-008 | ✅ Delete button added with confirm dialog |

---

#### 5E — Data Integrity Testing

| Test | Method | Result |
|---|---|---|
| Export JSON structure | Exported file opened in text editor, keys verified | ✅ `dashboard`, `learnPrep`, `exported` keys present |
| localStorage key preservation | Inspected `soma_state` in DevTools before and after migration | ✅ Same key, same structure |
| State after import | Imported backup, reloaded page, checked all tabs | ✅ All data restored correctly |
| Reducer immutability | Checked all reducer cases return new state objects | ✅ No direct mutations |
| New state keys backward compat | Loaded old `soma_state` without `qwCustomChips` | ✅ Defaults to `[]` gracefully |

---

#### 5F — Browser API Integration Testing

| API | Feature | Test | Result |
|---|---|---|---|
| Web Speech API | Voice input | Speak → text appears in textarea | ✅ |
| Web Speech API | Multi-sentence | Speak, pause, speak again | ✅ After D-015 fix |
| Web Audio API | Timer alarm | Countdown reaches 0 | ✅ 4-tone arpeggio fires |
| Notifications API | Schedule bell | Click 🔔, grant permission, wait for slot time | ✅ |
| ICS export | Calendar file | Click 📅, open in Google Calendar | ✅ Events import correctly |
| localStorage | State persistence | Save data, reload page | ✅ All state present |
| localStorage | Import/export cycle | Export → clear → import | ✅ Full round-trip works |

---

#### 5G — Build & Performance Testing

| Metric | Value | Gate |
|---|---|---|
| Build result | ✅ Clean | Zero errors |
| Modules bundled | 80 | — |
| JS bundle (gzip) | 109.07 kB | < 200 kB target |
| CSS bundle (gzip) | 8.37 kB | — |
| Build time | 1.43s | < 30s target |
| localStorage footprint | ~5–50 kB typical | < 5 MB browser limit |

---

### Phase 6 — Defect Reporting & Root Cause Analysis

All 15 defects found were formally documented with:
- Observed behaviour (what the user sees)
- Steps to reproduce
- Root cause (exact code-level analysis)
- Fix applied
- Verification method

**Defect Summary:**

| D-ID | Area | Severity | Root Cause Category | Status |
|------|------|----------|-------------------|--------|
| D-001 | Header — streak badge | Low | React falsy render (`0 && el` = `0`) | ✅ Fixed |
| D-002 | Voice — global | Critical | voice.js passed React refs to API expecting DOM elements | ✅ Fixed |
| D-003 | Voice — NonNegotiables | Critical | Same as D-002 | ✅ Fixed |
| D-004 | Voice — Pendings | Critical | Same as D-002 | ✅ Fixed |
| D-005 | Schedule — layout | Medium | Missing wrapper element for spacing | ✅ Fixed |
| D-006 | QuickWins — UX | Medium | Feature not implemented | ✅ Implemented |
| D-007 | Park Ideas — edit | Medium | Feature not implemented | ✅ Implemented |
| D-008 | Day Context — edit/delete | Medium | Feature not implemented | ✅ Implemented |
| D-009 | Skills — Pause button | Low | CSS class mismatch: `btn-pause` vs `btn-paused` | ✅ Fixed |
| D-010 | Voice — Notes tab | Critical | Same as D-002 | ✅ Fixed |
| D-011 | Voice — Daily Log | Critical | Same as D-002 | ✅ Fixed |
| D-012 | Export — data integrity | Critical | Function called with no args → undefined → JSON omitted | ✅ Fixed |
| D-013 | Kanban — drag to empty | High | `useDroppable` not registered on column container | ✅ Fixed |
| D-014 | Hunt Tab — edit UX | High | Edit form at page top, not inline — invisible at scroll position | ✅ Fixed |
| D-015 | Voice — continuity | High | `e.resultIndex` loop + stale `base` on session restart | ✅ Fixed |

**Root cause classification:**

| Category | Count | Defects |
|---|---|---|
| React API misuse | 6 | D-002, D-003, D-004, D-010, D-011, D-001 |
| Missing feature implementation | 3 | D-006, D-007, D-008 |
| CSS naming mismatch | 1 | D-009 |
| Library API misuse (dnd-kit) | 1 | D-013 |
| Data/logic bug | 2 | D-012, D-015 |
| UX/layout issue | 2 | D-005, D-014 |

---

### Phase 7 — Defect Retesting & Closure

For every defect fixed:
1. Applied code fix
2. Ran `npm run build` — verified zero errors
3. Ran dev server (`npm run dev`) — manually retested the exact scenario that produced the defect
4. Ran regression pass on adjacent features
5. Marked defect ✅ Fixed in `docs/progress.md`
6. Committed with root cause documented in commit message

**Final build verification before GitHub push:**
```
✓ 80 modules transformed
dist/assets/index.css   47.03 kB │ gzip:  8.37 kB
dist/assets/index.js   361.74 kB │ gzip: 109.07 kB
✓ built in 1.43s
```
Zero errors. Zero warnings. All 15 defects verified fixed.

---

## Testing Methods Used — Summary

| Testing Type | Applied To | When |
|---|---|---|
| **Exploratory Testing** | All 7 Dashboard tabs, all 5 Learn & Prep tabs | Primary discovery method — 9 structured sessions |
| **Functional Testing** | Voice input, Kanban, Export/Import, Skills, Schedule | After each fix and on each feature acceptance |
| **Regression Testing** | All features adjacent to each bug fix | After every code change |
| **UI / UX Testing** | Layout, button states, form render positions | Visual inspection during exploratory sessions |
| **Data Integrity Testing** | Export JSON, localStorage round-trip, import restore | Dedicated session for export + import cycle |
| **Integration Testing** | voice.js ↔ React state, dnd-kit ↔ context reducer | Targeted at API boundaries |
| **Browser API Testing** | Web Speech, Web Audio, Notifications, ICS, localStorage | Verified each API under real browser conditions |
| **Build / Performance Testing** | Vite production build | Before every GitHub push |
| **Root Cause Analysis** | All 15 defects | Deep code-level investigation for every bug |
| **Compatibility Testing** | Chrome (required for Web Speech API) | Documented as known constraint |

---

## Skills Demonstrated Through This Project

| SDET Skill | Evidence |
|---|---|
| Exploratory Testing | 9 time-boxed charter sessions uncovering 15 defects |
| Defect Root Cause Analysis | Every defect traced to exact code-level cause |
| Test Documentation | `docs/progress.md`, `docs/findings.md`, `docs/task_plan.md` maintained throughout |
| React + JavaScript Debugging | Identified React 18 controlled input behavior, falsy render gotcha, SpeechRecognition session lifecycle |
| Browser API Testing | Web Speech API, Web Audio API, Notifications API, localStorage all verified |
| Regression Testing | Post-fix regression pass on every change |
| Build Pipeline | npm + Vite build verification as quality gate |
| State Management Testing | localStorage persistence, import/export data integrity |
| UX Bug Detection | Layout congestion, invisible edit forms, non-responsive button states |
| Library API Debugging | dnd-kit `useDroppable` requirement for empty drop targets |

---

## Upcoming Features (Roadmap)

This project was built for a single user — me. But the foundation is designed to scale. Here is what's planned next:

### Near Term
- **Vercel deployment** — Go live at `soma-daily-os.vercel.app`

### Phase 3 — Multi-User Platform
- **User authentication** — Login with email/password or Google OAuth
- **Cloud database** — Replace localStorage with a cloud database (Supabase or Firebase)
- **Per-user data isolation** — Each user's OS state stored under their account
- **Sync across devices** — Same account accessible from phone, tablet, laptop

**Testing implications:** This phase introduces backend API testing, authentication flow testing, data isolation testing, and cross-device sync verification.

### Phase 4 — AI-Powered Learn & Prep
- **LLM integration in Learn & Prep tab** — Embedded AI model (Claude API) for context-aware research
- **AI-powered Q&A generation** — Generate interview questions from a skill or job description
- **Answer evaluation** — LLM scores and gives feedback on the user's saved answers
- **Research inside the app** — Ask questions, get explanations, without leaving the tab

**Testing implications:** This phase introduces LLM response quality testing, prompt reliability testing, token limit handling, latency testing, and hallucination detection.

---

## Why This Matters

Every feature in this app was something I needed during my actual job hunt. Every bug that was found and fixed is a case study in real-world testing:

- The mic failure wasn't just "it doesn't work" — it was a React 18 API contract violation that required understanding how synthetic events and native DOM property setters interact.
- The export bug wasn't just "wrong data" — it required reading how `JSON.stringify` handles `undefined` values and tracing the call chain back through three layers to find the missing argument.
- The Kanban empty drop wasn't just "drag doesn't work" — it required understanding dnd-kit's internal droppable registry and why an HTML `id` attribute is not the same as a registered drop zone.

This is what SDET work looks like when it's applied to something real, not a contrived test assignment.

---

## Links

- **GitHub Repo:** [github.com/somasaic/soma-daily-os](https://github.com/somasaic/soma-daily-os)
- **Live App:** Coming soon — Vercel deployment in progress
- **LinkedIn:** [linkedin.com/in/somasaidinesh](https://www.linkedin.com/in/somasaidinesh/)
- **Full Docs:** `docs/` folder — LLM.md · task_plan.md · findings.md · progress.md

---

*Built, tested, and documented by Somasai Cheviti — SDET · Playwright · TypeScript · React · AI Testing*
