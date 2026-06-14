import { state, save, todayStr, renderStats } from './dashboard.js';
import { SKILLS_DATA, TIER_COLORS } from './constants.js';
import { renderQuickWins } from './quick-wins.js';
import { esc } from '../common/utils.js';

window._editingSkillId = null;

export function getSkillProgress(id) {
  if (state.skills[id] !== undefined) return state.skills[id];
  const custom = state.customSkills.find(s => s.id === id);
  if (custom) return custom.def || 0;
  const builtin = SKILLS_DATA.flatMap(t => t.skills).find(s => s.id === id);
  return builtin ? builtin.def : 0;
}

export function getSkillName(id) {
  if (state.skillEdits[id]?.name) return state.skillEdits[id].name;
  const custom = state.customSkills.find(s => s.id === id);
  if (custom) return custom.name;
  const builtin = SKILLS_DATA.flatMap(t => t.skills).find(s => s.id === id);
  return builtin ? builtin.name : id;
}

export function getSkillNote(id) {
  if (state.skillEdits[id]?.note !== undefined) return state.skillEdits[id].note;
  const custom = state.customSkills.find(s => s.id === id);
  if (custom) return custom.note || '';
  const builtin = SKILLS_DATA.flatMap(t => t.skills).find(s => s.id === id);
  return builtin ? builtin.note : '';
}

export function getOverallProgress() {
  const all = [...SKILLS_DATA.flatMap(t => t.skills), ...state.customSkills];
  if (!all.length) return 0;
  return Math.round(all.reduce((sum, s) => sum + getSkillProgress(s.id), 0) / all.length);
}

export function getActiveSkillsCount() {
  return Object.values(state.skillStatus).filter(v => v === 'active').length;
}

