import { todayStr } from './dashboard.js';
import { uid, esc, hdiff } from '../common/utils.js';
import { 
  HUNT_SEED, 
  HUNT_DAY_CFG, 
  HUNT_STATUS_MAP, 
  HUNT_GROUPS 
} from './constants.js';

const HUNT_KEY = 'soma_hunt_pipeline';
let huntGC = { stale: true, closed: true };
let activeHF = 'all';
let huntEditId = null;

// ── STORAGE HELPERS ─────────────────────────
export function loadHunt() {
  try {
    return JSON.parse(localStorage.getItem(HUNT_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function saveHunt(d) {
  localStorage.setItem(HUNT_KEY, JSON.stringify(d));
}

export function huntAutoSeed() {
  const existing = loadHunt();
  if (existing.length === 0) {
    saveHunt(HUNT_SEED.map(e => Object.assign({}, e)));
  } else {
    const ids = new Set(existing.map(e => e.id));
    let added = 0;
    HUNT_SEED.forEach(s => {
      if (!ids.has(s.id)) {
        existing.push(Object.assign({}, s));
        added++;
      }
    });
    if (added > 0) saveHunt(existing);
  }
}

// ── HUNT BUSINESS LOGIC ─────────────────────
function hFuB(d) {
  const n = hdiff(d);
  if (n === null) return '';
  if (n > 0) return `<span class="hunt-fu-badge hunt-fu-ov">Overdue ${n}d</span>`;
  if (n === 0) return '<span class="hunt-fu-badge hunt-fu-td">Due Today</span>';
  return `<span class="hunt-fu-badge hunt-fu-up">in ${-n}d</span>`;
}

function hNFU(i) {
  if (['rejected', 'closed', 'stale'].includes(i.status)) return false;
  if (!i.contact || i.contact === '') return false;
  if (!i.followupDate) return false;
  return hdiff(i.followupDate) >= 0;
}

function hMsg(i) {
  const n = (i.contact || 'there').split(' ')[0];
  if (i.status === 'interview') {
    return `Hi ${n}, I wanted to follow up on my interview for the ${i.role} position at ${i.company}. Could you please share an update on next steps? I remain very interested. Thank you!`;
  }
  if (i.status === 'close') {
    return `Hi ${n}, I wanted to reach out one final time regarding my application for ${i.role} at ${i.company}. If you have moved forward with others I completely understand — but if there is still a fit, I would love to connect. Thank you!`;
  }
  if (i.status === 'screening') {
    return `Hi ${n}, I am following up on the ${i.role} screening at ${i.company} — wanted to check if there is any update. Thank you!`;
  }
  return `Hi ${n}, I applied for the ${i.role} position at ${i.company} and wanted to check if you have had a chance to review my profile. Happy to connect for a quick call. Thanks!`;
}

// ── RENDERING ───────────────────────────────
export function renderHuntDayBanner() {
  const el = document.getElementById('hunt-day-banner');
  if (!el) return;
  const c = HUNT_DAY_CFG[new Date().getDay()];
  if (c) {
    el.className = 'hunt-day-banner ' + c.cls;
    el.innerHTML = `<span style="font-size:16px">${c.icon}</span>
      <div><strong>${c.mode}</strong><br><span style="font-weight:500;font-size:11px">${c.desc}</span></div>`;
  }
}

export function renderHuntFU() {
  const apps = loadHunt();
  const due = apps.filter(hNFU).sort((a, b) => (hdiff(b.followupDate) || 0) - (hdiff(a.followupDate) || 0));
  const el = document.getElementById('hunt-fu-list');
  const cnt = document.getElementById('hunt-fu-count');
  
  if (cnt) {
    if (due.length) {
      cnt.textContent = due.length + ' due';
      cnt.style.display = '';
    } else {
      cnt.style.display = 'none';
    }
  }
  if (!el) return;
  if (!due.length) {
    el.innerHTML = '<div class="empty-msg">No follow-ups due — all clear 🎉</div>';
    return;
  }
  
  el.innerHTML = due.map((item, idx) => {
    const diff = hdiff(item.followupDate);
    const urg = diff > 3 ? 'hunt-fu-urg' : diff > 0 ? 'hunt-fu-hot' : 'hunt-fu-ok';
    const oL = diff > 0 
      ? `<span style="color:#dc2626;font-weight:700">Overdue ${diff}d</span>` 
      : '<span style="color:#d97706;font-weight:700">Due Today</span>';
    const msg = hMsg(item);
    const enc = encodeURIComponent(msg);
    return `
    <div class="hunt-fu-item ${urg}">
      <div style="font-size:12px;font-weight:700;color:#1a1d2e">${esc(item.company)} — ${esc(item.role)}</div>
      <div style="font-size:10px;color:#9ca3af;margin:2px 0 4px">Contact: <b>${esc(item.contact)}</b>${item.channel ? ' via ' + esc(item.channel) : ''} &nbsp;·&nbsp; ${oL}</div>
      <button class="hunt-copy-btn" id="hcb${idx}" onclick="hCp(${idx},'${enc}')">${esc(msg)}</button>
    </div>`;
  }).join('');
}

export function renderHuntPipeline() {
  const apps = loadHunt();
  const sEl = document.getElementById('hunt-pipeline-stats');
  if (sEl) {
    sEl.textContent = apps.length + ' total · ' + apps.filter(a => !['rejected', 'closed'].includes(a.status)).length + ' active';
  }
  
  const fEl = document.getElementById('hunt-filter-row');
  if (fEl) {
    const fltrs = [
      { k: 'all', l: 'All' },
      { k: 'hot', l: '🔥 Hot' },
      { k: 'applied', l: 'Applied' },
      { k: 'screening', l: 'Screening' },
      { k: 'interview', l: 'Interview' },
      { k: 'rejected', l: 'Rejected' },
      { k: 'stale', l: 'Stale' }
    ];
    fEl.innerHTML = fltrs.map(f => 
      `<button class="jp-btn${activeHF === f.k ? ' jp-active' : ''}" onclick="changeHuntFilter('${f.k}')">${f.l}</button>`
    ).join('');
  }
  
  const lEl = document.getElementById('hunt-pipeline-list');
  if (!lEl) return;
  
  let fil = apps;
  if (activeHF !== 'all') {
    if (activeHF === 'hot') {
      fil = apps.filter(a => ['interview', 'consideration', 'close', 'screening'].includes(a.status));
    } else {
      fil = apps.filter(a => a.status === activeHF);
    }
  }
  
  if (!fil.length) {
    lEl.innerHTML = '<div class="empty-msg">No applications yet. Log your first one above!</div>';
    return;
  }
  
  const grp = {};
  HUNT_GROUPS.forEach(g => {
    grp[g.key] = [];
  });
  
  fil.forEach(app => {
    let gk = 'applied';
    for (let i = 0; i < HUNT_GROUPS.length; i++) {
      if (HUNT_GROUPS[i].statuses.includes(app.status)) {
        gk = HUNT_GROUPS[i].key;
        break;
      }
    }
    if (!grp[gk]) grp[gk] = [];
    grp[gk].push(app);
  });
  
  let h = '';
  HUNT_GROUPS.forEach(g => {
    const items = grp[g.key];
    if (!items || !items.length) return;
    const collapsed = !!huntGC[g.key];
    
    h += `<div class="hunt-grp-hdr ${g.cls}" onclick="toggleHuntGroup('${g.key}')">
      ${g.label} (${items.length})
      <span style="float:right;font-size:11px;opacity:.6">${collapsed ? 'expand' : 'collapse'}</span>
    </div>`;
    
    if (!collapsed) {
      items.forEach(app => {
        if (huntEditId === app.id) {
          // INLINE EDIT FORM
          h += `
          <div class="hunt-app-row" id="hedit-${app.id}" style="background:var(--light);border-left:3px solid var(--p)">
            <div style="font-size:11px;font-weight:700;color:var(--p);margin-bottom:8px">✏️ Editing: ${esc(app.company)}</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px">
              <input class="sched-input" id="he-co" value="${esc(app.company)}" placeholder="Company" style="flex:1;min-width:100px"/>
              <input class="sched-input" id="he-ro" value="${esc(app.role)}" placeholder="Role" style="flex:1;min-width:100px"/>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px">
              <input class="sched-input" id="he-lo" value="${esc(app.location)}" placeholder="Location" style="flex:1;min-width:100px"/>
              <input class="sched-input" id="he-ad" type="date" value="${app.appliedDate}" style="flex:1"/>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px">
              <select class="sched-input" id="he-st" style="flex:1">
                ${['applied', 'screening', 'interview', 'consideration', 'close', 'stale', 'rejected', 'closed'].map(s => 
                  `<option value="${s}" ${app.status === s ? 'selected' : ''}>${s}</option>`
                ).join('')}
              </select>
              <input class="sched-input" id="he-fd" type="date" value="${app.followupDate || ''}" style="flex:1"/>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px">
              <input class="sched-input" id="he-ct" value="${esc(app.contact)}" placeholder="Contact" style="flex:1;min-width:100px"/>
              <input class="sched-input" id="he-ch" value="${esc(app.channel)}" placeholder="Channel" style="flex:1;min-width:100px"/>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px">
              <input class="sched-input" id="he-src" value="${esc(app.source)}" placeholder="Source" style="flex:1;min-width:100px"/>
              <input class="sched-input" id="he-mt" type="number" value="${app.match || ''}" placeholder="Match %" style="width:80px;flex:none"/>
            </div>
            <textarea class="sched-input" id="he-nt" style="width:100%;min-height:45px;resize:vertical;margin-bottom:6px">${esc(app.notes || '')}</textarea>
            <div style="display:flex;gap:5px">
              <button class="btn-sm" onclick="saveHuntEdit('${app.id}')">💾 Save</button>
              <button class="btn-sm-ghost" onclick="cancelHuntEdit()">Cancel</button>
              <button class="btn-danger" onclick="delHA('${app.id}')">🗑 Remove</button>
            </div>
          </div>`;
        } else {
          // NORMAL ROW
          const sm = HUNT_STATUS_MAP[app.status] || HUNT_STATUS_MAP.applied;
          const fb = app.followupDate ? hFuB(app.followupDate) : '';
          h += `
          <div class="hunt-app-row">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:6px">
              <div style="flex:1">
                <div class="hunt-app-co">${esc(app.company)}</div>
                <div class="hunt-app-role">${esc(app.role)}${app.location ? ' · ' + esc(app.location) : ''}</div>
                <div style="margin-top:4px;display:flex;gap:5px;flex-wrap:wrap;align-items:center">
                  <span class="hunt-stage-chip ${sm.cls}">${sm.label}</span>
                  ${app.source ? `<span style="font-size:9px;color:#8892b0">${esc(app.source)}</span>` : ''}
                  ${app.match ? `<span style="font-size:9px;font-weight:700;color:#d97706">${app.match}%</span>` : ''}
                  ${fb}
                  <span style="font-size:9px;color:#aab0cc">${app.appliedDate || ''}</span>
                </div>
                ${app.contact ? `<div style="font-size:10px;color:#8892b0;margin-top:2px">👤 ${esc(app.contact)}${app.channel ? ' · ' + esc(app.channel) : ''}</div>` : ''}
                ${app.notes ? `<div style="font-size:11px;color:#5a6080;margin-top:3px;line-height:1.4">${esc(app.notes)}</div>` : ''}
              </div>
              <button class="icon-btn" onclick="startHuntEdit('${app.id}')" title="Edit" style="opacity:.5">✏️</button>
            </div>
          </div>`;
        }
      });
    }
  });
  lEl.innerHTML = h || '<div class="empty-msg">No matches.</div>';
}

export function renderHunt() {
  renderHuntDayBanner();
  renderHuntFU();
  renderHuntPipeline();
}

export function saveHuntEdit(id) {
  const apps = loadHunt();
  const idx = apps.findIndex(a => a.id === id);
  if (idx < 0) return;
  
  apps[idx] = Object.assign(apps[idx], {
    company:      document.getElementById('he-co').value.trim(),
    role:         document.getElementById('he-ro').value.trim(),
    location:     document.getElementById('he-lo').value.trim(),
    appliedDate:  document.getElementById('he-ad').value,
    status:       document.getElementById('he-st').value,
    followupDate: document.getElementById('he-fd').value,
    contact:      document.getElementById('he-ct').value.trim(),
    channel:      document.getElementById('he-ch').value.trim(),
    source:       document.getElementById('he-src').value.trim(),
    match:        document.getElementById('he-mt').value,
    notes:        document.getElementById('he-nt').value.trim(),
  });
  
  saveHunt(apps);
  huntEditId = null;
  renderHuntFU();
  renderHuntPipeline();
}

export function addHuntApp() {
  const coEl = document.getElementById('hunt-company');
  const roEl = document.getElementById('hunt-role');
  const co = coEl ? coEl.value.trim() : '';
  const ro = roEl ? roEl.value.trim() : '';
  
  if (!co || !ro) {
    alert('Company and Role required');
    return;
  }
  
  const apps = loadHunt();
  const td = todayStr;
  
  apps.unshift({
    id: 'h' + Date.now(),
    company: co,
    role: ro,
    location:     document.getElementById('hunt-location').value.trim(),
    appliedDate:  document.getElementById('hunt-applied-date').value || td,
    status:       document.getElementById('hunt-status-sel').value || 'applied',
    followupDate: document.getElementById('hunt-followup-date').value || '',
    contact:      document.getElementById('hunt-contact').value.trim(),
    channel:      document.getElementById('hunt-channel').value.trim(),
    source:       document.getElementById('hunt-source').value.trim(),
    match:        document.getElementById('hunt-match').value || '',
    notes:        document.getElementById('hunt-notes-inp').value.trim()
  });
  
  saveHunt(apps);
  
  ['hunt-company', 'hunt-role', 'hunt-location', 'hunt-contact', 'hunt-channel', 'hunt-source', 'hunt-notes-inp', 'hunt-match', 'hunt-applied-date', 'hunt-followup-date'].forEach(id => {
    const e = document.getElementById(id);
    if (e) e.value = '';
  });
  
  renderHunt();
}

export function delHA(id) {
  if (!confirm('Remove this application?')) return;
  saveHunt(loadHunt().filter(a => a.id !== id));
  huntEditId = null;
  renderHunt();
}

// ── BIND WINDOW INTERFACES ──────────────────
window.renderHunt = renderHunt;
window.saveHuntEdit = saveHuntEdit;
window.addHuntApp = addHuntApp;
window.delHA = delHA;

window.changeHuntFilter = (filter) => {
  activeHF = filter;
  renderHuntPipeline();
};
window.toggleHuntGroup = (key) => {
  huntGC[key] = !huntGC[key];
  renderHuntPipeline();
};
window.startHuntEdit = (id) => {
  huntEditId = id;
  renderHuntPipeline();
};
window.cancelHuntEdit = () => {
  huntEditId = null;
  renderHuntPipeline();
};
window.hCp = (idx, enc) => {
  const msg = decodeURIComponent(enc);
  const btn = document.getElementById('hcb' + idx);
  navigator.clipboard.writeText(msg).catch(() => {
    const t = document.createElement('textarea');
    t.value = msg;
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
  });
  if (btn) {
    const o = btn.innerHTML;
    btn.textContent = 'Copied ✓';
    btn.style.background = '#d1fae5';
    setTimeout(() => {
      btn.innerHTML = o;
      btn.style.background = '';
    }, 2200);
  }
};
