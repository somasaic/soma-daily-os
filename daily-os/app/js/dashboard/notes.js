import { state, save, todayStr } from './dashboard.js';
import { NOTE_TYPES } from './constants.js';
import { uid } from '../common/utils.js';

export let activeNoteFilter = 'all';
export let selectedNoteType = 'general';

window.activeNoteFilter = activeNoteFilter;
window.selectedNoteType = selectedNoteType;

export function renderNotes() {
  const search=(document.getElementById('note-search')||{}).value?.toLowerCase()||'';
  let notes=[...state.notes].reverse();
  if (activeNoteFilter!=='all') notes=notes.filter(n=>n.type===activeNoteFilter);
  if (search) notes=notes.filter(n=>n.text.toLowerCase().includes(search));
  const pinned=notes.filter(n=>n.pinned), unpinned=notes.filter(n=>!n.pinned);
  const sorted=[...pinned,...unpinned];
  if (!sorted.length) {
    document.getElementById('notes-list').innerHTML='<div class="no-notes">No notes yet. Capture anything — recruiter calls, ideas, interrupts, things to follow up.</div>';
    return;
  }
  document.getElementById('notes-list').innerHTML=sorted.map(n=>{
    const nt=NOTE_TYPES.find(t=>t.id===n.type)||NOTE_TYPES[NOTE_TYPES.length-1];
    const isEditing=window._editingNoteId===n.id;
    return `<div class="note-card ${n.pinned?'pinned':''}">
      <div class="note-card-header">
        <div class="note-meta">
          <div class="note-type-chip" style="background:${nt.bg};color:${nt.color}">${nt.label}</div>
          <div class="note-date">${n.date}</div>
          ${n.pinned?'<span style="font-size:12px">📌</span>':''}
        </div>
        <div class="note-actions">
          <button class="icon-btn" onclick="toggleNotePin('${n.id}')" title="${n.pinned?'Unpin':'Pin'}">📌</button>
          <button class="icon-btn" onclick="startNoteEdit('${n.id}')" title="Edit">✏️</button>
          <button class="icon-btn" onclick="deleteNote('${n.id}')" title="Delete">🗑</button>
        </div>
      </div>
      ${isEditing?`
        <div class="mic-wrap"><textarea class="note-edit-area" id="note-edit-${n.id}">${n.text}</textarea><button class="mic-btn" onclick="startMic('note-edit-'+n.id)" title="Voice input">🎙️</button></div>
        <div class="form-btns">
          <button class="btn-sm" onclick="saveNoteEdit('${n.id}')">Save</button>
          <button class="btn-sm-ghost" onclick="cancelNoteEdit()">Cancel</button>
        </div>
      `:`<div class="note-text">${n.text}</div>`}
    </div>`;
  }).join('');
}

function selectNoteType(type) {
  selectedNoteType=type;
  renderNoteTypeRow();
  const row=document.getElementById('followup-date-row');
  if(row) row.style.display=(type==='recruiter')?'flex':'none';
}

function saveNote() {
  const text=document.getElementById('note-input').value.trim();
  if (!text) return;
  const followupInput=document.getElementById('note-followup-date');
  const followup=followupInput?followupInput.value:'';
  state.notes.push({id:uid(), text, type:selectedNoteType, date:todayStr, pinned:false, followup:followup||null});
  save();
  document.getElementById('note-input').value='';
  if(followupInput) followupInput.value='';
  renderNotes();
}

function toggleNotePin(id) {
  const n=state.notes.find(n=>n.id===id); if(n) n.pinned=!n.pinned;
  save(); renderNotes();
}

function startNoteEdit(id) { window._editingNoteId=id; renderNotes(); }
function cancelNoteEdit() { window._editingNoteId=null; renderNotes(); }

function saveNoteEdit(id) {
  const el=document.getElementById('note-edit-'+id);
  if (!el) return;
  const n=state.notes.find(n=>n.id===id); if(n) n.text=el.value.trim();
  save(); window._editingNoteId=null; renderNotes();
}

function deleteNote(id) {
  state.notes=state.notes.filter(n=>n.id!==id);
  save(); renderNotes();
}

