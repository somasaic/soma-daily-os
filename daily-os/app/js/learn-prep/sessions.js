import { state, save, toast } from './learn-prep.js';
import { SKILLS, DEFAULT_QA } from './constants.js';
import { esc } from '../common/utils.js';
import { toggleVoiceInput } from '../common/voice.js';

export let activeSessSkill = {};
let selectedSkills = new Set();

export function toggleAddSession() {
  const f = document.getElementById('add-session-form');
  if (!f) return;
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
  if (f.style.display === 'block') {
    const sDate = document.getElementById('s-date');
    if (sDate) sDate.value = new Date().toISOString().split('T')[0];
  }
}

export function initSkillPills() {
  document.querySelectorAll('#s-skills .spill').forEach(el => {
    el.addEventListener('click', function() {
      const sk = this.dataset.skill;
      if (selectedSkills.has(sk)) {
        selectedSkills.delete(sk);
        this.classList.remove('sel');
      } else {
        selectedSkills.add(sk);
        this.classList.add('sel');
      }
    });
  });
}

export function addSession() {
  const dateVal = document.getElementById('s-date')?.value || '';
  const heading = document.getElementById('s-heading')?.value.trim() || '';
  const concepts = document.getElementById('s-concepts')?.value.trim() || '';
  const topics = document.getElementById('s-topics')?.value.trim() || '';

  if (!heading) {
    toast('Enter a session heading');
    return;
  }

  const skills = [...selectedSkills];
  const skillQA = {};
  skills.forEach(sk => {
    skillQA[sk] = (DEFAULT_QA[sk] || []).map((item, i) => ({
      id: 'qa_' + Date.now() + '_' + i,
      q: item.q,
      a: item.a,
      myAnswers: [],
      score: null
    }));
  });

  const sess = {
    id: 'sess_' + Date.now(),
    date: dateVal,
    heading,
    concepts,
    topics,
    skills,
    skillQA,
    createdAt: new Date().toISOString()
  };

  state.sessions.unshift(sess);
  save();

  selectedSkills.clear();
  document.querySelectorAll('#s-skills .spill').forEach(el => el.classList.remove('sel'));
  
  const hInput = document.getElementById('s-heading');
  const cInput = document.getElementById('s-concepts');
  const tInput = document.getElementById('s-topics');
  if (hInput) hInput.value = '';
  if (cInput) cInput.value = '';
  if (tInput) tInput.value = '';

  toggleAddSession();
  renderSessions();
  toast('✅ Session added!');
}

