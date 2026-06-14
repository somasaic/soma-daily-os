import { state, toast } from './learn-prep.js';
import { SKILLS, DEFAULT_QA } from './constants.js';
import { esc } from '../common/utils.js';
import { toggleVoiceInput } from '../common/voice.js';

export let pracQs = [];
export let pracIdx = 0;

export function renderPracticeSetup() {
  const el = document.getElementById('practice-area');
  if (el) {
    el.innerHTML = '<div class="empty">Select skill + mode above, then tap Start Practice.</div>';
  }
}

export function startPractice() {
  const skill = document.getElementById('prac-skill')?.value || 'all';
  const mode = document.getElementById('prac-mode')?.value || 'all';

  let qs = [];
  
  // Gather from logged sessions
  state.sessions.forEach(s => {
    Object.entries(s.skillQA || {}).forEach(([sk, qas]) => {
      if (skill === 'all' || sk === skill) {
        qas.forEach(qa => {
          // If technical, skip general/hr. If behavioral, skip technical.
          const isGeneral = sk === 'general';
          if (mode === 'technical' && isGeneral) return;
          if (mode === 'behavioral' && !isGeneral) return;
          
          qs.push({ skill: sk, q: qa.q, a: qa.a });
        });
      }
    });
  });

  // Gather from defaults if no sessions matching filters
  if (!qs.length) {
    const pool = skill === 'all' ? Object.entries(DEFAULT_QA) : [[skill, DEFAULT_QA[skill] || []]];
    pool.forEach(([sk, qas]) => {
      qas.forEach(qa => {
        const isGeneral = sk === 'general';
        if (mode === 'technical' && isGeneral) return;
        if (mode === 'behavioral' && !isGeneral) return;
        
        qs.push({ skill: sk, q: qa.q, a: qa.a });
      });
    });
  }

  if (!qs.length) {
    const area = document.getElementById('practice-area');
    if (area) {
      area.innerHTML = '<div class="empty">No questions found for this filter.</div>';
    }
    return;
  }

  // Shuffle questions
  qs.sort(() => Math.random() - 0.5);
  pracQs = qs;
  pracIdx = 0;
  renderPracticeCard();
}

export function renderPracticeCard() {
  const area = document.getElementById('practice-area');
  if (!area) return;

  if (pracIdx >= pracQs.length) {
    area.innerHTML = `<div class="card" style="text-align:center;padding:24px">
      <div style="font-size:40px;margin-bottom:10px">🎉</div>
      <div style="font-size:16px;font-weight:800;margin-bottom:6px">Practice Complete!</div>
      <div style="font-size:13px;color:var(--sub);margin-bottom:14px">${pracQs.length} questions covered</div>
      <button class="btn btn-p" style="width:100%" onclick="startPractice()">Practice Again (Reshuffled)</button>
    </div>`;
    return;
  }

  const qa = pracQs[pracIdx];
  area.innerHTML = `<div class="practice-card">
    <div class="q-num">Question ${pracIdx + 1} of ${pracQs.length} · <span style="opacity:.8">${SKILLS[qa.skill]?.label || qa.skill}</span></div>
    <div class="q-text">${esc(qa.q)}</div>
    <textarea id="prac-answer" placeholder="Speak out loud or type your answer here…" style="min-height:80px;margin-bottom:8px"></textarea>
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
      <button class="mic-btn" id="prac-mic" onclick="togglePracMic()" style="background:rgba(255,255,255,.2);opacity:.8;border-radius:8px;padding:6px 10px;font-size:16px">🎙️</button>
      <button class="btn" onclick="showPracAns()" style="background:rgba(255,255,255,.15);color:#fff;border:1.5px solid rgba(255,255,255,.3);flex:1">👁 Show Answer</button>
    </div>
  </div>
  <div id="prac-ans-box" style="display:none" class="card">
    <div style="font-size:11px;font-weight:700;color:var(--p);margin-bottom:6px">MODEL ANSWER:</div>
    <div style="font-size:13px;color:#374151;line-height:1.6">${esc(qa.a)}</div>
    <hr>
    <div style="font-size:11px;font-weight:700;color:var(--sub);margin-bottom:6px">HOW DID YOU DO?</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-r" onclick="nextQ()" style="flex:1">😕 Needs Work</button>
      <button class="btn btn-o" onclick="nextQ()" style="flex:1">😐 Getting There</button>
      <button class="btn btn-g" onclick="nextQ()" style="flex:1">😄 Nailed It</button>
    </div>
  </div>`;
}

export function togglePracMic() {
  toggleVoiceInput('prac-answer', 'prac-mic', toast);
}

export function showPracAns() {
  const box = document.getElementById('prac-ans-box');
  if (box) box.style.display = 'block';
}

export function nextQ() {
  pracIdx++;
  renderPracticeCard();
}
