import { state, todayStr, save, renderStats } from './dashboard.js';
import { 
  DEFAULT_SCHEDULES, 
  DEFAULT_DAY_SCHEDULES, 
  BANNERS, 
  SCHED_TITLES 
} from './constants.js';
import { 
  parseTimeToMinutes, 
  formatICSDate, 
  fmtSlotTime, 
  uid 
} from '../common/utils.js';
import { playAlarm } from '../common/alarm.js';

// ── STATE ───────────────────────────────────
function getTodayDayName() {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
}

export let activeDayTab = getTodayDayName();
let scheduleEditMode = false;
window._slotTimers = {}; // global timer registry

// ── GETTERS ─────────────────────────────────
export function getSchedule() {
  if (activeDayTab) {
    return state.customDaySchedule[activeDayTab] || DEFAULT_DAY_SCHEDULES[activeDayTab];
  }
  return state.customSchedule[state.dayType] || DEFAULT_SCHEDULES[state.dayType];
}

function getTypeColor(type) {
  const map = {
    ritual: '#a78bfa', work: '#ef4444', break: '#94a3b8', habit: '#f59e0b',
    health: '#22c55e', review: '#3b82f6', plan: '#8b5cf6', wind: '#cbd5e1',
    sleep: '#1e293b', interrupt: '#ec4899', relaxation: '#06b6d4', screening: '#f97316'
  };
  return map[type] || '#94a3b8';
}

function getTodayReminders() {
  return JSON.parse(localStorage.getItem('soma_reminders_' + todayStr) || '[]');
}

function saveTodayReminders(arr) {
  localStorage.setItem('soma_reminders_' + todayStr, JSON.stringify(arr));
}