export function renderSkills() {
  const editingId = window._editingSkillId;
  const container = document.getElementById('skills-container');
  if (!container) return;

  container.innerHTML = SKILLS_DATA.map(tier => {
    const customInTier = state.customSkills.filter(s => s.tier === tier.tier);
    const allSkills = [...tier.skills, ...customInTier];
    return `
    <div class="card">
      <div class="tier-header" style="color:${tier.color};border-color:${tier.color}30">
        <div class="tier-left"><div class="tier-dot" style="background:${tier.color}"></div>${tier.name}</div>
      </div>
      ${allSkills.map(skill => {
        const id = skill.id;
        const progress = getSkillProgress(id);
        const status = state.skillStatus[id] || 'none';
        const isEditing = editingId === id;
        const isCustom = id.startsWith('custom_');
        const displayName = getSkillName(id);
        const note = getSkillNote(id);

        return `
        <div class="skill-item">
          <div class="skill-name-row">
            <div class="skill-name">${esc(displayName)}</div>
            <div class="skill-edit-btns">
              <button class="icon-btn" onclick="startSkillEdit('${id}')" title="Edit note/name">✏️</button>
              ${isCustom ? `<button class="icon-btn" onclick="deleteCustomSkill('${id}')" title="Delete custom skill" style="color:var(--r)">🗑</button>` : ''}
            </div>
          </div>
          ${note ? `<div class="skill-note">${esc(note)}</div>` : ''}
          <div class="skill-progress">
            <div class="progress-bar"><div class="progress-fill" style="width:${progress}%;background:${tier.color}"></div></div>
            <div class="progress-pct">${progress}%</div>
          </div>
          <div class="skill-controls">
            <button class="skill-btn ${status === 'active' ? 'btn-active' : ''}" onclick="setSkillStatus('${id}','active')">🔥 Active</button>
            <button class="skill-btn ${status === 'done' ? 'btn-done' : ''}" onclick="setSkillStatus('${id}','done')">✅ Done</button>
            <button class="skill-btn ${status === 'pause' ? 'btn-pause' : ''}" onclick="setSkillStatus('${id}','pause')">⏸ Pause</button>
            <button class="skill-btn" onclick="adjustProgress('${id}',-10)">-10%</button>
            <button class="skill-btn" onclick="adjustProgress('${id}',10)">+10%</button>
          </div>
          ${isEditing ? `
          <div class="skill-edit-form">
            <div class="skill-form-row">
              <label>Name</label>
              <input class="form-input" id="sedit-name" value="${esc(displayName)}" />
            </div>
            <div class="skill-form-row">
              <label>Note</label>
              <input class="form-input" id="sedit-note" value="${esc(note)}" />
            </div>
            <div class="form-btns">
              <button class="btn-sm" onclick="saveSkillEdit('${id}')">Save</button>
              <button class="btn-sm-ghost" onclick="cancelSkillEdit()">Cancel</button>
            </div>
          </div>
          ` : ''}
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

export function resetSkillPct(id) {
  state.skills[id] = 0;
  const key = 'soma_qw_' + todayStr;
  const taps = JSON.parse(localStorage.getItem(key) || '{}');
  delete taps[id];
  localStorage.setItem(key, JSON.stringify(taps));
  save();
  renderQuickWins();
  renderSkills();
  renderStats();
}

export function setSkillStatus(id, status) {
  state.skillStatus[id] = (state.skillStatus[id] === status) ? 'none' : status;
  save();
  renderSkills();
  renderStats();
}

export function adjustProgress(id, delta) {
  state.skills[id] = Math.max(0, Math.min(100, getSkillProgress(id) + delta));
  save();
  renderSkills();
  renderStats();
}

export function startSkillEdit(id) {
  window._editingSkillId = id;
  renderSkills();
}

export function cancelSkillEdit() {
  window._editingSkillId = null;
  renderSkills();
}

export function saveSkillEdit(id) {
  const name = document.getElementById('sedit-name')?.value.trim();
  const note = document.getElementById('sedit-note')?.value.trim();
  if (!state.skillEdits[id]) state.skillEdits[id] = {};
  if (name) state.skillEdits[id].name = name;
  if (note !== undefined) state.skillEdits[id].note = note;
  
  const ci = state.customSkills.findIndex(s => s.id === id);
  if (ci >= 0) {
    state.customSkills[ci].name = name;
    state.customSkills[ci].note = note;
  }
  save();
  window._editingSkillId = null;
  renderSkills();
  renderQuickWins();
}

export function addCustomSkill() {
  const name = document.getElementById('new-skill-name')?.value.trim() || '';
  const note = document.getElementById('new-skill-note')?.value.trim() || '';
  const tier = document.getElementById('new-skill-tier')?.value || 'tier1';
  const pct = parseInt(document.getElementById('new-skill-pct')?.value) || 0;
  if (!name) {
    alert('Skill name required');
    return;
  }
  const id = 'custom_' + Date.now();
  state.customSkills.push({ id, name, note, tier, def: pct });
  state.skills[id] = pct;
  save();
  
  const nInput = document.getElementById('new-skill-name');
  const ntInput = document.getElementById('new-skill-note');
  const pInput = document.getElementById('new-skill-pct');
  if (nInput) nInput.value = '';
  if (ntInput) ntInput.value = '';
  if (pInput) pInput.value = '0';

  renderSkills();
  renderQuickWins();
  renderStats();
}

export function deleteCustomSkill(id) {
  if (!confirm('Delete this skill?')) return;
  state.customSkills = state.customSkills.filter(s => s.id !== id);
  delete state.skills[id];
  delete state.skillStatus[id];
  delete state.skillEdits[id];
  save();
  window._editingSkillId = null;
  renderSkills();
  renderQuickWins();
  renderStats();
}

// Bind to window for inline HTML handlers
window.startSkillEdit = startSkillEdit;
window.cancelSkillEdit = cancelSkillEdit;
window.saveSkillEdit = saveSkillEdit;
window.setSkillStatus = setSkillStatus;
window.adjustProgress = adjustProgress;
window.resetSkillPct = resetSkillPct;
window.addCustomSkill = addCustomSkill;
window.deleteCustomSkill = deleteCustomSkill;
