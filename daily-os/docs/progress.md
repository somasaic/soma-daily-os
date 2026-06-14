# Progress Log — Soma Daily OS

## 2026-06-14 — Day 2 (continued): Voice Continuity Fix

### ✅ Fix: Mic replaces first sentence when user pauses before speaking second (commit `31f6657`)

**Observed behaviour:** Speaking sentence 1 → pause 2–3 seconds → speak sentence 2 → sentence 1 disappears, textarea only shows sentence 2.

**Root cause — Bug 1 (within-session drops):**
`onresult` loop started at `e.resultIndex` (the index of only the newest result). When sentence 1 finalized at index 0 and sentence 2 fired a new event at index 1, the loop only processed index 1 — sentence 1 was silently dropped every time.

**Root cause — Bug 2 (cross-session restart drops):**
Chrome auto-stops `SpeechRecognition` after silence and fires `onend`. The code restarts via `rec.start()`, but a new session has a fresh empty `e.results`. `base` was captured once at mic-on and never updated, so when sentence 2 arrived in the new session: `base ("") + sessionFinals ("sentence 2")` — sentence 1 gone.

**Fix — `src/utils/voice.js`:**
- Changed loop to start at `i = 0` instead of `e.resultIndex` — always reconstructs full finals for the current session.
- Added `sessionFinals` variable to track finals across the session.
- In `onend`: `base += sessionFinals; sessionFinals = ''` before restarting — each new session builds on top of everything already spoken.

**Result:** Any number of sentences with any gap between them all accumulate correctly in the textarea.

---

## 2026-06-14 — Day 2 (continued): Running Correct React v2 App

### ✅ Fix: User was running old vanilla JS app instead of React v2

**Observed behaviour:** App showed old interface — no Kanban drag-drop, no bug fixes visible.

**Root cause:** Command used was `npx live-server "...\daily-os\app"`. The `app` folder contains the **original vanilla JS v1** (index.html, css/, js/). The React v2 app lives at `daily-os/` root with `src/`, `dist/`, `package.json`.

**Fix — Correct commands to run React v2:**
- Dev mode: `npm run dev` from `daily-os/` → http://localhost:5173
- Production build: `npm run build` then `npx live-server "...\daily-os\dist"`

---

## 2026-06-14 — Day 2: 14 Bug Fixes

### ✅ All 14 reported bugs fixed and pushed (commit `827f513`)

**Root Causes & Fixes:**

#### Voice Input (Issues 2, 3, 4, 10, 11)
- **Root cause**: `voice.js` expected raw DOM elements; callers were passing React refs (`{ current: el }`) or `e.currentTarget` wrapped in an object. Also, React 18 controlled inputs require the native property descriptor setter — plain `element.value = x` does not fire `onChange`.
- **Fix**: Complete rewrite of `voice.js`. Added `unwrap(x)` to resolve refs. Added `setNativeValue(el, value)` using `Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value)` to force React's synthetic onChange.

#### Streak Badge '0' (Issue 1)
- **Root cause**: `{journeyDay && <Component />}` renders `0` when `journeyDay === 0` — React's falsy render gotcha with numbers.
- **Fix**: Changed to `{journeyDay > 0 && <Component />}` in `Header.jsx`.

#### Export broken (Issue 12)
- **Root cause**: `BackupRestore.jsx` called `exportAllData()` with no arguments. Function signature was `exportAllData(dashState, lpState)`, so both args were `undefined`. `JSON.stringify` omits `undefined` keys — output was just `{ "exported": "2026-06-14T..." }`.
- **Fix**: Build export object directly in `BackupRestore.jsx` using `state` from context + `loadLearnPrep()` from storage.

#### Kanban empty column drop (Issue 13)
- **Root cause**: Column divs had `id={column.id}` as a plain HTML attribute. dnd-kit does NOT use HTML `id` — needs `useDroppable({ id })` to register a DOM node as a droppable target. Without it, closestCorners cannot find the empty column.
- **Fix**: Added `useDroppable` hook to `KanbanColumn`. Attached `ref={setNodeRef}` to the cards container.

#### Skills Pause button (Issue 9)
- **Root cause**: Skill status value is `'paused'`, so the generated class is `btn-paused`. CSS only had `.skill-btn.btn-pause` (missing the 'd').
- **Fix**: Added `.skill-btn.btn-paused` to the CSS rule.

#### Hunt Tab edit invisible (Issue 14)
- **Root cause**: Edit form was rendered at page top (above the "Log Application" card). Clicking edit on a row deep in the pipeline showed nothing at the current viewport position.
- **Fix**: Moved edit form inline per row inside `hunt-app-row`.