// ── RENDERING ───────────────────────────────
export function renderSchedule() {
  const items = getSchedule();
  const titleEl = document.getElementById('schedule-title');
  const listEl = document.getElementById('schedule-list');
  const editBtn = document.getElementById('sched-edit-btn');
  const resetBtn = document.getElementById('sched-reset-btn');
  const addRow = document.getElementById('add-sched-row');
  const quickAddBtn = document.getElementById('quick-add-slot-btn');
  
  if (titleEl) {
    titleEl.textContent = activeDayTab 
      ? `📅 ${activeDayTab.toUpperCase()} SCHEDULE` 
      : SCHED_TITLES[state.dayType];
  }
  
  if (editBtn) editBtn.textContent = scheduleEditMode ? '✅ Done' : '✏️ Edit';
  if (resetBtn) resetBtn.style.display = scheduleEditMode ? '' : 'none';
  if (addRow) addRow.style.display = scheduleEditMode ? 'block' : 'none';
  if (quickAddBtn) quickAddBtn.style.display = scheduleEditMode ? 'flex' : 'none';
  
  renderScheduleDayTabs();
  
  const reminders = getTodayReminders();
  const todayChecks = state.schedDone[todayStr] || {};
  
  if (listEl) {
    listEl.innerHTML = items.map((item, i) => {
      const col = getTypeColor(item.type);
      const isDone = todayChecks[i] || false;
      const bellOn = reminders.some(r => r.idx === i);
      const timerHtml = !scheduleEditMode ? _slotTimerHTML(i) : '';
      
      if (scheduleEditMode) {
        return `
        <div class="sched-edit-row">
          <input class="sched-input sched-time-input" value="${item.time}" onchange="updateScheduleItem(${i}, 'time', this.value)" />
          <select class="sched-input sched-type-select" onchange="updateScheduleItem(${i}, 'type', this.value)">
            ${['work', 'ritual', 'break', 'habit', 'health', 'review', 'plan', 'wind', 'sleep', 'interrupt', 'relaxation', 'screening'].map(t => `
              <option value="${t}" ${item.type === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>
            `).join('')}
          </select>
          <input class="sched-input sched-label-input" value="${item.label.replace(/"/g, '&quot;')}" onchange="updateScheduleItem(${i}, 'label', this.value)" />
          <button class="btn-danger" onclick="deleteScheduleItem(${i})">🗑</button>
        </div>`;
      }
      
      return `
      <div class="schedule-item ${isDone ? 'sched-item-done' : ''}">
        <button class="sched-done-cb ${isDone ? 'is-done' : ''}" onclick="toggleSchedDone(${i})">${isDone ? '✓' : '☐'}</button>
        <div class="schedule-time" onclick="quickEditItem(${i})" title="Quick edit time">${item.time}</div>
        <div class="schedule-dot" style="background:${col}"></div>
        <div style="flex:1">
          <div class="schedule-label" onclick="quickEditItem(${i})" title="Quick edit text">${item.label}</div>
          ${timerHtml}
        </div>
        <div class="schedule-actions">
          <button class="sched-bell ${bellOn ? 'bell-on' : ''}" onclick="toggleReminder(${i}, '${item.time}', '${item.label.replace(/'/g, "\\'")}')" title="Set Bell Reminder">🔔</button>
        </div>
      </div>`;
    }).join('');
  }
}

function renderScheduleDayTabs() {
  const container = document.getElementById('schedule-day-tabs');
  if (!container) return;
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayName = getTodayDayName();
  
  container.className = 'day-tab-row';
  container.innerHTML = `
    <button class="day-tab-btn ${!activeDayTab ? 'dtab-active' : ''}" onclick="clearDayTab()">⚡ Mode Template</button>
    ${days.map(d => {
      const isSelected = activeDayTab === d;
      const isToday = d === todayName;
      let cls = 'day-tab-btn';
      if (isSelected) cls += ' dtab-active';
      if (isToday) cls += ' dtab-today';
      return `<button class="${cls}" onclick="selectDayTab('${d}')">${d}</button>`;
    }).join('')}
  `;
}

// ── CRUD OPERATIONS ─────────────────────────
function ensureCustomSchedule() {
  if (activeDayTab) {
    if (!state.customDaySchedule[activeDayTab]) {
      state.customDaySchedule[activeDayTab] = JSON.parse(JSON.stringify(DEFAULT_DAY_SCHEDULES[activeDayTab]));
    }
  } else {
    if (!state.customSchedule[state.dayType]) {
      state.customSchedule[state.dayType] = JSON.parse(JSON.stringify(DEFAULT_SCHEDULES[state.dayType]));
    }
  }
}

export function updateScheduleItem(i, field, val) {
  ensureCustomSchedule();
  if (activeDayTab) state.customDaySchedule[activeDayTab][i][field] = val;
  else state.customSchedule[state.dayType][i][field] = val;
  save();
}

export function deleteScheduleItem(i) {
  ensureCustomSchedule();
  if (activeDayTab) state.customDaySchedule[activeDayTab].splice(i, 1);
  else state.customSchedule[state.dayType].splice(i, 1);
  save();
  renderSchedule();
}

// ── SLOT TIMERS ─────────────────────────────
function _slotKey(i) {
  return (activeDayTab || state.dayType) + '_' + i;
}

export function getSlotDuration(i) {
  const saved = localStorage.getItem('soma_slot_dur_' + _slotKey(i));
  if (saved) return parseInt(saved);
  
  const items = getSchedule();
  if (items[i] && items[i + 1]) {
    const a = parseTimeToMinutes(items[i].time);
    const b = parseTimeToMinutes(items[i + 1].time);
    if (a !== null && b !== null && b > a) {
      return Math.min(b - a, 180);
    }
  }
  return 30;
}

export function saveSlotDuration(i, mins) {
  localStorage.setItem('soma_slot_dur_' + _slotKey(i), mins);
}

function _slotTimerDone(i, label) {
  const key = _slotKey(i);
  if (window._slotTimers[key]) {
    clearInterval(window._slotTimers[key].intervalId);
    delete window._slotTimers[key];
  }
  playAlarm();
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('⏰ Time up! ' + label, {
      body: 'Slot timer finished. Move to next task.'
    });
  }
  renderSchedule();
}

