import { state, save, toast } from './learn-prep.js';
import { PREP_TYPES } from './constants.js';
import { esc } from '../common/utils.js';
import { toggleVoiceInput } from '../common/voice.js';

export let activeCoPrep = {};

export function toggleAddCompany() {
  const f = document.getElementById('add-company-form');
  if (!f) return;
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
  if (f.style.display === 'block') {
    const coDate = document.getElementById('co-date');
    if (coDate) coDate.value = new Date().toISOString().split('T')[0];
  }
}

export function addCompany() {
  const name = document.getElementById('co-name')?.value.trim() || '';
  const role = document.getElementById('co-role')?.value.trim() || '';
  const dateVal = document.getElementById('co-date')?.value || '';
  const stage = document.getElementById('co-stage')?.value.trim() || '';

  if (!name) {
    toast('Enter company name');
    return;
  }

  const co = {
    id: 'co_' + Date.now(),
    name,
    role,
    date: dateVal,
    stage: stage || 'Pending',
    preps: {},
    createdAt: new Date().toISOString()
  };

  PREP_TYPES.forEach(pt => {
    co.preps[pt.id] = prepTypeDefaults(pt.id, name, role);
  });

  state.companies.unshift(co);
  save();

  const nInput = document.getElementById('co-name');
  const rInput = document.getElementById('co-role');
  const sInput = document.getElementById('co-stage');
  if (nInput) nInput.value = '';
  if (rInput) rInput.value = '';
  if (sInput) sInput.value = '';

  toggleAddCompany();
  renderCompanies();
  toast('✅ Company added — prep questions ready!');
}

function prepTypeDefaults(type, company, role) {
  const defaults = {
    selfintro: [
      { q: `Give your self introduction for ${company}.`, a: `Hi, I'm Soma Sai Dinesh Cheviti. I have 1 year 7 months of experience as an SDET at Echno Technologies in Bengaluru, where I built Playwright+TypeScript automation for fintech payment flows across 10+ merchant sites. I'm skilled in API testing, CI/CD with GitHub Actions, and Agentic QA using Playwright MCP + Claude. I'm excited about the ${role} opportunity at ${company} because [customize: company mission/tech stack].`, myAnswers: [] }
    ],
    hr: [
      { q: 'Why do you want to join ' + company + '?', a: 'Research the company and mention: product domain, tech stack alignment, growth stage, engineering culture. Connect to your fintech/automation background.', myAnswers: [] },
      { q: 'Where do you see yourself in 3 years?', a: 'Leading test automation strategy, designing frameworks, mentoring SDETs, integrating AI-assisted testing into the pipeline.', myAnswers: [] },
      { q: 'What is your biggest strength?', a: 'Building robust test frameworks from scratch. At Echno I designed POM-based Playwright framework covering 10+ merchant payment flows, reducing regression time by X%.', myAnswers: [] },
      { q: 'What is your biggest weakness?', a: 'I sometimes go too deep into automation coverage when a manual check would suffice. I\'ve learned to balance automation ROI vs quick manual validation for low-frequency scenarios.', myAnswers: [] }
    ],
    technical: [
      { q: 'Walk me through your Playwright framework at Echno.', a: 'POM structure with TypeScript. BasePage class with common methods. Page classes extend BasePage. Fixtures for auth state. Tests in /tests directory, pages in /pages. GitHub Actions runs on PR. HTML reporter for results.', myAnswers: [] },
      { q: 'How did you handle payment flow testing?', a: 'End-to-end: navigate to merchant site → select product → checkout → payment method → confirm. API validation at each step. Parallel test execution across 10+ merchant configs. Data-driven with different card numbers and amounts.', myAnswers: [] },
      { q: 'Explain your API testing approach.', a: 'Playwright APIRequestContext for API-level assertions. Postman for exploratory. Schema validation with zod. Test auth tokens, error codes, response time SLAs. Chain API calls to set up test state before UI flows.', myAnswers: [] }
    ],
    experience: [
      { q: 'Tell me about a complex automation problem you solved.', a: 'Payment race condition: UI showed success before backend confirmed. Identified using API-level Playwright assertions comparing UI state vs backend state. Fixed by adding explicit waitForResponse to payment confirmation step.', myAnswers: [] },
      { q: 'Describe your CI/CD experience.', a: 'GitHub Actions: YAML workflows, run tests on PR and main branch push. npm ci → playwright install → playwright test → publish HTML report as artifact. Failed tests block merge via branch protection rules.', myAnswers: [] }
    ],
    project: [
      { q: 'Describe your SDET portfolio project.', a: 'github.com/somasaic/sdet-stlc-portfolio — Playwright+TypeScript framework demonstrating full STLC: test planning, POM framework, API testing, CI/CD with GitHub Actions, HTML reports, and Agentic QA using Playwright MCP + Claude Desktop.', myAnswers: [] }
    ],
    hypothetical: [
      { q: 'How would you test a payment gateway from scratch?', a: '1. Understand requirements and payment flows. 2. Identify test scenarios: happy path, card declined, network timeout, duplicate transaction, refund. 3. Design POM for checkout pages. 4. Write API tests for payment endpoints. 5. Mock payment provider for unit tests. 6. End-to-end tests with sandbox credentials. 7. CI pipeline for regression.', myAnswers: [] },
      { q: 'What would you do if 40% of tests are flaky in CI?', a: '1. Categorize flaky tests. 2. Find root causes: timing issues, shared state, environment instability, non-deterministic data. 3. Fix top offenders first — stable locators, proper waits, isolated state. 4. Add retry logic for known external dependencies. 5. Track flakiness rate as a metric.', myAnswers: [] }
    ],
    salary: [
      { q: 'What is your expected salary?', a: `For the ${role} role at ${company}, I'm targeting [use salary table: IT services 7L, mid product 8.5L, big product 9-10L, remote 9.5L]. I'm an immediate joiner with strong Playwright+TypeScript fintech background. Open to discuss based on total compensation.`, myAnswers: [] }
    ]
  };
  return defaults[type] || [];
}

