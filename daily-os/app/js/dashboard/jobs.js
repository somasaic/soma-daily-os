import { state, todayStr, save } from './dashboard.js';
import { uid, esc } from '../common/utils.js';
import { toggleVoiceInput } from '../common/voice.js';
// PIPELINE_STAGES defined locally below

export let activeJobFilter = 'all';

// Add JOB_STAGES if not in constants
const PIPELINE_STAGES = [
  { id: 'all',       label: 'All' },
  { id: 'applied',   label: 'Applied',    cls: 'jc-applied'  },
  { id: 'screened',  label: 'Screened',   cls: 'jc-screened' },
  { id: 'round1',    label: 'Round 1',    cls: 'jc-round1'   },
  { id: 'round2',    label: 'Round 2',    cls: 'jc-round2'   },
  { id: 'offer',     label: 'Offer ✅',   cls: 'jc-offer'    },
  { id: 'rejected',  label: 'Rejected',   cls: 'jc-rejected' },
  { id: 'withdrawn', label: 'Withdrawn',  cls: 'jc-withdrawn' },
];

// ── JOB PIPELINE ACTIONS ────────────────────
export function addJob() {
  const companyEl = document.getElementById('job-company');
  const roleEl = document.getElementById('job-role');
  const statusEl = document.getElementById('job-status-sel');
  const sourceEl = document.getElementById('job-source');
  const notesEl = document.getElementById('job-notes-input');

  const company = companyEl ? companyEl.value.trim() : '';
  const role    = roleEl ? roleEl.value.trim() : '';
  const status  = statusEl ? statusEl.value : 'applied';
  const source  = sourceEl ? sourceEl.value.trim() : '';
  const notes   = notesEl ? notesEl.value.trim() : '';

  if (!company) {
    alert('Company name required');
    return;
  }

  state.jobs.push({ id: uid(), company, role, status, source, notes, date: todayStr });
  save();

  if (companyEl) companyEl.value = '';
  if (roleEl) roleEl.value = '';
  if (sourceEl) sourceEl.value = '';
  if (notesEl) notesEl.value = '';

  renderJobs();
}

export function deleteJob(id) {
  if (!confirm('Delete this application?')) return;
  state.jobs = state.jobs.filter(j => j.id !== id);
  save();
  renderJobs();
}

export function saveJobEdit(id) {
  const statusEl = document.getElementById('job-status-edit-' + id);
  const notesEl  = document.getElementById('job-notes-edit-' + id);
  const job = state.jobs.find(j => j.id === id);
  if (!job) return;

  if (statusEl) job.status = statusEl.value;
  if (notesEl)  job.notes  = notesEl.value.trim();
  save();

  window['_jobEdit_' + id] = false;
  renderJobs();
}

export function renderJobs() {
  const jobs = state.jobs || [];
  const filterEl = document.getElementById('job-stage-filters');
  const statsEl = document.getElementById('job-stats-mini');
  const listEl = document.getElementById('job-list');

  // Render pipeline buttons
  if (filterEl) {
    filterEl.innerHTML = PIPELINE_STAGES.map(s => {
      const cnt = s.id === 'all' ? jobs.length : jobs.filter(j => j.status === s.id).length;
      return `<button class="jp-btn${activeJobFilter === s.id ? ' jp-active' : ''}" onclick="changeJobFilter('${s.id}')">${s.label} (${cnt})</button>`;
    }).join('');
  }

  // Update mini stats
  if (statsEl) {
    const active = jobs.filter(j => !['rejected', 'withdrawn'].includes(j.status)).length;
    statsEl.textContent = `${active} active · ${jobs.length} total`;
  }

  if (!listEl) return;

  const filtered = activeJobFilter === 'all' ? jobs : jobs.filter(j => j.status === activeJobFilter);
  if (!filtered.length) {
    listEl.innerHTML = `<div class="empty-msg">${activeJobFilter === 'all' ? 'No applications yet. Track your first one above!' : 'No applications in this stage.'}</div>`;
    return;
  }

  const STAGE_MAP = Object.fromEntries(PIPELINE_STAGES.filter(s => s.id !== 'all').map(s => [s.id, s]));

  listEl.innerHTML = filtered.map(j => {
    const s = STAGE_MAP[j.status] || { label: j.status, cls: '' };
    const editing = window['_jobEdit_' + j.id];
    return `
    <div class="job-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="job-company">${esc(j.company)}</div>
          <div class="job-role-line">${esc(j.role || '—')} ${j.source ? '· ' + esc(j.source) : ''}</div>
        </div>
        <div style="display:flex;gap:4px">
          <button class="sched-btn" onclick="toggleJobEditInline('${j.id}')" title="Edit">✏️</button>
          <button class="sched-btn" onclick="deleteJob('${j.id}')" title="Delete">🗑</button>
        </div>
      </div>
      <div class="job-meta" style="margin-top:5px">
        <span class="jchip ${s.cls}">${s.label}</span>
        <span class="job-date-txt">${j.date || ''}</span>
      </div>
      ${editing ? `
      <div style="margin-top:8px;display:flex;flex-direction:column;gap:5px">
        <select class="sched-input" id="job-status-edit-${j.id}">
          ${PIPELINE_STAGES.filter(x => x.id !== 'all').map(x => `<option value="${x.id}" ${j.status === x.id ? 'selected' : ''}>${x.label}</option>`).join('')}
        </select>
        <div class="mic-wrap">
          <textarea class="sched-input" id="job-notes-edit-${j.id}" style="min-height:50px;resize:vertical">${esc(j.notes || '')}</textarea>
          <button class="mic-btn" id="mic-btn-job-notes-edit-${j.id}" onclick="mic_jobNotesEdit('${j.id}')" title="Voice input">🎙️</button>
        </div>
        <button class="btn-sm" onclick="saveJobEdit('${j.id}')">💾 Save</button>
      </div>` : j.notes ? `<div class="job-note-txt">${esc(j.notes)}</div>` : ''}
    </div>`;
  }).join('');
}

export function exportJobsCSV() {
  const jobs = state.jobs || [];
  if (!jobs.length) {
    alert('No job applications to export');
    return;
  }
  const header = 'Company,Role,Status,Source,Date,Notes';
  const rows = jobs.map(j =>
    [j.company, j.role, j.status, j.source || '', j.date || '', (j.notes || '').replace(/,/g, ' ')].map(v => `"${v}"`).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'soma-jobs-' + todayStr + '.csv';
  a.click();
}

// ── BIND WINDOW INTERFACES ──────────────────
window.addJob = addJob;
window.deleteJob = deleteJob;
window.saveJobEdit = saveJobEdit;
window.exportJobsCSV = exportJobsCSV;

window.changeJobFilter = (status) => {
  activeJobFilter = status;
  renderJobs();
};
window.toggleJobEditInline = (id) => {
  window['_jobEdit_' + id] = !window['_jobEdit_' + id];
  renderJobs();
};
window.mic_jobNotesInput = () => {
  toggleVoiceInput('job-notes-input', 'mic-btn-job-notes-input');
};
window.mic_jobNotesEdit = (id) => {
  toggleVoiceInput('job-notes-edit-' + id, 'mic-btn-job-notes-edit-' + id);
};
export { PIPELINE_STAGES };
