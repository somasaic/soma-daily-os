# Findings — Soma Daily OS React Migration

## Architecture Discoveries

### 1. State Complexity
The dashboard state is a single large object (`soma_state`) with ~20 top-level keys. React Context + useReducer is the right call — no need for Redux or Zustand for this scale.

### 2. Schedule Timer Architecture (Critical)
Slot countdown timers use `setInterval` tracked with `useRef` to avoid stale closure issues. Each slot has:
- `duration`: minutes (stored in `timerDurations` local state per day+slot key)
- `elapsed`: seconds counted up (transient — not persisted)
- `running`: boolean (transient)
- `alarm`: Web Audio API arpeggio on completion

### 3. Voice Input Pattern (Updated)
The original plan was a `useVoiceInput` hook. The actual implementation is a standalone `voice.js` utility with `toggleVoiceInput(targetOrRef, btnOrRef, onToast)`. This is called directly from JSX onClick handlers, which is simpler than a hook for one-shot toggle behavior.

**React 18 controlled input caveat**: Setting `element.value = x` on a React-controlled input does NOT trigger `onChange`. You must use the native property descriptor setter:
```js
const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
setter.call(el, value)
el.dispatchEvent(new Event('input', { bubbles: true }))
```

### 4. localStorage Keys Preserved
All data is stored under `soma_state` and `soma_lp_state`. The React app reads these on init and writes on every dispatch. Existing user data survives the migration.

### 5. Kanban Implementation
- `@dnd-kit/core`: `DndContext` wraps the entire board
- `@dnd-kit/sortable`: `SortableContext` per column
- `useSortable` hook on each job card
- `useDroppable` hook on each column's cards container — **critical for empty columns**
- On `onDragEnd`: if `over.id` is a column ID → use that as new status; if it's a card ID → use that card's status
- Columns: applied, screened, round1, round2, offer, rejected, withdrawn

**Gotcha**: `id={column.id}` on a plain HTML div is NOT a dnd-kit droppable. `useDroppable({ id })` with `ref={setNodeRef}` is required. Without it, dragging into an empty column has no valid drop target.

### 6. List/Kanban View Toggle
Two modes in the Jobs tab:
- **Kanban** (default): 7 horizontal scrollable columns
- **List**: Flat list of all jobs, sorted by date
Toggle state is local UI state (`useState`), not persisted.

### 7. Hunt Tab vs Jobs Tab
Two separate features sharing no state:
- `jobs`: Clean Kanban tracker (Applied → Offer)
- `huntApps`: Detailed follow-up tracker with urgency, contact, channel, match%, templates

### 8. React Numeric Falsy Render Gotcha
`{count && <Component />}` renders the number `0` as text when `count === 0`. Always use explicit comparison: `{count > 0 && <Component />}` or `{Boolean(count) && <Component />}`.

### 9. PDF Export
Uses `window.print()` with `@media print` CSS overrides. No modal needed — calling `window.print()` directly from a button is sufficient.

### 10. ICS Calendar Export
Pure JS — generates `.ics` string and triggers download via `URL.createObjectURL`. No external library. Preserved as logic inside `Schedule.jsx`.

### 11. HashRouter vs BrowserRouter
Using `HashRouter` (URLs like `/#/learn-prep`) avoids Vite base-path configuration issues. Works correctly on both localhost and GitHub Pages / Vercel without any server-side routing config.

---

## Gotchas Found During Migration

### 1. window.* Function Bindings
Vanilla app used `window.functionName = function()` for HTML `onclick` attributes. In React, all event handlers are JSX props (`onClick={handler}`) — no window bindings.

### 2. innerHTML Rendering
Vanilla app rendered HTML via `element.innerHTML = renderHTML()`. React is declarative JSX. The `esc()` XSS-escape function is not needed — React auto-escapes string interpolations.

### 3. Module Imports
All imports go through the React component tree and utility modules. State is accessed via `useDashboard()` / `useLearnPrep()` context hooks, not global variables.

### 4. Timer Cleanup
All `setInterval` timers must be cleaned up in `useEffect` return functions to prevent memory leaks on unmount. Store interval IDs in `useRef`, not state.

### 5. Dark Mode CSS Variable
Dark mode is set via `document.documentElement.setAttribute('data-theme', 'dark')`. Call this in a `useEffect` whenever `darkMode` state changes.

### 6. React Ref Unwrapping in Utilities
When a utility function (like `voice.js`) must work with both `useRef` objects and raw DOM elements, add an unwrap helper:
```js
function unwrap(x) {
  return (x && typeof x === 'object' && 'current' in x) ? x.current : x
}
```
This handles `useRef()` refs, manually constructed `{ current: el }` objects, and direct DOM element references.

### 7. CSS Class Naming for Dynamic Statuses
When generating CSS classes dynamically from state values (`btn-${status}`), ensure every possible status value has a corresponding CSS rule. The status `'paused'` generates class `btn-paused`, not `btn-pause`.

### 8. dnd-kit Empty Drop Targets
When all cards are dragged out of a Kanban column, the column has no sortable items. `closestCorners` can't find any target inside it. Register the column container with `useDroppable` so the column itself is always a valid drop target regardless of how many cards it has.

### 9. Hunt Tab Inline Edit UX
Rendering an edit form at the top of a page (above a long list) creates invisible edits — the user scrolls down, clicks edit, and the form appears far out of view. Always render edit forms inline, adjacent to the item being edited.