export function renderCompanies() {
  const el = document.getElementById('companies-list');
  if (!el) return;

  const countEl = document.getElementById('co-count');
  if (countEl) countEl.textContent = state.companies.length;

  if (!state.companies.length) {
    el.innerHTML = '<div class="empty">No companies added yet. Add a company to start interview prep.</div>';
    return;
  }

  el.innerHTML = state.companies.map(co => {
    const prepTabs = PREP_TYPES.map(pt => 
      `<div class="ptt${activeCoPrep[co.id] === pt.id ? ' active' : ''}" onclick="showCoPrep('${co.id}','${pt.id}')">${pt.label}</div>`
    ).join('');

    const prepPanels = PREP_TYPES.map(pt => {
      const qs = co.preps[pt.id] || [];
      return `<div class="prep-panel${activeCoPrep[co.id] === pt.id ? ' active' : ''}" id="pp-${co.id}-${pt.id}">
        ${qs.map((qa, qi) => coPrepItemHTML(co.id, pt.id, qi, qa)).join('')}
        <button class="btn-sm" onclick="addPrepQ('${co.id}','${pt.id}')" style="margin-top:6px;background:#f0ebff;color:var(--p)">+ Add Question</button>
      </div>`;
    }).join('');

    const isBodyOpen = activeCoPrep[co.id] ? ' open' : '';

    return `<div class="co-card">
      <div class="co-hdr${isBodyOpen}" onclick="toggleCo('${co.id}')">
        <div>
          <div class="co-name">${esc(co.name)}</div>
          <div class="co-role">${co.role ? esc(co.role) + ' · ' : ''}<span class="chip chip-gray">${co.stage || 'Pending'}</span>${co.date ? ' · ' + co.date : ''}</div>
        </div>
        <div style="display:flex;gap:5px">
          <button class="btn-sm" onclick="event.stopPropagation();deleteCo('${co.id}')" style="background:#fee2e2;color:var(--r)">🗑</button>
        </div>
      </div>
      <div class="co-body${isBodyOpen}" id="cb-${co.id}">
        <div class="prep-type-tabs">${prepTabs}</div>
        ${prepPanels}
      </div>
    </div>`;
  }).join('');
}

export function toggleCo(id) {
  const el = document.getElementById('cb-' + id);
  if (!el) return;
  const open = el.classList.contains('open');
  el.classList.toggle('open');
  if (!open && !activeCoPrep[id]) {
    showCoPrep(id, 'selfintro');
  } else if (open) {
    delete activeCoPrep[id];
    renderCompanies();
  }
}

export function showCoPrep(coId, prepType) {
  activeCoPrep[coId] = prepType;
  const body = document.getElementById('cb-' + coId);
  if (body) body.classList.add('open');
  renderCompanies();
}