export function renderSessions() {
  const el = document.getElementById('sessions-list');
  if (!el) return;

  const countEl = document.getElementById('sess-count');
  if (countEl) countEl.textContent = state.sessions.length;

  let totalQAs = 0;
  state.sessions.forEach(s => {
    Object.values(s.skillQA || {}).forEach(qs => {
      totalQAs += qs.length;
    });
  });

  const qaTotalEl = document.getElementById('qa-total');
  if (qaTotalEl) qaTotalEl.textContent = totalQAs;

  if (!state.sessions.length) {
    el.innerHTML = '<div class="empty">No sessions yet. Tap + Add Session to log your first learning session.</div>';
    return;
  }

  el.innerHTML = state.sessions.map(s => {
    const skillTabs = s.skills.map(sk => 
      `<div class="sst${activeSessSkill[s.id] === sk ? ' active' : ''}" onclick="showSessSkill('${s.id}','${sk}')">${SKILLS[sk]?.label || sk}</div>`
    ).join('');

    const qaPanels = s.skills.map(sk => {
      const qs = s.skillQA[sk] || [];
      return `<div class="qa-panel${activeSessSkill[s.id] === sk ? ' active' : ''}" id="qap-${s.id}-${sk}">
        ${qs.length ? qs.map((qa, qi) => qaItemHTML(s.id, sk, qi, qa)).join('') : '<div class="empty">No Q&As for this skill. Click Edit to add.</div>'}
        <button class="btn-sm" onclick="addQAToSkill('${s.id}','${sk}')" style="margin-top:6px;background:#f0ebff;color:var(--p)">+ Add Q&amp;A</button>
      </div>`;
    }).join('');

    const isBodyOpen = activeSessSkill[s.id] ? ' open' : '';
    const arrowIcon = activeSessSkill[s.id] ? '▲' : '▼';

    return `<div class="sess-card">
      <div class="sess-hdr" onclick="toggleSess('${s.id}')">
        <div style="flex:1">
          <div class="sess-date">${s.date}</div>
          <div class="sess-heading">${esc(s.heading)}</div>
          ${s.concepts ? `<div class="sess-concepts">📌 ${esc(s.concepts)}</div>` : ''}
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px">
            ${s.skills.map(sk => `<span class="chip" style="background:${SKILLS[sk]?.color || '#6b7280'}22;color:${SKILLS[sk]?.color || '#6b7280'}">${SKILLS[sk]?.label || sk}</span>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:5px;align-items:flex-start">
          <button class="btn-sm" onclick="event.stopPropagation();deleteSess('${s.id}')" style="background:#fee2e2;color:var(--r)">🗑</button>
          <span style="font-size:18px;color:var(--sub)">${arrowIcon}</span>
        </div>
      </div>
      <div class="sess-body${isBodyOpen}" id="sb-${s.id}">
        ${s.topics ? `<div style="font-size:11px;color:var(--sub);margin-bottom:10px">🎯 Topics: ${esc(s.topics)}</div>` : ''}
        ${s.skills.length ? `<div class="sess-skill-tabs">${skillTabs}</div>${qaPanels}` : '<div class="empty">No skills tagged. Edit session to add skills.</div>'}
      </div>
    </div>`;
  }).join('');
}

export function toggleSess(id) {
  const el = document.getElementById('sb-' + id);
  if (!el) return;
  const open = el.classList.contains('open');
  el.classList.toggle('open');
  
  if (!open && !activeSessSkill[id]) {
    const sess = state.sessions.find(s => s.id === id);
    if (sess && sess.skills.length) {
      showSessSkill(id, sess.skills[0]);
    }
  } else if (open) {
    delete activeSessSkill[id];
    renderSessions();
  }
}

export function showSessSkill(sessId, skill) {
  activeSessSkill[sessId] = skill;
  const body = document.getElementById('sb-' + sessId);
  if (body) body.classList.add('open');
  renderSessions();
  setTimeout(() => {
    const el = document.getElementById('qap-' + sessId + '-' + skill);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

function qaItemHTML(sessId, skill, qi, qa) {
  const savedAnswersHTML = qa.myAnswers && qa.myAnswers.length
    ? '<div style="font-size:10px;font-weight:700;color:var(--sub);margin-top:6px;margin-bottom:4px">MY SAVED ANSWERS:</div>' +
      qa.myAnswers.map((a, ai) => `<div class="saved-ans">${esc(a.text)}<span style="display:block;font-size:9px;opacity:.6;margin-top:3px">${a.date}</span><button class="del-ans" onclick="delMyAnswer('${sessId}','${skill}','${qi}',${ai})">✕</button></div>`).join('')
    : '';

  return `<div class="qa-item" id="qa-${sessId}-${skill}-${qi}">
    <div class="qa-q">${qi + 1}. ${esc(qa.q)}</div>
    <button class="qa-toggle" onclick="toggleAns('${sessId}','${skill}','${qi}')">👁 Show Answer</button>
    <div class="qa-a hidden" id="ans-${sessId}-${skill}-${qi}">${esc(qa.a)}</div>
    <div class="sol-box">
      <div style="font-size:10px;font-weight:700;color:var(--sub);margin-bottom:5px">🎤 YOUR ANSWER — Speak or Type</div>
      <div style="display:flex;gap:6px;align-items:flex-start">
        <textarea id="sol-${sessId}-${skill}-${qi}" placeholder="Type your answer or tap mic to speak out loud…" style="min-height:55px;font-size:12px"></textarea>
        <button class="mic-btn" id="mic-${sessId}-${skill}-${qi}" onclick="toggleMicInput('sol-${sessId}-${skill}-${qi}','mic-${sessId}-${skill}-${qi}')">🎙️</button>
      </div>
      <div class="sol-row" style="margin-top:5px">
        <button class="btn-sm" onclick="saveMyAnswer('${sessId}','${skill}','${qi}')" style="background:var(--g)">💾 Save Answer</button>
        <button class="btn-sm" onclick="editQAItem('${sessId}','${skill}',${qi})" style="background:#f0ebff;color:var(--p)">✏️ Edit Q</button>
      </div>
      <div id="saved-${sessId}-${skill}-${qi}" class="saved-answers">
        ${savedAnswersHTML}
      </div>
    </div>
  </div>`;
}

export function toggleAns(sessId, skill, qi) {
  const el = document.getElementById('ans-' + sessId + '-' + skill + '-' + qi);
  if (el) el.classList.toggle('hidden');
}

export function toggleMicInput(targetId, btnId) {
  toggleVoiceInput(targetId, btnId, toast);
}

export function saveMyAnswer(sessId, skill, qi) {
  const ta = document.getElementById('sol-' + sessId + '-' + skill + '-' + qi);
  if (!ta || !ta.value.trim()) {
    toast('Type an answer first');
    return;
  }
  const sess = state.sessions.find(s => s.id === sessId);
  if (!sess) return;
  const qa = sess.skillQA[skill]?.[qi];
  if (!qa) return;
  if (!qa.myAnswers) qa.myAnswers = [];
  
  qa.myAnswers.push({
    text: ta.value.trim(),
    date: new Date().toLocaleDateString('en-IN')
  });
  save();
  ta.value = '';
  toast('✅ Answer saved!');
  renderSessions();
}

export function delMyAnswer(sessId, skill, qi, ai) {
  const sess = state.sessions.find(s => s.id === sessId);
  if (!sess) return;
  sess.skillQA[skill][qi].myAnswers.splice(ai, 1);
  save();
  renderSessions();
  toast('Answer deleted');
}

export function addQAToSkill(sessId, skill) {
  const q = prompt('Enter question:');
  if (!q) return;
  const a = prompt('Enter model answer (can leave blank and fill later):');
  const sess = state.sessions.find(s => s.id === sessId);
  if (!sess) return;
  if (!sess.skillQA[skill]) sess.skillQA[skill] = [];
  
  sess.skillQA[skill].push({
    id: 'qa_' + Date.now(),
    q,
    a: a || '',
    myAnswers: [],
    score: null
  });
  save();
  renderSessions();
  toast('Q&A added!');
}

export function editQAItem(sessId, skill, qi) {
  const sess = state.sessions.find(s => s.id === sessId);
  if (!sess) return;
  const qa = sess.skillQA[skill]?.[qi];
  if (!qa) return;
  
  const q = prompt('Edit question:', qa.q);
  if (q === null) return;
  const a = prompt('Edit model answer:', qa.a);
  if (a === null) return;
  
  qa.q = q;
  qa.a = a;
  save();
  renderSessions();
  toast('Q&A updated!');
}

export function deleteSess(id) {
  if (!confirm('Delete this session and all its Q&As?')) return;
  state.sessions = state.sessions.filter(s => s.id !== id);
  delete activeSessSkill[id];
  save();
  renderSessions();
  toast('Session deleted');
}