// ══════════════════════════════════════════════════════════════════════════════
// ACTIONS — LOG
// ══════════════════════════════════════════════════════════════════════════════

export function checkRecruiterFollowups() {
  const banner = document.getElementById('followup-banner');
  if (banner) {
    const due = (state.notes || []).filter(n => n.type === 'recruiter' && n.followup && n.followup <= todayStr);
    if (!due.length) { banner.classList.remove('show'); }
    else {
      banner.classList.add('show');
      banner.innerHTML = `⏰ <strong>${due.length} recruiter follow-up${due.length>1?'s':''} due today!</strong>
        <button onclick="showTab('notes')" style="margin-left:auto;padding:3px 10px;border-radius:8px;border:none;background:rgba(0,0,0,.12);cursor:pointer;font-size:11px;font-weight:700">View Notes →</button>`;
    }
  }
  renderRecruiterSection();
}

export function renderRecruiterSection() {
  const el = document.getElementById('recruiter-list-today');
  if (!el) return;
  const recruiters = (state.notes || []).filter(n => n.type === 'recruiter').sort((a,b)=>(a.followup||'9999')>(b.followup||'9999')?1:-1);
  if (!recruiters.length) {
    el.innerHTML = `<div class="empty-msg">No recruiter notes yet. Go to Notes tab → select Recruiter type to add.</div>`;
    return;
  }
  el.innerHTML = recruiters.map(n => {
    const overdue = n.followup && n.followup < todayStr;
    const dueToday = n.followup && n.followup === todayStr;
    const upcoming = n.followup && n.followup > todayStr;
    const badge = overdue ? `<span style="background:#fee2e2;color:#dc2626;padding:1px 7px;border-radius:8px;font-size:10px;font-weight:700">⚠️ Overdue ${n.followup}</span>`
      : dueToday ? `<span style="background:#fef3c7;color:#d97706;padding:1px 7px;border-radius:8px;font-size:10px;font-weight:700">⏰ Due today</span>`
      : upcoming ? `<span style="background:#dcfce7;color:#16a34a;padding:1px 7px;border-radius:8px;font-size:10px;font-weight:700">📅 ${n.followup}</span>`
      : `<span style="background:#f4f5fb;color:#8892b0;padding:1px 7px;border-radius:8px;font-size:10px">No followup set</span>`;
    return `<div style="display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid #f4f5fb">
      <div style="flex:1">
        <div style="font-size:12px;color:#1a1d2e;line-height:1.4">${n.text.slice(0,80)}${n.text.length>80?'…':''}</div>
        <div style="margin-top:4px;display:flex;gap:5px;align-items:center;flex-wrap:wrap">
          ${badge}
          <span style="font-size:10px;color:#8892b0">${n.date}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

export function renderNoteFilters() {
  document.getElementById('note-filters').innerHTML=NOTE_TYPES.map(t=>`
    <div class="note-filter ${activeNoteFilter===t.id?'active':''}"
      onclick="setNoteFilter('${t.id}')">${t.label}</div>`).join('');
}

export function renderNoteTypeRow() {
  const row=document.getElementById('note-type-row');
  if (row) {
    row.innerHTML=NOTE_TYPES.filter(t=>t.id!=='all').map(t=>`
      <div class="note-type-opt ${selectedNoteType===t.id?'selected':''}"
        style="${selectedNoteType===t.id?'background:'+t.color+';border-color:'+t.color+';color:white':''}"
        onclick="selectNoteType('${t.id}')">${t.label}</div>`).join('');
  }
}

window.renderNotes = renderNotes;
window.selectNoteType = selectNoteType;
window.setNoteFilter = (type) => { activeNoteFilter = type; window.activeNoteFilter = type; renderNoteFilters(); renderNotes(); };
window.saveNote = saveNote;
window.toggleNotePin = toggleNotePin;
window.startNoteEdit = startNoteEdit;
window.cancelNoteEdit = cancelNoteEdit;
window.saveNoteEdit = saveNoteEdit;
window.deleteNote = deleteNote;
window.renderNoteFilters = renderNoteFilters;
window.renderNoteTypeRow = renderNoteTypeRow;
window.checkRecruiterFollowups = checkRecruiterFollowups;
window.renderRecruiterSection = renderRecruiterSection;
