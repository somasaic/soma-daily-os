import { esc } from '../common/utils.js';
import { toggleVoiceInput } from '../common/voice.js';

const PI_KEY = 'soma_park_ideas';
let piFiles = [];
let piSelectedTag = '💡 Idea';

// ── STORAGE HELPERS ─────────────────────────
function loadPI() {
  try {
    return JSON.parse(localStorage.getItem(PI_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function savePI(d) {
  localStorage.setItem(PI_KEY, JSON.stringify(d));
}

// ── FORM ACTIONS ────────────────────────────
export function toggleParkIdeasForm() {
  const f = document.getElementById('pi-form');
  const btn = document.getElementById('pi-toggle-btn');
  if (!f || !btn) return;
  
  const open = f.style.display !== 'none';
  f.style.display = open ? 'none' : 'block';
  btn.textContent = open ? '+ Add Idea' : '✕ Close';
  
  if (!open) {
    const t = document.getElementById('pi-text');
    if (t) t.focus();
  }
}

export function selectIdeaTag(el) {
  piSelectedTag = el.getAttribute('data-tag');
  document.querySelectorAll('#pi-tags .idea-tag').forEach(t => {
    t.classList.remove('sel');
  });
  el.classList.add('sel');
}

export function handleIdeaFiles(e) {
  const files = Array.from(e.target.files);
  piFiles = [];
  const preview = document.getElementById('pi-file-preview');
  if (!preview) return;
  preview.innerHTML = '';
  
  if (!files.length) return;
  
  files.forEach(file => {
    const reader = new FileReader();
    const isText = /\.(txt|md|json|html|htm|xml|csv|js|ts|py|yaml|yml|css|sql)$/i.test(file.name);
    
    reader.onload = ev => {
      piFiles.push({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        data: ev.target.result,
        isText: isText
      });
      preview.innerHTML += `<span class="idea-file-chip">📎 ${file.name} (${Math.round(file.size / 1024)}KB)</span>`;
    };
    
    if (isText) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
}

export function saveParkIdea() {
  const textEl = document.getElementById('pi-text');
  let text = textEl ? textEl.value : '';
  if (text) text = text.trim();
  
  if (!text && piFiles.length === 0) {
    alert('Type an idea or attach a file first');
    return;
  }
  
  const ideas = loadPI();
  const td = new Date().toISOString().split('T')[0];
  const ts = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  
  ideas.unshift({
    id: 'pi' + Date.now(),
    date: td,
    time: ts,
    tag: piSelectedTag,
    text: text,
    files: piFiles.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
      data: f.data,
      isText: f.isText
    }))
  });
  
  savePI(ideas);
  clearParkIdeaForm();
  toggleParkIdeasForm();
  renderParkIdeas();
}

export function clearParkIdeaForm() {
  const t = document.getElementById('pi-text');
  if (t) t.value = '';
  piFiles = [];
  
  const fp = document.getElementById('pi-file-preview');
  if (fp) fp.innerHTML = '';
  
  const fi = document.getElementById('pi-file-input');
  if (fi) fi.value = '';
}

export function deleteParkIdea(id) {
  if (!confirm('Delete this idea?')) return;
  savePI(loadPI().filter(i => i.id !== id));
  renderParkIdeas();
}

export function openIdeaFile(ideaId, fileIdx) {
  const ideas = loadPI();
  const idea = ideas.find(i => i.id === ideaId);
  if (!idea || !idea.files[fileIdx]) return;
  const f = idea.files[fileIdx];
  
  if (f.isText) {
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<pre style="font-family:monospace;padding:16px;white-space:pre-wrap">${f.data.replace(/</g, '&lt;')}</pre>`);
    }
  } else {
    const a = document.createElement('a');
    a.href = f.data;
    a.download = f.name;
    a.click();
  }
}

// ── RENDERING ───────────────────────────────
export function renderParkIdeas() {
  const el = document.getElementById('pi-list');
  if (!el) return;
  
  const ideas = loadPI();
  if (!ideas.length) {
    el.innerHTML = '<div class="empty-msg">No ideas parked yet — tap + Add Idea to capture anything that excites you.</div>';
    return;
  }
  
  el.innerHTML = ideas.map(idea => {
    let filesHtml = '';
    if (idea.files && idea.files.length) {
      filesHtml = '<div class="idea-files">' + idea.files.map((f, fi) => 
        `<span class="idea-file-chip" onclick="openIdeaFile('${idea.id}',${fi})" title="${f.isText ? 'View' : 'Download'} ${f.name}">📎 ${f.name}</span>`
      ).join('') + '</div>';
    }
    return `
    <div class="idea-item">
      <div class="idea-item-hdr">
        <span class="idea-tag-chip">${idea.tag}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="idea-date">${idea.time ? idea.date + ' ' + idea.time : idea.date}</span>
          <button class="icon-btn" onclick="deleteParkIdea('${idea.id}')" title="Delete">🗑</button>
        </div>
      </div>
      ${idea.text ? `<div class="idea-text">${esc(idea.text)}</div>` : ''}
      ${filesHtml}
    </div>`;
  }).join('');
}

// ── BIND WINDOW INTERFACES ──────────────────
window.toggleParkIdeasForm = toggleParkIdeasForm;
window.selectIdeaTag = selectIdeaTag;
window.handleIdeaFiles = handleIdeaFiles;
window.saveParkIdea = saveParkIdea;
window.clearParkIdeaForm = clearParkIdeaForm;
window.deleteParkIdea = deleteParkIdea;
window.openIdeaFile = openIdeaFile;
window.mic_piText = () => {
  toggleVoiceInput('pi-text', 'mic-btn-pi-text');
};