function coPrepItemHTML(coId, prepType, qi, qa) {
  const savedAnswersHTML = qa.myAnswers && qa.myAnswers.length
    ? '<div style="font-size:10px;font-weight:700;color:var(--sub);margin-top:6px;margin-bottom:4px">MY SAVED ANSWERS:</div>' +
      qa.myAnswers.map((a, ai) => `<div class="saved-ans">${esc(a.text)}<span style="display:block;font-size:9px;opacity:.6;margin-top:3px">${a.date}</span><button class="del-ans" onclick="delCoAnswer('${coId}','${prepType}','${qi}',${ai})">✕</button></div>`).join('')
    : '';

  return `<div class="prep-qa-item">
    <div class="qa-q">${qi + 1}. ${esc(qa.q)}</div>
    <button class="qa-toggle" onclick="toggleCoAns('${coId}','${prepType}','${qi}')">👁 Model Answer</button>
    <div class="qa-a hidden" id="coa-${coId}-${prepType}-${qi}">${esc(qa.a)}</div>
    <div class="sol-box">
      <div style="font-size:10px;font-weight:700;color:var(--sub);margin-bottom:5px">🎤 PRACTICE YOUR ANSWER</div>
      <div style="display:flex;gap:6px;align-items:flex-start">
        <textarea id="cosol-${coId}-${prepType}-${qi}" placeholder="Practice your answer here or speak it…" style="min-height:55px;font-size:12px"></textarea>
        <button class="mic-btn" id="comic-${coId}-${prepType}-${qi}" onclick="toggleMicInput('cosol-${coId}-${prepType}-${qi}','comic-${coId}-${prepType}-${qi}')">🎙️</button>
      </div>
      <div class="sol-row" style="margin-top:5px">
        <button class="btn-sm" onclick="saveCoAnswer('${coId}','${prepType}','${qi}')" style="background:var(--g)">💾 Save</button>
        <button class="btn-sm" onclick="editCoPrepItem('${coId}','${prepType}',${qi})" style="background:#f0ebff;color:var(--p)">✏️ Edit Q</button>
      </div>
      <div id="cosaved-${coId}-${prepType}-${qi}" class="saved-answers">
        ${savedAnswersHTML}
      </div>
    </div>
  </div>`;
}

export function toggleCoAns(coId, prepType, qi) {
  const el = document.getElementById('coa-' + coId + '-' + prepType + '-' + qi);
  if (el) el.classList.toggle('hidden');
}

export function toggleMicInput(targetId, btnId) {
  toggleVoiceInput(targetId, btnId, toast);
}

export function saveCoAnswer(coId, prepType, qi) {
  const ta = document.getElementById('cosol-' + coId + '-' + prepType + '-' + qi);
  if (!ta || !ta.value.trim()) {
    toast('Type an answer first');
    return;
  }
  const co = state.companies.find(c => c.id === coId);
  if (!co) return;
  const qa = co.preps[prepType]?.[qi];
  if (!qa) return;
  if (!qa.myAnswers) qa.myAnswers = [];

  qa.myAnswers.push({
    text: ta.value.trim(),
    date: new Date().toLocaleDateString('en-IN')
  });
  save();
  ta.value = '';
  toast('✅ Answer saved!');
  renderCompanies();
}

export function delCoAnswer(coId, prepType, qi, ai) {
  const co = state.companies.find(c => c.id === coId);
  if (!co) return;
  if (co.preps[prepType] && co.preps[prepType][qi] && co.preps[prepType][qi].myAnswers) {
    co.preps[prepType][qi].myAnswers.splice(ai, 1);
    save();
    renderCompanies();
    toast('Answer deleted');
  }
}

export function addPrepQ(coId, prepType) {
  const q = prompt('Enter question:');
  if (!q) return;
  const a = prompt('Enter model answer (optional):');
  const co = state.companies.find(c => c.id === coId);
  if (!co) return;
  if (!co.preps[prepType]) co.preps[prepType] = [];
  
  co.preps[prepType].push({
    q,
    a: a || '',
    myAnswers: []
  });
  save();
  renderCompanies();
  toast('Question added!');
}

export function editCoPrepItem(coId, prepType, qi) {
  const co = state.companies.find(c => c.id === coId);
  if (!co) return;
  const qa = co.preps[prepType]?.[qi];
  if (!qa) return;

  const q = prompt('Edit question:', qa.q);
  if (q === null) return;
  const a = prompt('Edit model answer:', qa.a);
  if (a === null) return;

  qa.q = q;
  qa.a = a;
  save();
  renderCompanies();
  toast('Question updated!');
}

export function deleteCo(id) {
  if (!confirm('Delete this company and all prep answers?')) return;
  state.companies = state.companies.filter(c => c.id !== id);
  delete activeCoPrep[id];
  save();
  renderCompanies();
  toast('Company deleted');
}