export function startSlotTimer(i) {
  const key = _slotKey(i);
  if (window._slotTimers[key]) return;
  
  const durEl = document.getElementById('st-dur-' + i);
  const mins = durEl ? (parseInt(durEl.value) || getSlotDuration(i)) : getSlotDuration(i);
  saveSlotDuration(i, mins);
  
  const items = getSchedule();
  const label = items[i] ? items[i].label : 'Slot ' + i;
  let remaining = mins * 60;
  
  const intervalId = setInterval(() => {
    remaining--;
    if (window._slotTimers[key]) {
      window._slotTimers[key].remaining = remaining;
    }
    const dispEl = document.getElementById('st-disp-' + i);
    if (dispEl) {
      dispEl.textContent = fmtSlotTime(remaining);
      dispEl.className = 'slot-timer-display st-running';
    }
    if (remaining <= 0) {
      _slotTimerDone(i, label);
    }
  }, 1000);
  
  window._slotTimers[key] = { remaining, intervalId };
  renderSchedule();
}

export function stopSlotTimer(i) {
  const key = _slotKey(i);
  if (window._slotTimers[key]) {
    clearInterval(window._slotTimers[key].intervalId);
    delete window._slotTimers[key];
  }
  renderSchedule();
}

export function resetSlotTimer(i) {
  stopSlotTimer(i);
  renderSchedule();
}

export function updateSlotDuration(i) {
  const el = document.getElementById('st-dur-' + i);
  if (el) saveSlotDuration(i, parseInt(el.value) || 30);
}

function _slotTimerHTML(i) {
  const key = _slotKey(i);
  const running = window._slotTimers[key];
  const dur = getSlotDuration(i);
  const remaining = running ? running.remaining : dur * 60;
  const displayClass = running ? 'slot-timer-display st-running' : (remaining === 0 ? 'slot-timer-display st-done' : 'slot-timer-display');
  
  if (running) {
    return `
    <div class="slot-timer-row">
      <span class="${displayClass}" id="st-disp-${i}">${fmtSlotTime(remaining)}</span>
      <button class="slot-timer-btn st-stop" onclick="stopSlotTimer(${i})">⏹ Stop</button>
      <button class="slot-timer-btn st-reset" onclick="resetSlotTimer(${i})" title="Reset timer">↺ Reset</button>
    </div>`;
  } else {
    return `
    <div class="slot-timer-row">
      <span class="${displayClass}" id="st-disp-${i}">${fmtSlotTime(remaining)}</span>
      <input class="st-dur-input" id="st-dur-${i}" type="number" min="1" max="480" value="${dur}" title="Duration in minutes" onchange="updateSlotDuration(${i})" />
      <span class="st-dur-label">min</span>
      <button class="slot-timer-btn st-start" onclick="startSlotTimer(${i})">▶ Start</button>
      <button class="slot-timer-btn st-reset" onclick="resetSlotTimer(${i})" title="Reset to full">↺</button>
    </div>`;
  }
}

// ── REMINDERS ───────────────────────────────
export function requestNotifPermission() {
  if (!('Notification' in window)) return;
  Notification.requestPermission().then(() => renderNotifBanner());
}

export function toggleReminder(idx, time, label) {
  if (Notification.permission !== 'granted') {
    requestNotifPermission();
    return;
  }
  const reminders = getTodayReminders();
  const existing = reminders.findIndex(r => r.idx === idx);
  if (existing >= 0) {
    reminders.splice(existing, 1);
  } else {
    reminders.push({ idx, time, label, notified: false });
  }
  saveTodayReminders(reminders);
  renderSchedule();
}

export function checkReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const reminders = getTodayReminders();
  let changed = false;
  
  reminders.forEach(r => {
    if (r.notified) return;
    const rMins = parseTimeToMinutes(r.time);
    if (rMins === null) return;
    
    if (nowMins === rMins) {
      try {
        new Notification('⚡ Soma Daily OS', {
          body: r.time + ' — ' + r.label,
          tag: 'soma-' + r.idx
        });
      } catch (e) {}
      r.notified = true;
      changed = true;
    }
  });
  
  if (changed) saveTodayReminders(reminders);
}

