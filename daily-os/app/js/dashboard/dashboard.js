import { loadDashboardState, saveDashboardState } from '../common/storage.js';
import { initTheme, toggleTheme } from '../common/theme.js';
import { getJourneyDay } from '../common/utils.js';
import { toggleVoiceInput } from '../common/voice.js';
import { DEFAULT_NON_NEG, DEFAULT_WEEK_PLAN, BANNERS, FOCUS_MAP } from './constants.js';

// Import submodules to initialize and bind
import { renderSchedule, initMusic, checkReminders, updateTimerDisplays, activeDayTab } from './schedule.js';
import { renderNonNeg, getChecksCount } from './non-negotiables.js';
import { renderPendings } from './pendings.js';
import { renderQuickWins } from './quick-wins.js';
import { renderSkills, getOverallProgress, getActiveSkillsCount } from './skills.js';
import { renderWeekly, renderWeeklyReview, renderGitHubWidget } from './weekly.js';
import { renderNotes, renderNoteTypeRow, renderNoteFilters, checkRecruiterFollowups, renderRecruiterSection } from './notes.js';
import { renderLog } from './log.js';
import { renderMood, initDayContext } from './reflections.js';
import { renderJobs } from './jobs.js';
import { renderStarBank } from './star-bank.js';
import { renderParkIdeas } from './park-ideas.js';
import { renderHunt } from './hunt.js';

// ── STATE & CONSTANTS ───────────────────────
export let state = loadDashboardState(DEFAULT_NON_NEG, DEFAULT_WEEK_PLAN);
export const todayStr = new Date().toISOString().split('T')[0];

export function save() {
  saveDashboardState(state);
}

// ── INITIALIZATION ──────────────────────────
function initAppName() {
  const saved = localStorage.getItem('soma_app_name');
  const titleEl = document.getElementById('app-title');
  if (saved && titleEl) {
    titleEl.textContent = saved;
    document.title = saved;
  }
}

function updateStreak() {
  if (!state.lastDate) {
    state.streak = 1;
    state.lastDate = todayStr;
  } else if (state.lastDate !== todayStr) {
    const diff = (new Date(todayStr) - new Date(state.lastDate)) / 86400000;
    state.streak = diff === 1 ? state.streak + 1 : 1;
    state.lastDate = todayStr;
  }
  save();
}

export function renderHeader() {
  const dateEl = document.getElementById('date-display');
  const streakEl = document.getElementById('streak-count');
  const journeyEl = document.getElementById('journey-day');
  
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  if (streakEl) streakEl.textContent = state.streak;
  if (journeyEl) journeyEl.textContent = getJourneyDay(state.startDate, todayStr);
  
  const t = state.streakTarget;
  const lbl = state.streakTargetLabel;
  const sub = document.getElementById('streak-target-sub');
  const pw = document.getElementById('sp-progress-wrap');
  
  if (t > 0) {
    const pct = Math.min(100, Math.round((state.streak / t) * 100));
    const left = Math.max(0, t - state.streak);
    if (sub) {
      sub.style.display = '';
      sub.textContent = (lbl || 'Target') + ': ' + state.streak + '/' + t + ' days';
    }
    
    const fill = document.getElementById('sp-progress-fill');
    const plbl = document.getElementById('sp-progress-label');
    if (fill) fill.style.width = pct + '%';
    if (plbl) plbl.textContent = pct + '% complete · ' + left + ' days left';
    if (pw) pw.style.display = '';
  } else {
    if (sub) sub.style.display = 'none';
    if (pw) pw.style.display = 'none';
  }
  
  // Highlight active plan button
  [7, 21, 60, 0].forEach(n => {
    const el = document.getElementById('sp-' + n);
    if (el) {
      el.className = 'sp-plan-btn' + (state.streakTarget === n && (n !== 0 || !state.streakTargetLabel || !state.streakTarget) ? ' sp-active' : '');
    }
  });
}

export function renderDayTypeBtns() {
  ['full', 'exhausted', 'gap', 'interview', 'rest'].forEach(t => {
    const b = document.getElementById('btn-' + t);
    if (b) b.className = 'day-type-btn' + (t === state.dayType ? ' active-' + t : '');
  });
}

export function renderBanner() {
  const b = BANNERS[state.dayType];
  const el = document.getElementById('mode-banner');
  if (el && b) {
    el.className = 'mode-banner ' + b.cls;
    el.textContent = b.icon + ' ' + b.text;
  }
}

export function renderFocus() {
  const f = FOCUS_MAP[state.dayType];
  const nameEl = document.getElementById('focus-name');
  const subEl = document.getElementById('focus-sub');
  if (nameEl && f) nameEl.textContent = f.name;
  if (subEl && f) subEl.textContent = f.sub;
}

