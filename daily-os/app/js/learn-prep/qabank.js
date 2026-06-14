import { state } from './learn-prep.js';
import { SKILLS, DEFAULT_QA } from './constants.js';
import { esc } from '../common/utils.js';

export let qbActiveSkill = 'all';

export function filterQB(el, skill) {
  document.querySelectorAll('.qbf').forEach(e => e.classList.remove('active'));
  if (el) el.classList.add('active');
  qbActiveSkill = skill;
  renderQABank();
}

export function renderQABank() {
  const el = document.getElementById('qb-list');
  if (!el) return;

  // Collect all QAs from sessions
  const all = [];
  state.sessions.forEach(s => {
    Object.entries(s.skillQA || {}).forEach(([sk, qs]) => {
      qs.forEach(qa => {
        all.push({
          skill: sk,
          q: qa.q,
          a: qa.a,
          date: s.date,
          heading: s.heading
        });
      });
    });
  });

  // Also add defaults if no sessions exist
  if (!all.length) {
    Object.entries(DEFAULT_QA).forEach(([sk, qs]) => {
      qs.forEach(qa => {
        all.push({
          skill: sk,
          q: qa.q,
          a: qa.a,
          date: 'Default',
          heading: 'Built-in'
        });
      });
    });
  }

  const filtered = qbActiveSkill === 'all' ? all : all.filter(q => q.skill === qbActiveSkill);

  if (!filtered.length) {
    el.innerHTML = '<div class="empty">No Q&As for this skill yet. Add sessions with this skill tag.</div>';
    return;
  }

  el.innerHTML = filtered.map((qa, i) => `<div class="qb-item">
    <div class="qb-skill-tag">${SKILLS[qa.skill]?.label || qa.skill} · ${qa.date}</div>
    <div class="qa-q">${esc(qa.q)}</div>
    <button class="qa-toggle" onclick="toggleQBans(${i})">👁 Show Answer</button>
    <div class="qa-a hidden" id="qba-${i}">${esc(qa.a)}</div>
  </div>`).join('');
}

export function toggleQBans(i) {
  const el = document.getElementById('qba-' + i);
  if (el) el.classList.toggle('hidden');
}