export function updateTimerDisplays() {
  // Update browser page titles or slot displays dynamically if needed
}

export function renderNotifBanner() {
  const banner = document.getElementById('notif-banner');
  const text = document.getElementById('notif-banner-text');
  const btn = document.getElementById('notif-action-btn');
  if (!banner) return;
  
  if (!('Notification' in window)) {
    banner.style.display = 'none';
    return;
  }
  
  if (Notification.permission === 'granted') {
    banner.style.display = 'none';
    return;
  }
  
  banner.style.display = 'flex';
  if (Notification.permission === 'denied') {
    banner.className = 'notif-banner denied';
    if (text) text.textContent = 'Notifications blocked. Enable in browser settings → Site Settings.';
    if (btn) btn.style.display = 'none';
  } else {
    banner.className = 'notif-banner prompt';
    if (text) text.textContent = '🔔 Enable notifications to get schedule reminders anywhere';
    if (btn) {
      btn.style.display = '';
      btn.textContent = 'Enable';
    }
  }
}

// ── ICS EXPORT ──────────────────────────────
export function exportToICS() {
  const items = getSchedule();
  const today = new Date();
  const dateBase = today.toISOString().split('T')[0].replace(/-/g, '');
  
  const events = items.map((item, i) => {
    const startMins = parseTimeToMinutes(item.time);
    if (startMins === null) return null;
    const startH = Math.floor(startMins / 60), startM = startMins % 60;
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startH, startM, 0);
    
    let endMins = startMins + 60;
    for (let j = i + 1; j < items.length; j++) {
      const nm = parseTimeToMinutes(items[j].time);
      if (nm !== null && nm > startMins) {
        endMins = nm;
        break;
      }
    }
    
    const endH = Math.floor(endMins / 60) % 24, endM = endMins % 60;
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endH, endM, 0);
    const safeSummary = item.label.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
    
    return [
      'BEGIN:VEVENT',
      'UID:soma-' + dateBase + '-' + i + '@dailyos',
      'DTSTART:' + formatICSDate(start),
      'DTEND:' + formatICSDate(end),
      'SUMMARY:' + safeSummary,
      'CATEGORIES:' + (item.type || 'WORK').toUpperCase(),
      'END:VEVENT'
    ].join('\r\n');
  }).filter(Boolean);
  
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Soma Daily OS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Soma Daily OS — ' + today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');
  
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'soma-schedule-' + todayStr + '.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── PDF EXPORT ──────────────────────────────
export function exportToPDF() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const items = getSchedule();
  const pendings = state.pendings.filter(p => !p.done);
  const checks = state.checks[todayStr] || {};
  const dayType = state.dayType;
  const banner = BANNERS[dayType];
  
  const typeColor = {
    ritual: '#a78bfa', work: '#ef4444', break: '#94a3b8', habit: '#f59e0b',
    health: '#22c55e', review: '#3b82f6', plan: '#8b5cf6', wind: '#cbd5e1', sleep: '#1e293b',
    interrupt: '#ec4899', relaxation: '#06b6d4', screening: '#f97316'
  };
  
  const sectionStyle = 'background:#f8f9ff;border-radius:10px;margin-bottom:14px;overflow:hidden;border:1px solid #e8ebf5;';
  const titleStyle = 'background:#1a1d2e;color:white;padding:8px 14px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;';
  const tableStyle = 'width:100%;border-collapse:collapse;';
  
  const scheduleRows = items.map((item, i) => {
    const col = typeColor[item.type] || '#94a3b8';
    const bg = i % 2 === 0 ? 'white' : '#f0f2f8';
    return `
    <tr style="background:${bg}">
      <td style="padding:7px 10px;font-size:11px;font-weight:700;color:#8892b0;white-space:nowrap;width:80px">${item.time}</td>
      <td style="padding:7px 4px;width:14px"><div style="width:8px;height:8px;border-radius:50%;background:${col};margin-top:2px"></div></td>
      <td style="padding:7px 8px;font-size:13px;color:#1a1d2e;line-height:1.4">${item.label}</td>
      <td style="padding:7px 10px;width:26px;font-size:17px;color:#d0d4e8">☐</td>
    </tr>`;
  }).join('');
  
  const pendingRows = pendings.length
    ? pendings.map((p, i) => `
      <tr style="background:${i % 2 === 0 ? 'white' : '#f0f2f8'}">
        <td style="padding:7px 10px;font-size:17px;color:#f59e0b;width:26px">☐</td>
        <td style="padding:7px 10px;font-size:13px;color:#1a1d2e" colspan="3">
          ${p.text}
          ${p.date !== todayStr ? `<span style="font-size:10px;color:#f97316;margin-left:8px">↩ From ${p.date}</span>` : ''}
        </td>
      </tr>`).join('')
    : `<tr><td colspan="4" style="padding:10px 14px;font-size:12px;color:#8892b0;font-style:italic">No pending items — clean slate!</td></tr>`;
  
  const nnRows = [
    { id: 'github', label: 'Push to GitHub (even 1 commit)' },
    { id: 'linkedin', label: 'LinkedIn: 1 post OR 3 comments' },
    { id: 'plan', label: 'Plan tomorrow (5 min)' }
  ].map((n, i) => {
    const done = checks[n.id];
    return `
    <tr style="background:${i % 2 === 0 ? 'white' : '#f0f2f8'}">
      <td style="padding:7px 10px;font-size:17px;color:${done ? '#22c55e' : '#d0d4e8'};width:26px">${done ? '☑' : '☐'}</td>
      <td style="padding:7px 10px;font-size:13px;color:${done ? '#aab0cc' : '#1a1d2e'};${done ? 'text-decoration:line-through' : ''}" colspan="3">${n.label}</td>
    </tr>`;
  }).join('');
  
  const docHTML = `
    <div style="background:linear-gradient(135deg,#6c47ff,#4834d4);color:white;border-radius:12px;padding:16px 20px;margin-bottom:16px">
      <div style="font-size:18px;font-weight:800">⚡ Soma's Daily Schedule</div>
      <div style="font-size:12px;opacity:.8;margin-top:4px">${dateStr}</div>
      <div style="display:inline-block;padding:3px 12px;border-radius:12px;font-size:12px;font-weight:700;margin-top:8px;background:rgba(255,255,255,.2)">${banner.icon} ${dayType.charAt(0).toUpperCase() + dayType.slice(1)} Day</div>
    </div>
    <div style="${sectionStyle}">
      <div style="${titleStyle}">📅 Today's Schedule</div>
      <table style="${tableStyle}">${scheduleRows}</table>
    </div>
    <div style="${sectionStyle}">
      <div style="${titleStyle}">⏳ Pendings (${pendings.length} undone)</div>
      <table style="${tableStyle}">${pendingRows}</table>
    </div>
    <div style="${sectionStyle}">
      <div style="${titleStyle}">⚡ Non-Negotiables</div>
      <table style="${tableStyle}">${nnRows}</table>
    </div>
    <div style="text-align:center;font-size:11px;color:#8892b0;margin-top:14px">Soma's Daily OS · ${dateStr}</div>`;
  
  const docBody = document.getElementById('pdf-doc-body');
  const modal = document.getElementById('pdf-modal');
  if (docBody) docBody.innerHTML = docHTML;
  if (modal) {
    modal.classList.add('open');
    modal.scrollTop = 0;
  }
}