export function renderStats() {
  const avgEl = document.getElementById('skills-avg');
  const nnEl = document.getElementById('nn-complete');
  const actEl = document.getElementById('active-skills-count');
  
  if (avgEl) avgEl.textContent = getOverallProgress() + '%';
  if (nnEl) nnEl.textContent = getChecksCount() + '/' + state.nonNeg.length;
  if (actEl) actEl.textContent = getActiveSkillsCount();
}

export function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  
  const contentEl = document.getElementById('tab-' + name);
  const btnEl = document.getElementById('tab-btn-' + name);
  
  if (contentEl) contentEl.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
  
  // Specific tab render updates
  if (name === 'weekly') {
    renderWeekly();
  } else if (name === 'skills') {
    renderSkills();
  } else if (name === 'jobs') {
    renderJobs();
  } else if (name === 'notes') {
    renderNotes();
  } else if (name === 'hunt') {
    renderHunt();
  }
}

// ── EVENT BINDINGS FOR INLINE HANDLERS ──────
window.showTab = showTab;
window.toggleDark = () => {
  toggleTheme('soma_dark', 'dark-toggle');
};
window.startMic = (targetId) => {
  toggleVoiceInput(targetId, 'mic-btn-' + targetId);
};

// Day Type selection
window.selectDayType = (type) => {
  state.dayType = type;
  save();
  renderDayTypeBtns();
  renderBanner();
  renderFocus();
  renderSchedule();
};

// Streak Panel
window.toggleStreakPanel = () => {
  const p = document.getElementById('streak-panel');
  if (p) {
    p.classList.toggle('open');
    if (p.classList.contains('open')) {
      const valInput = document.getElementById('sp-streak-val');
      if (valInput) valInput.value = state.streak;
    }
  }
};
window.setStreakPlan = (days, label) => {
  state.streakTarget = days;
  state.streakTargetLabel = label;
  save();
  renderHeader();
};
window.setCustomStreakPlan = () => {
  const dInput = document.getElementById('sp-custom-days');
  const nameInput = document.getElementById('sp-custom-name');
  const d = parseInt(dInput ? dInput.value : '0') || 0;
  const lbl = nameInput ? nameInput.value.trim() : 'Custom Plan';
  if (d < 1) {
    alert('Enter valid number of days');
    return;
  }
  state.streakTarget = d;
  state.streakTargetLabel = lbl;
  save();
  renderHeader();
  if (dInput) dInput.value = '';
  if (nameInput) nameInput.value = '';
};
window.saveStreakEdit = () => {
  const valInput = document.getElementById('sp-streak-val');
  const val = parseInt(valInput ? valInput.value : '0');
  if (isNaN(val) || val < 0) {
    alert('Enter valid streak number (0 or more)');
    return;
  }
  state.streak = val;
  state.lastDate = todayStr;
  save();
  renderHeader();
  renderWeeklyReview();
};
window.resetStreakToZero = () => {
  if (!confirm('Reset streak to 0? This cannot be undone.')) return;
  state.streak = 0;
  state.lastDate = todayStr;
  save();
  renderHeader();
  const valInput = document.getElementById('sp-streak-val');
  if (valInput) valInput.value = 0;
  renderWeeklyReview();
};

// Rename app
window.startNameEdit = () => {
  const el = document.getElementById('app-title');
  if (!el) return;
  const cur = el.textContent;
  el.innerHTML = `<input id="name-edit-input" value="${cur.replace(/"/g, '&quot;')}"
    style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.4);border-radius:6px;padding:3px 8px;font-size:17px;font-weight:800;color:white;font-family:inherit;width:220px;letter-spacing:-.5px"
    onblur="saveNameEdit(this.value)" onkeydown="if(event.key==='Enter')this.blur()" />`;
  const inp = document.getElementById('name-edit-input');
  if (inp) {
    inp.focus();
    inp.select();
  }
};
window.saveNameEdit = (val) => {
  const name = val.trim() || '⚡ My Daily OS';
  localStorage.setItem('soma_app_name', name);
  const el = document.getElementById('app-title');
  if (el) el.textContent = name;
  document.title = name;
};

// ── ON PAGE LOAD ────────────────────────────
function init() {
  initTheme('soma_dark', 'dark-toggle');
  updateStreak();
  initAppName();
  renderHeader();
  renderDayTypeBtns();
  renderBanner();
  renderFocus();
  renderNonNeg();
  renderPendings();
  renderQuickWins();
  renderSchedule();
  renderStats();
  renderLog();
  renderMood();
  renderNotes();
  renderNoteTypeRow();
  renderNoteFilters();
  initMusic();
  checkRecruiterFollowups();
  renderRecruiterSection();
  renderParkIdeas();
  initDayContext();
  renderStarBank();
  renderHunt();
  
  // Initialize timer checks
  checkReminders();
  setInterval(() => {
    updateStreak();
    renderHeader();
    checkReminders();
    updateTimerDisplays();
  }, 60000);
  
  setInterval(updateTimerDisplays, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

