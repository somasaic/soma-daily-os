import { state, save, todayStr } from './dashboard.js';
import { SKILLS_DATA, TIER_COLORS } from './constants.js';
import { getSkillProgress, getSkillName, renderSkills, resetSkillPct } from './skills.js';
import { renderStats } from './dashboard.js';

window._qwEditMode = false;

export function renderQuickWins() {
  const taps = JSON.parse(localStorage.getItem('soma_qw_' + todayStr) || '{}');
  const excluded = JSON.parse(localStorage.getItem('soma_qw_excluded') || '[]');
  const em = window._qwEditMode;
  const allSkills = [
    ...SKILLS_DATA.flatMap(t => t.skills.map(s => ({ ...s, color: TIER_COLORS[t.tier] }))),
    ...state.customSkills.map(s => ({ ...s, color: TIER_COLORS[s.tier] || '#6c47ff' }))
  ];
  
  const editBtn = document.getElementById('qw-edit-btn');
  if (editBtn) editBtn.textContent = em ? '✅ Done' : '✏️ Edit';

  const restoreBtn = document.getElementById('qw-restore-btn');
  if (restoreBtn) restoreBtn.style.display = (em && excluded.length) ? '' : 'none';

  const gridEl = document.getElementById('qw-grid');
  if (!gridEl) return;

  if (em) {
    // Edit mode — show all, 🗑 to hide, ✚ to restore
    gridEl.innerHTML = allSkills.map(s => {
      const isEx = excluded.includes(s.id);
      const displayName = getSkillName(s.id).split(' ').slice(0, 2).join(' ');
      return `<div class="qw-chip" style="${isEx ? 'opacity:.35;background:#f0f2f8;border-color:#d0d4e8;color:#aab0cc' : ''}">
        ${displayName}
        <button style="border:none;background:rgba(0,0,0,.07);cursor:pointer;border-radius:5px;padding:1px 5px;font-size:11px;margin-left:3px"
          onclick="${isEx ? `restoreFromQW('${s.id}')` : `excludeFromQW('${s.id}')`}">${isEx ? '✚' : '🗑'}</button>
      </div>`;
    }).join('');
  } else {
    // Normal mode — filter excluded, show ↩0% on tapped chips
    gridEl.innerHTML = allSkills
      .filter(s => !excluded.includes(s.id))
      .map(s => {
        const count = taps[s.id] || 0, tapped = count > 0;
        const displayName = getSkillName(s.id).split(' ').slice(0, 2).join(' ');
        return `<div class="qw-chip ${tapped ? 'tapped' : ''}"
          style="${tapped ? 'background:' + s.color + ';border-color:' + s.color : ''}"
          onclick="quickWinTap('${s.id}')">
          ${displayName}
          ${count > 0 ? `<span class="tap-count">+${count * 5}%</span>` : ''}
          ${tapped ? `<button style="border:none;background:rgba(255,255,255,.25);cursor:pointer;border-radius:5px;padding:1px 5px;font-size:10px;color:white;font-weight:700;margin-left:2px" onclick="event.stopPropagation();resetSkillPct('${s.id}')" title="Reset to 0%">↩0%</button>` : ''}
        </div>`;
      }).join('');
  }
}

export function quickWinTap(id) {
  const key = 'soma_qw_' + todayStr;
  const taps = JSON.parse(localStorage.getItem(key) || '{}');
  taps[id] = (taps[id] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(taps));
  state.skills[id] = Math.min(100, getSkillProgress(id) + 5);
  save();
  renderQuickWins();
  renderSkills();
  renderStats();
}

export function toggleQWEdit() {
  window._qwEditMode = !window._qwEditMode;
  renderQuickWins();
}

export function excludeFromQW(id) {
  const ex = JSON.parse(localStorage.getItem('soma_qw_excluded') || '[]');
  if (!ex.includes(id)) ex.push(id);
  localStorage.setItem('soma_qw_excluded', JSON.stringify(ex));
  renderQuickWins();
}

export function restoreFromQW(id) {
  let ex = JSON.parse(localStorage.getItem('soma_qw_excluded') || '[]');
  ex = ex.filter(x => x !== id);
  localStorage.setItem('soma_qw_excluded', JSON.stringify(ex));
  renderQuickWins();
}

export function restoreAllQW() {
  localStorage.removeItem('soma_qw_excluded');
  renderQuickWins();
}

// Bind to window for inline HTML handlers
window.quickWinTap = quickWinTap;
window.toggleQWEdit = toggleQWEdit;
window.excludeFromQW = excludeFromQW;
window.restoreFromQW = restoreFromQW;
window.restoreAllQW = restoreAllQW;