// ── FOCUS MUSIC ─────────────────────────────
export function renderMusicBtn() {
  const wrap = document.getElementById('music-open-wrap');
  const disp = document.getElementById('music-url-display');
  const url = localStorage.getItem('soma_music_url') || '';
  if (!wrap) return;
  if (url) {
    wrap.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="music-btn" style="display:flex;align-items:center;justify-content:center;gap:7px;text-decoration:none">▶ Open Focus Playlist</a>`;
    if (disp) disp.textContent = '🎵 ' + url.replace(/^https?:\/\//, '').slice(0, 55) + (url.length > 60 ? '…' : '');
  } else {
    wrap.innerHTML = `<button class="music-btn" onclick="toggleMusicEdit()">▶ Open Focus Playlist — tap ✏️ Set URL first</button>`;
    if (disp) disp.textContent = 'No playlist set — tap ✏️ Set URL to add Spotify/YouTube link';
  }
}

export function toggleMusicEdit() {
  const row = document.getElementById('music-edit-row');
  if (!row) return;
  const open = row.style.display === 'none' || !row.style.display;
  row.style.display = open ? 'flex' : 'none';
  if (open) {
    const inp = document.getElementById('music-url-input');
    const saved = localStorage.getItem('soma_music_url') || '';
    if (inp) {
      inp.value = saved;
      inp.focus();
    }
  }
}

export function initMusic() {
  const inp = document.getElementById('music-url-input');
  const saved = localStorage.getItem('soma_music_url') || '';
  if (inp) inp.value = saved;
  renderMusicBtn();
}

function saveMusicUrl() {
  const inp = document.getElementById('music-url-input');
  if (!inp) return;
  const url = inp.value.trim();
  localStorage.setItem('soma_music_url', url);
  toggleMusicEdit();
  renderMusicBtn();
}

export function toggleSchedDone(i) {
  if (!state.schedDone[todayStr]) state.schedDone[todayStr] = {};
  state.schedDone[todayStr][i] = !state.schedDone[todayStr][i];
  save();
  renderSchedule();
  renderWeeklyReview();
}

// ── BIND WINDOW INTERFACES ──────────────────
window.toggleScheduleEdit = () => {
  scheduleEditMode = !scheduleEditMode;
  renderSchedule();
};
window.resetSchedule = () => {
  const what = activeDayTab ? activeDayTab + ' template' : 'this mode schedule';
  if (!confirm('Reset ' + what + ' to default? Your edits will be removed.')) return;
  if (activeDayTab) delete state.customDaySchedule[activeDayTab];
  else delete state.customSchedule[state.dayType];
  save();
  scheduleEditMode = false;
  renderSchedule();
};
window.selectDayTab = (day) => {
  activeDayTab = day;
  scheduleEditMode = false;
  renderSchedule();
};
window.clearDayTab = () => {
  activeDayTab = null;
  scheduleEditMode = false;
  renderSchedule();
};
window.addScheduleItem = () => {
  const timeInp = document.getElementById('new-sched-time');
  const typeInp = document.getElementById('new-sched-type');
  const labelInp = document.getElementById('new-sched-label');
  const time = timeInp ? timeInp.value.trim() || '—' : '—';
  const type = typeInp ? typeInp.value : 'work';
  const label = labelInp ? labelInp.value.trim() : '';
  if (!label) return;
  ensureCustomSchedule();
  if (activeDayTab) state.customDaySchedule[activeDayTab].push({ time, type, label });
  else state.customSchedule[state.dayType].push({ time, type, label });
  save();
  if (timeInp) timeInp.value = '';
  if (labelInp) labelInp.value = '';
  renderSchedule();
};
window.deleteScheduleItem = deleteScheduleItem;
window.updateScheduleItem = updateScheduleItem;
window.quickEditItem = (i) => {
  scheduleEditMode = true;
  renderSchedule();
};
window.toggleQuickAddSlot = () => {
  const editMode = document.getElementById('add-sched-row');
  if (!editMode) return;
  const visible = editMode.style.display !== 'none';
  editMode.style.display = visible ? 'none' : 'block';
  if (!visible) {
    setTimeout(() => {
      editMode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }
};
window.startSlotTimer = startSlotTimer;
window.stopSlotTimer = stopSlotTimer;
window.resetSlotTimer = resetSlotTimer;
window.updateSlotDuration = updateSlotDuration;
window.toggleReminder = toggleReminder;
window.requestNotifPermission = requestNotifPermission;
window.toggleMusicEdit = toggleMusicEdit;
window.saveMusicUrl = saveMusicUrl;
window.exportToICS = exportToICS;
window.exportToPDF = exportToPDF;
window.toggleSchedDone = toggleSchedDone;
