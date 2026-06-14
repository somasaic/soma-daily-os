# Findings — Soma Daily OS React Migration

## Architecture Discoveries

### 1. State Complexity
The dashboard state is a single large object (`soma_state`) with ~20 top-level keys. Using React Context + useReducer is the right call — no need for Redux or Zustand for this scale.

### 2. Schedule Timer Architecture (Critical)
The slot countdown timers use `setInterval` and must be tracked with `useRef` in React to avoid stale closure issues. Each slot has:
- `duration`: minutes (stored in `scheduleTimers` per day+slot)
- `remaining`: seconds countdown (transient, not persisted)
- `running`: boolean (transient)
- `alarm`: Web Audio API arpeggio on zero

### 3. Voice Input Pattern
The existing voice.js uses a singleton `SpeechRecognition` instance. In React, this becomes a custom `useVoiceInput(targetRef, buttonRef)` hook that toggles mic on/off per textarea.

### 4. localStorage Keys Preserved
Critical: all data is stored under `soma_state` and `soma_lp_state`. The React app reads these on init and writes on every dispatch. This means existing user data survives the migration.

### 5. Kanban Implementation
- @dnd-kit/core: `DndContext` wraps the board
- @dnd-kit/sortable: `SortableContext` per column
- `useSortable` hook on each job card
- On `onDragEnd`: update job status to destination column ID
- Columns: applied, screened, round1, round2, offer, rejected, withdrawn

### 6. "All" View Toggle
Two modes in the Jobs tab:
- **Kanban** (default): 7 horizontal scrollable columns
- **List**: Flat list of all jobs, sorted by date (existing card design)
Toggle state is local UI state (`useState`), not persisted.

### 7. Hunt Tab Data
The Hunt tab has its OWN state key (`huntApps`) separate from the Jobs tab (`jobs`). These are two distinct features:
- `jobs`: Clean Kanban tracker (Applied → Offer)
- `huntApps`: Detailed follow-up tracker with urgency, contact, channel, match%, etc.
The HUNT_SEED data (60+ applications) is pre-loaded into initial state if huntApps is empty.

### 8. Park Ideas with File Attachments
Files are stored as base64 data URLs in localStorage. This is fine for small files but can hit localStorage limits (~5MB) for large attachments. Preserved as-is.

### 9. PDF Export
Uses `window.print()` with a `@media print` CSS override. In React, trigger by opening a modal with the schedule content, then calling `window.print()`.

### 10. ICS Calendar Export
Pure JavaScript — generates `.ics` file content as a string and triggers download via `URL.createObjectURL`. No external library needed. Preserved as a utility function.

## Gotchas Found During Migration

### 1. window.* Function Bindings
The vanilla app used `window.functionName = function()` to make functions callable from HTML `onclick` attributes. In React, ALL event handlers are JSX props (`onClick={handler}`) — no window bindings needed.

### 2. innerHTML Rendering
The vanilla app rendered HTML via `element.innerHTML = renderHTML()`. In React, all UI is declarative JSX. The `esc()` function (XSS escape) is no longer needed for JSX — React auto-escapes.

### 3. Module Imports
The vanilla app used ES module imports between JS files. In React, all imports go through the component tree. The `state` object is accessed via `useDashboard()` context hook.

### 4. Timer Cleanup
In React, all `setInterval` timers MUST be cleaned up in `useEffect` return functions to prevent memory leaks when components unmount/re-render.

### 5. Dark Mode CSS Variable
Dark mode is set via `document.documentElement.setAttribute('data-theme', 'dark')`. This works the same in React — just call it in a `useEffect` when `darkMode` state changes.
