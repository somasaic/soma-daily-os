import { state, todayStr, save, renderStats } from './dashboard.js';
import { esc } from '../common/utils.js';
import { toggleVoiceInput } from '../common/voice.js';

const DC_KEY = 'soma_day_context';
let dcRating = '';
let editingLogIdx = null;

// ── STORAGE HELPERS FOR DAY CONTEXT ────────
function loadDC() {
  try {
    return JSON.parse(localStorage.getItem(DC_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveDC(d) {
  localStorage.setItem(DC_KEY, JSON.stringify(d));
}

// ── MOOD TRACKER ──────────────────────────
export function setMood(val) {
  state.moods[todayStr] = val;
  save();
  renderMood();
}

export function renderMood() {
  // Highlight selected
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById('mood-' + i);
    if (btn) {
      btn.classList.toggle('mood-sel', state.moods[todayStr] === i);
    }
  }
  
  // 7-day average trend
  const trend = document.getElementById('mood-trend');
  if (!trend) return;
  const last7 = [];
  for (let d = 6; d >= 0; d--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - d);
    const k = dt.toISOString().slice(0, 10);
    if (state.moods[k]) last7.push(state.moods[k]);
  }
  
  if (last7.length) {
    const avg = (last7.reduce((a, b) => a + b, 0) / last7.length).toFixed(1);
    const emoji = avg >= 4.5 ? '😄' : avg >= 3.5 ? '🙂' : avg >= 2.5 ? '😐' : avg >= 1.5 ? '😕' : '😞';
    trend.textContent = `7-day avg ${emoji} ${avg}`;
  } else {
    trend.textContent = '';
  }
}

// Note: Log diary logic has been modularized and moved to log.js


// ── DAY CONTEXT ─────────────────────────────
export function setDCRating(btn) {
  dcRating = btn.getAttribute('data-r');
  document.querySelectorAll('.dc-rating-btn').forEach(b => {
    b.classList.remove('dc-sel');
  });
  btn.classList.add('dc-sel');
}

export function initDayContext() {
  const td = todayStr;
  const lbl = document.getElementById('dc-today-label');
  if (lbl) {
    lbl.textContent = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  }
  
  // Load today's existing entry if any
  const data = loadDC();
  if (data[td]) {
    const entry = data[td];
    const ta = document.getElementById('dc-text');
    if (ta) ta.value = entry.text || '';
    if (entry.rating) {
      dcRating = entry.rating;
      document.querySelectorAll('.dc-rating-btn').forEach(b => {
        if (b.getAttribute('data-r') === entry.rating) b.classList.add('dc-sel');
      });
    }
  }
  renderDCHistory();
}

export function saveDayContext() {
  const td = todayStr;
  const textEl = document.getElementById('dc-text');
  let text = textEl ? textEl.value : '';
  if (text) text = text.trim();
  
  if (!text && !dcRating) {
    alert('Add some context first — how did today go?');
    return;
  }
  
  const data = loadDC();
  data[td] = {
    date: td,
    rating: dcRating,
    text: text,
    updatedAt: new Date().toISOString()
  };
  saveDC(data);
  
  const st = document.getElementById('dc-saved-status');
  if (st) {
    st.style.display = '';
    setTimeout(() => {
      st.style.display = 'none';
    }, 2500);
  }
  renderDCHistory();
}

export function deleteDCEntry(date) {
  if (!confirm('Delete this reflection?')) return;
  const data = loadDC();
  delete data[date];
  saveDC(data);
  
  // Clear form if deleting today
  if (date === todayStr) {
    const ta = document.getElementById('dc-text');
    if (ta) ta.value = '';
    dcRating = '';
    document.querySelectorAll('.dc-rating-btn').forEach(b => {
      b.classList.remove('dc-sel');
    });
  }
  renderDCHistory();
}

export function renderDCHistory() {
  const el = document.getElementById('dc-history');
  if (!el) return;
  
  const data = loadDC();
  const td = todayStr;
  const dates = Object.keys(data).sort().reverse().filter(d => d !== td).slice(0, 7);
  
  if (!dates.length) {
    el.innerHTML = '';
    return;
  }
  
  el.innerHTML = `
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#8892b0;margin-bottom:8px">Past Reflections</div>
    ${dates.map(d => {
      const entry = data[d];
      const dateLabel = new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
      return `
      <div class="dc-entry">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div class="dc-entry-date">
            ${entry.rating ? `<span class="jchip jc-screened" style="font-size:9px;padding:1px 6px;margin-right:4px">${entry.rating.toUpperCase()}</span>` : ''}
            ${dateLabel}
          </div>
          <button class="icon-btn" onclick="deleteDCEntry('${d}')" title="Delete">🗑</button>
        </div>
        <div class="dc-entry-text">${esc(entry.text || '')}</div>
      </div>`;
    }).join('')}`;
}

// ── BIND WINDOW INTERFACES ──────────────────
window.setMood = setMood;
window.setDCRating = setDCRating;
window.saveDayContext = saveDayContext;
window.deleteDCEntry = deleteDCEntry;