#### Quick Wins (Issue 6)
- **Features added**: reset count per chip (`e.stopPropagation()` + clear from `tapped` map), add custom chip (dispatches `ADD_QW_CHIP`), delete custom chip (dispatches `DELETE_QW_CHIP`).
- **New state**: `qwCustomChips: []` added to initial state and reducer.

#### Park Ideas edit (Issue 7)
- Added inline edit form per idea (tag picker + textarea + mic + Save/Cancel). Dispatches existing `UPDATE_IDEA` action.

#### Day Context edit/delete (Issue 8)
- Added inline edit per reflection (rating + textarea + mic + Save/Cancel). Added delete with confirm.
- **New reducer cases**: `UPDATE_REFLECTION`, `DELETE_REFLECTION`.

#### Schedule spacing (Issue 5)
- Wrapped each slot in `.sched-slot-wrap` div. Applied `border-bottom` separator at wrapper level. Increased gap between schedule-item elements and slot-timer-row.

### Files Modified (13 files, commit `827f513`)
1. `src/utils/voice.js` — complete rewrite
2. `src/components/dashboard/Header.jsx`
3. `src/components/dashboard/today/NonNegotiables.jsx`
4. `src/components/dashboard/today/Pendings.jsx`
5. `src/components/dashboard/today/BackupRestore.jsx`
6. `src/components/dashboard/today/QuickWins.jsx`
7. `src/components/dashboard/today/ParkIdeas.jsx`
8. `src/components/dashboard/today/DayContext.jsx`
9. `src/components/dashboard/today/Schedule.jsx`
10. `src/components/dashboard/jobs/KanbanBoard.jsx`
11. `src/components/dashboard/tabs/HuntTab.jsx`
12. `src/store/DashboardContext.jsx`
13. `src/styles/dashboard.css`

### Build Output
```
✓ 80 modules transformed, built in 3.45s
dist/assets/index.css   47.03 kB │ gzip:  8.37 kB
dist/assets/index.js   361.74 kB │ gzip: 109.07 kB
```

---

## 2026-06-13 — Day 1: Full React Migration

### ✅ Phase B (Blueprint) — COMPLETE
- Defined all data schemas in LLM.md
- Mapped all 60+ features to components
- Defined Kanban architecture with @dnd-kit
- Confirmed localStorage key strategy (soma_state, soma_lp_state preserved)

### ✅ Phase L (Link) — COMPLETE
- Web Speech API → voice.js utility
- Web Audio API → alarm.js utility
- localStorage → storage.js utility
- All browser APIs mapped

### ✅ Phase A (Architect) — COMPLETE
45 source files created across:
- `src/main.jsx`, `src/App.jsx`
- `src/store/` — DashboardContext.jsx, LearnPrepContext.jsx
- `src/utils/` — storage.js, utils.js, alarm.js, voice.js
- `src/constants/` — dashboard.js, learnPrep.js
- `src/components/dashboard/` — Header, StreakPanel, DayTypeSelector, TabBar
- `src/components/dashboard/today/` — 11 components
- `src/components/dashboard/tabs/` — SkillsTab, WeeklyTab, NotesTab, LogTab, HuntTab
- `src/components/dashboard/jobs/` — KanbanBoard, JobCard, StarBank
- `src/components/learn-prep/` — 5 tab components + header
- `src/components/shared/` — Toast, Modal
- `src/pages/` — Dashboard.jsx, LearnPrep.jsx
- `src/styles/` — common.css, dashboard.css, learn-prep.css

### ✅ Phase S (Stylize) — COMPLETE
- Full browser width (removed max-width 640px)
- Kanban horizontal scroll columns
- All existing visual design preserved

### ✅ Phase T (Trigger) — COMPLETE (partial)
- `npm run dev` working at localhost:5173
- `npm run build` clean — 45 modules, no errors
- Pushed to GitHub: commit `b62bc49`, 95 files, 24,712 insertions

### Key Decisions Made
1. Keep existing CSS files — preserves visual design
2. React Context + useReducer (no Zustand/Redux)
3. Hunt tab gets HUNT_SEED data pre-loaded on first run
4. Kanban uses @dnd-kit (not react-beautiful-dnd — deprecated)
5. Dark mode via `data-theme` attribute on `<html>` element
6. All timer state (countdown timers) is React useState + useRef (not persisted)
7. Voice input is a standalone utility (`voice.js`) called directly — not a custom hook
8. HashRouter used (not BrowserRouter) to avoid Vite base-path issues

### GitHub
- Repo: `https://github.com/somasaic/soma-daily-os`
- Branch: `main`
- v1 history preserved (9 vanilla JS commits intact)
- v2 migration commit: `b62bc49`
- Bug fix commit: `827f513`

### Next Steps
- [ ] Deploy to Vercel
