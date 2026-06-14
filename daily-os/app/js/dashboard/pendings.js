import { state, todayStr, save } from './dashboard.js';
import { uid } from '../common/utils.js';

let editingPendingId = null;
let showDonePendings = false;

// ── RENDERING ───────────────────────────────
export function renderPendings() {
  const listEl = document.getElementById('pending-list');
  const badgeEl = document.getElementById('pending-badge');
  if (!listEl) return;

  const undone = state.pendings.filter(p => !p.done);
  const done = state.pendings.filter(p => p.done);

  // Update count badge
  if (badgeEl) {
    badgeEl.textContent = undone.length;
    badgeEl.style.display = undone.length ? '' : 'none';
  }

  function itemHTML(p) {
    const fromOtherDay = p.date !== todayStr;
    const fromLabel = fromOtherDay
      ? `<div class="pending-from">↩ From ${p.date}</div>` : '';
    const isEditing = editingPendingId === p.id;
    
    if (isEditing) {
      return `
      <div class="pending-item">
        <div class="pending-check ${p.done ? 'done' : ''}" onclick="togglePendingDone('${p.id}')">${p.done ? '✓' : ''}</div>
        <div class="pending-body" style="flex:1">
          <div class="pending-edit-row">
            <input class="pending-input" id="pedit-${p.id}" value="${p.text.replace(/"/g, '&quot;')}" style="flex:1" />
            <button class="btn-sm" onclick="savePendingEdit('${p.id}')">Save</button>
            <button class="btn-sm-ghost" onclick="cancelPendingEdit()">✕</button>
          </div>
        </div>
      </div>`;
    }
    
    return `
    <div class="pending-item">
      <div class="pending-check ${p.done ? 'done' : ''}" onclick="togglePendingDone('${p.id}')">${p.done ? '✓' : ''}</div>
      <div class="pending-body">
        <div class="pending-text ${p.done ? 'done-text' : ''}">${p.text}</div>
        ${fromLabel}
      </div>
      <div class="pending-actions">
        <button class="icon-btn" onclick="startPendingEdit('${p.id}')" title="Edit">✏️</button>
        <button class="icon-btn" onclick="deletePending('${p.id}')" title="Delete">🗑</button>
      </div>
    </div>`;
  }

  let html = '';
  if (!undone.length && !done.length) {
    html = '<div class="empty-msg">No pendings — clean slate! Add anything planned but not done yet.</div>';
  } else {
    html += undone.map(itemHTML).join('');
    if (done.length) {
      html += `
      <div class="done-toggle" onclick="toggleShowDone()">
        ${showDonePendings ? '▾' : '▸'} Done (${done.length})
      </div>`;
      if (showDonePendings) {
        html += `<div class="done-section">${done.map(itemHTML).join('')}</div>`;
      }
    }
  }
  listEl.innerHTML = html;
}

function toggleShowDone() {
  showDonePendings = !showDonePendings;
  renderPendings();
}

// ── ACTIONS ─────────────────────────────────
export function addPending() {
  const input = document.getElementById('pending-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  
  state.pendings.push({ id: uid(), text, date: todayStr, done: false });
  save();
  if (input) input.value = '';
  renderPendings();
}

export function togglePendingDone(id) {
  const p = state.pendings.find(p => p.id === id);
  if (p) p.done = !p.done;
  save();
  renderPendings();
}

export function deletePending(id) {
  state.pendings = state.pendings.filter(p => p.id !== id);
  save();
  renderPendings();
}

export function startPendingEdit(id) {
  editingPendingId = id;
  renderPendings();
  setTimeout(() => {
    const el = document.getElementById('pedit-' + id);
    if (el) el.focus();
  }, 50);
}

export function cancelPendingEdit() {
  editingPendingId = null;
  renderPendings();
}

export function savePendingEdit(id) {
  const el = document.getElementById('pedit-' + id);
  if (!el) return;
  const p = state.pendings.find(p => p.id === id);
  if (p && el.value.trim()) p.text = el.value.trim();
  save();
  editingPendingId = null;
  renderPendings();
}

export function clearDonePendings() {
  state.pendings = state.pendings.filter(p => !p.done);
  save();
  renderPendings();
}

// ── BIND WINDOW INTERFACES ──────────────────
window.addPending = addPending;
window.togglePendingDone = togglePendingDone;
window.deletePending = deletePending;
window.startPendingEdit = startPendingEdit;
window.cancelPendingEdit = cancelPendingEdit;
window.savePendingEdit = savePendingEdit;
window.clearDonePendings = clearDonePendings;
window.toggleShowDone = toggleShowDone;
export { showDonePendings };
