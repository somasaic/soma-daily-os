import { state, save, todayStr } from './dashboard.js';

export function renderLog() {
  const logs=[...state.logs].slice(-15).reverse();
  if (!logs.length) {
    document.getElementById('log-history').innerHTML='<div class="empty-msg">No entries yet. Start logging today — it compounds fast.</div>';
    return;
  }
  document.getElementById('log-history').innerHTML=logs.map((l,ri)=>{
    const i=state.logs.length-1-ri;
    const isEditing=window._editingLogIdx===i;
    return `<div class="log-entry">
      <div class="log-entry-header">
        <div class="log-date">${l.date}</div>
        <div style="display:flex;gap:4px">
          <button class="icon-btn" onclick="startLogEdit(${i})" title="Edit">✏️</button>
          <button class="icon-btn" onclick="deleteLog(${i})" title="Delete">🗑</button>
        </div>
      </div>
      ${isEditing?`
        <div class="mic-wrap"><textarea class="log-edit-area" id="log-edit-area">${l.text}</textarea>
        <div class="form-btns" style="margin-top:6px">
          <button class="btn-sm" onclick="saveLogEdit(${i})">Save</button>
          <button class="btn-sm-ghost" onclick="cancelLogEdit()">Cancel</button>
        </div>
      `:`<div class="log-text">${l.text}</div>`}
    </div>`;
  }).join('');
}


function saveLog() {
  const text=document.getElementById('log-input').value.trim();
  if (!text) return;
  state.logs.push({date:todayStr,text});
  save(); document.getElementById('log-input').value=''; renderLog();
}
function startLogEdit(i) { window._editingLogIdx=i; renderLog(); }
function cancelLogEdit() { window._editingLogIdx=null; renderLog(); }
function saveLogEdit(i) {
  const el=document.getElementById('log-edit-area');
  if (!el) return;
  state.logs[i].text=el.value.trim();
  save(); window._editingLogIdx=null; renderLog();
}
function deleteLog(i) {
  if (!confirm('Delete this log entry?')) return;
  state.logs.splice(i,1);
  save(); window._editingLogIdx=null; renderLog();
}

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS + REMINDERS + ICS EXPORT
// ══════════════════════════════════════════════════════════════════════════════


// Bind to window for inline HTML handlers
window.renderLog = renderLog;
window.saveLog = saveLog;
window.startLogEdit = startLogEdit;
window.cancelLogEdit = cancelLogEdit;
window.saveLogEdit = saveLogEdit;
window.deleteLog = deleteLog;
