import { state, todayStr, save } from './dashboard.js';
import { uid, esc } from '../common/utils.js';
import { toggleVoiceInput } from '../common/voice.js';

// ── ACTIONS ─────────────────────────────────
export function toggleStarForm() {
  const f = document.getElementById('star-add-form');
  if (f) f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

export function addStarAnswer() {
  const qEl = document.getElementById('star-q');
  const catEl = document.getElementById('star-cat');
  const sitEl = document.getElementById('star-sit');
  const actEl = document.getElementById('star-act');
  const resEl = document.getElementById('star-res');

  const q   = qEl ? qEl.value.trim() : '';
  const cat = catEl ? catEl.value : 'behavioral';
  const sit = sitEl ? sitEl.value.trim() : '';
  const act = actEl ? actEl.value.trim() : '';
  const res = resEl ? resEl.value.trim() : '';

  if (!q) {
    alert('Question required');
    return;
  }

  state.starBank.push({ id: uid(), q, cat, sit, act, res, date: todayStr });
  save();

  if (qEl) qEl.value = '';
  if (sitEl) sitEl.value = '';
  if (actEl) actEl.value = '';
  if (resEl) resEl.value = '';

  toggleStarForm();
  renderStarBank();
}

export function deleteStarAnswer(id) {
  if (!confirm('Delete this STAR answer?')) return;
  state.starBank = state.starBank.filter(s => s.id !== id);
  save();
  renderStarBank();
}

export function renderStarBank() {
  const el = document.getElementById('star-list');
  if (!el) return;
  
  const searchEl = document.getElementById('star-search');
  const q = searchEl ? searchEl.value.toLowerCase() : '';
  
  const items = (state.starBank || []).filter(s =>
    !q || s.q.toLowerCase().includes(q) || 
    (s.sit || '').toLowerCase().includes(q) || 
    (s.act || '').toLowerCase().includes(q) || 
    (s.res || '').toLowerCase().includes(q)
  );

  if (!items.length) {
    el.innerHTML = `<div class="empty-msg">${q ? 'No matches.' : 'No STAR answers yet. Add your first one!'}</div>`;
    return;
  }

  const CAT_COLORS = {
    behavioral: '#ede9ff',
    technical: '#dbeafe',
    leadership: '#dcfce7',
    conflict: '#fee2e2',
    achievement: '#fef3c7'
  };

  el.innerHTML = items.map(s => `
    <div class="note-card" style="margin-bottom:8px">
      <div class="note-card-header">
        <div class="note-meta">
          <span class="note-type-chip" style="background:${CAT_COLORS[s.cat] || '#f4f5fb'};color:#1a1d2e">${s.cat}</span>
          <span class="note-date">${s.date || ''}</span>
        </div>
        <button class="icon-btn" onclick="deleteStarAnswer('${s.id}')" title="Delete">🗑</button>
      </div>
      <div style="font-size:13px;font-weight:700;color:#1a1d2e;margin-bottom:7px">❓ ${esc(s.q)}</div>
      ${s.sit ? `<div style="font-size:12px;margin-bottom:4px"><span style="font-weight:700;color:#6c47ff">S+T:</span> ${esc(s.sit)}</div>` : ''}
      ${s.act ? `<div style="font-size:12px;margin-bottom:4px"><span style="font-weight:700;color:#22c55e">A:</span> ${esc(s.act)}</div>` : ''}
      ${s.res ? `<div style="font-size:12px"><span style="font-weight:700;color:#f59e0b">R:</span> ${esc(s.res)}</div>` : ''}
    </div>`).join('');
}

// ── BIND WINDOW INTERFACES ──────────────────
window.toggleStarForm = toggleStarForm;
window.addStarAnswer = addStarAnswer;
window.deleteStarAnswer = deleteStarAnswer;
window.renderStarBank = renderStarBank;

window.mic_starSit = () => {
  toggleVoiceInput('star-sit', 'mic-btn-star-sit');
};
window.mic_starAct = () => {
  toggleVoiceInput('star-act', 'mic-btn-star-act');
};
window.mic_starRes = () => {
  toggleVoiceInput('star-res', 'mic-btn-star-res');
};
