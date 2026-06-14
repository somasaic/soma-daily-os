import { loadLearnPrepState, saveLearnPrepState } from '../common/storage.js';
import { initTheme, toggleTheme } from '../common/theme.js';
import { esc } from '../common/utils.js';

// Import submodule functions
import {
  renderSessions,
  toggleAddSession,
  addSession,
  toggleSess,
  showSessSkill,
  toggleAns,
  saveMyAnswer,
  delMyAnswer,
  addQAToSkill,
  editQAItem,
  toggleMicInput,
  initSkillPills
} from './sessions.js';

import {
  renderCompanies,
  toggleAddCompany,
  addCompany,
  toggleCo,
  showCoPrep,
  toggleCoAns,
  saveCoAnswer,
  delCoAnswer,
  addPrepQ,
  editCoPrepItem,
  deleteCo
} from './interview-prep.js';

import {
  renderQABank,
  filterQB,
  toggleQBans
} from './qabank.js';

import {
  renderPracticeSetup,
  startPractice,
  showPracAns,
  nextQ,
  togglePracMic
} from './practice.js';

// ── STATE & CONSTANTS ───────────────────────
export let state = loadLearnPrepState();

export function save() {
  saveLearnPrepState(state);
}

// ── TOAST HELPER ────────────────────────────
export function toast(msg, dur = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}

// ── TABS SWITCHING ──────────────────────────
export function showTab(name) {
  document.querySelectorAll('.tc').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  
  const contentEl = document.getElementById('tc-' + name);
  if (contentEl) contentEl.classList.add('active');
  
  const tabIndex = ['sessions', 'interview', 'qabank', 'practice', 'settings'].indexOf(name);
  const tabBtn = document.querySelectorAll('.tab')[tabIndex];
  if (tabBtn) tabBtn.classList.add('active');
  
  if (name === 'sessions') renderSessions();
  if (name === 'interview') renderCompanies();
  if (name === 'qabank') renderQABank();
  if (name === 'practice') renderPracticeSetup();
  if (name === 'settings') renderPostInterviews();
}

// ── POST REAL INTERVIEW QUESTIONS ───────────
export function savePostInterviewQ() {
  const co = document.getElementById('piq-co')?.value.trim() || '';
  const qs = document.getElementById('piq-qs')?.value.trim() || '';
  if (!co || !qs) {
    toast('Enter company name and questions');
    return;
  }
  state.postInterviews.unshift({
    id: 'pi_' + Date.now(),
    company: co,
    questions: qs,
    date: new Date().toISOString().split('T')[0]
  });
  save();
  
  const coInput = document.getElementById('piq-co');
  const qsInput = document.getElementById('piq-qs');
  if (coInput) coInput.value = '';
  if (qsInput) qsInput.value = '';
  
  renderPostInterviews();
  toast('✅ Interview questions saved!');
}

export function renderPostInterviews() {
  const el = document.getElementById('piq-list');
  if (!el) return;
  if (!state.postInterviews.length) {
    el.innerHTML = '<div class="empty">No interview questions logged yet.</div>';
    return;
  }
  el.innerHTML = state.postInterviews.map(pi => `<div class="card" style="margin-bottom:8px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
      <div>
        <div style="font-size:13px;font-weight:700">${esc(pi.company)}</div>
        <div style="font-size:10px;color:var(--sub)">${pi.date}</div>
      </div>
      <button class="btn-sm" onclick="deletePIQ('${pi.id}')" style="background:#fee2e2;color:var(--r)">🗑</button>
    </div>
    <div style="font-size:12px;color:#374151;white-space:pre-wrap;line-height:1.6;background:var(--light);border-radius:8px;padding:10px">${esc(pi.questions)}</div>
  </div>`).join('');
}

export function deletePIQ(id) {
  state.postInterviews = state.postInterviews.filter(p => p.id !== id);
  save();
  renderPostInterviews();
  toast('Logged questions deleted');
}

// ── BACKUP & DATA RESTORE ───────────────────
export function exportAll() {
  const data = {
    sessions: state.sessions,
    companies: state.companies,
    postInterviews: state.postInterviews,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'soma-learn-prep-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  toast('✅ Data exported!');
}

export function importAll(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (d.sessions) state.sessions = d.sessions;
      if (d.companies) state.companies = d.companies;
      if (d.postInterviews) state.postInterviews = d.postInterviews;
      save();
      toast('✅ Data imported! Refreshing…');
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      toast('❌ Invalid file');
    }
  };
  reader.readAsText(file);
}

export function clearAll() {
  if (!confirm('Delete ALL data? This cannot be undone.')) return;
  state.sessions = [];
  state.companies = [];
  state.postInterviews = [];
  save();
  renderSessions();
  renderCompanies();
  renderPostInterviews();
  toast('All data cleared');
}

// ── WINDOW EVENT BINDINGS FOR BACKWARD COMPATIBILITY ──
window.showTab = showTab;
window.toggleDark = () => toggleTheme('slp_dark', 'dark-btn');

// Sessions window bindings
window.toggleAddSession = toggleAddSession;
window.addSession = addSession;
window.toggleSess = toggleSess;
window.showSessSkill = showSessSkill;
window.toggleAns = toggleAns;
window.saveMyAnswer = saveMyAnswer;
window.delMyAnswer = delMyAnswer;
window.addQAToSkill = addQAToSkill;
window.editQAItem = editQAItem;
window.toggleMic = toggleMicInput; // alias for original inline html calls

// Interview prep window bindings
window.toggleAddCompany = toggleAddCompany;
window.addCompany = addCompany;
window.toggleCo = toggleCo;
window.showCoPrep = showCoPrep;
window.toggleCoAns = toggleCoAns;
window.saveCoAnswer = saveCoAnswer;
window.delCoAnswer = delCoAnswer;
window.addPrepQ = addPrepQ;
window.editCoPrepItem = editCoPrepItem;
window.deleteCo = deleteCo;

// Q&A Bank window bindings
window.filterQB = filterQB;
window.toggleQBans = toggleQBans;

// Practice window bindings
window.startPractice = startPractice;
window.showPracAns = showPracAns;
window.nextQ = nextQ;
window.togglePracMic = togglePracMic;

// Settings & Backup window bindings
window.exportAll = exportAll;
window.importAll = importAll;
window.savePostInterviewQ = savePostInterviewQ;
window.deletePIQ = deletePIQ;
window.clearAll = clearAll;

// ── ON PAGE LOAD ────────────────────────────
function init() {
  initTheme('slp_dark', 'dark-btn');
  initSkillPills();
  renderSessions();
  renderPostInterviews();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
