import { state, todayStr, save, renderStats } from './dashboard.js';
import { DEFAULT_NON_NEG } from './constants.js';
import { uid } from '../common/utils.js';

let nnEditMode = false;

// ── GETTERS ─────────────────────────────────
function getTodayChecks() {
  return state.checks[todayStr] || {};
}

export function getChecksCount() {
  const c = getTodayChecks();
  return state.nonNeg.filter(n => c[n.id]).length;
}

// ── RENDERING ───────────────────────────────
export function renderNonNeg() {
  const c = getTodayChecks();
  const listEl = document.getElementById('nn-list');
  const editBtn = document.getElementById('nn-edit-btn');
  const resetBtn = document.getElementById('nn-reset-btn');
  const addRow = document.getElementById('nn-add-row');
  const completeEl = document.getElementById('nn-complete');
  
  if (editBtn) editBtn.textContent = nnEditMode ? '✅ Done' : '✏️ Edit';
  if (resetBtn) resetBtn.style.display = nnEditMode ? '' : 'none';
  if (addRow) addRow.style.display = nnEditMode ? 'block' : 'none';
  
  if (listEl) {
    listEl.innerHTML = state.nonNeg.map(n => `
      <div class="nn-item ${!nnEditMode && c[n.id] ? 'checked-item' : ''}" 
           onclick="${nnEditMode ? '' : `toggleCheck('${n.id}')`}" 
           style="${nnEditMode ? 'cursor:default' : ''}">
        <div class="nn-checkbox ${!nnEditMode && c[n.id] ? 'checked' : ''}">${!nnEditMode && c[n.id] ? '✓' : ''}</div>
        <div class="nn-text">${n.label}</div>
        ${nnEditMode ? `<button class="icon-btn" onclick="deleteNonNeg('${n.id}')" title="Delete" style="opacity:.5;flex-shrink:0;margin-left:auto">🗑</button>` : ''}
      </div>`).join('');
  }
  
  if (completeEl) completeEl.textContent = getChecksCount() + '/' + state.nonNeg.length;
}

// ── ACTIONS ─────────────────────────────────
export function toggleCheck(id) {
  if (!state.checks[todayStr]) state.checks[todayStr] = {};
  state.checks[todayStr][id] = !state.checks[todayStr][id];
  save();
  renderNonNeg();
  renderStats();
}

export function toggleNonNegEdit() {
  nnEditMode = !nnEditMode;
  renderNonNeg();
}

export function addNonNeg() {
  const input = document.getElementById('nn-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  
  state.nonNeg.push({ id: uid(), label: text });
  save();
  if (input) input.value = '';
  renderNonNeg();
  renderStats();
}

export function deleteNonNeg(id) {
  state.nonNeg = state.nonNeg.filter(n => n.id !== id);
  save();
  renderNonNeg();
  renderStats();
}

export function resetNonNeg() {
  if (!confirm('Reset non-negotiables to default 3?')) return;
  state.nonNeg = JSON.parse(JSON.stringify(DEFAULT_NON_NEG));
  save();
  nnEditMode = false;
  renderNonNeg();
  renderStats();
}

// ── BIND WINDOW INTERFACES ──────────────────
window.toggleCheck = toggleCheck;
window.toggleNonNegEdit = toggleNonNegEdit;
window.addNonNeg = addNonNeg;
window.deleteNonNeg = deleteNonNeg;
window.resetNonNeg = resetNonNeg;
