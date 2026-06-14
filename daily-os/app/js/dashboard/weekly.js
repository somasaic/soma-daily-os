import { state, save, todayStr } from './dashboard.js';
import { WEEK_DAYS, BANNERS, DEFAULT_DAY_SCHEDULES } from './constants.js';
import { getOverallProgress, getActiveSkillsCount } from './skills.js';
import { getJourneyDay } from '../common/utils.js';

window._editingWeekDay = null;
window._ghEditing = false;

export function renderWeekly() {
  const now=new Date(), dow=now.getDay(), adj=dow===0?6:dow-1;
  const sow=new Date(now); sow.setDate(now.getDate()-adj);
  document.getElementById('week-grid').innerHTML=WEEK_DAYS.map((day,i)=>{
    const d=new Date(sow); d.setDate(sow.getDate()+i);
    const isToday=d.toISOString().split('T')[0]===todayStr;
    const plan=state.weekPlan[day]||{type:'rest',skill:''};
    return `<div class="week-day${isToday?' today':''}" onclick="cycleWeekDayType('${day}')">
      <div class="week-day-name">${day}</div>
      <div class="week-day-num">${d.getDate()}</div>
      <div class="week-type-chip">${BANNERS[plan.type].icon}</div>
    </div>`;
  }).join('');
  document.getElementById('week-plan-content').innerHTML=WEEK_DAYS.map(day=>{
    const plan=state.weekPlan[day]||{type:'rest',skill:''};
    const isEditing=window._editingWeekDay===day;
    if (isEditing) {
      return `<div class="week-plan-row" style="flex-wrap:wrap;gap:6px">
        <div class="week-plan-day">${day}</div>
        <div class="week-chip chip-${plan.type}">${BANNERS[plan.type].icon} ${plan.type.charAt(0).toUpperCase()+plan.type.slice(1)}</div>
        <input id="wskill-${day}" class="sched-input sched-label-input" value="${(plan.skill||'').replace(/"/g,'&quot;')}" placeholder="What skill focus this day?" style="flex:1;min-width:140px" />
        <button class="btn-sm" onclick="saveWeekSkill('${day}')">Save</button>
        <button class="btn-sm-ghost" onclick="cancelWeekSkillEdit()">✕</button>
      </div>`;
    }
    return `<div class="week-plan-row">
      <div class="week-plan-day">${day}</div>
      <div class="week-chip chip-${plan.type}">${BANNERS[plan.type].icon} ${plan.type.charAt(0).toUpperCase()+plan.type.slice(1)}</div>
      <div class="week-plan-skill" style="flex:1">${plan.skill||'<span style="color:#c0c4d8;font-style:italic">tap ✏️ to set focus</span>'}</div>
      <button class="icon-btn" onclick="startWeekSkillEdit('${day}')" title="Edit skill focus" style="opacity:.35">✏️</button>
    </div>`;
  }).join('');
  renderWeeklyReview();
  renderGitHubWidget();
}


export function renderWeeklyReview() {
  const el = document.getElementById('weekly-review-card');
  if (!el) return;

  // ── last 7 days stats ──
  const days7 = [];
  for (let d = 6; d >= 0; d--) {
    const dt = new Date(); dt.setDate(dt.getDate() - d);
    const k = dt.toISOString().slice(0,10);
    const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dt.getDay()];
    const sched = state.customDaySchedule[dayName] || DEFAULT_DAY_SCHEDULES[dayName] || [];
    const done = state.schedDone[k] || {};
    const doneCount = sched.filter((_,i)=>done[i]).length;
    const nnChecks = (state.nonNeg||[]).map(n=>{
      const c=JSON.parse(localStorage.getItem('soma_nn_'+k)||'{}'); return c[n.id]||false;
    });
    const nnDone = nnChecks.filter(Boolean).length;
    const moodVal = state.moods[k] || 0;
    days7.push({ k, dayName, schedTotal:sched.length, doneCount, nnDone, nnTotal:nnChecks.length, moodVal });
  }

  const nnRate = calcNNRate7();
  const skillAvg = getOverallProgress();
  const activeSkills = getActiveSkillsCount();
  const activeJobs = (state.jobs||[]).filter(j=>!['rejected','withdrawn'].includes(j.status)).length;

  // schedule completion avg
  const schedAvg = days7.length
    ? Math.round(days7.filter(d=>d.schedTotal>0).reduce((sum,d)=>sum+(d.doneCount/d.schedTotal)*100,0) / Math.max(1,days7.filter(d=>d.schedTotal>0).length))
    : 0;

  // mood avg
  const moodDays = days7.filter(d=>d.moodVal>0);
  const moodAvg = moodDays.length ? (moodDays.reduce((s,d)=>s+d.moodVal,0)/moodDays.length).toFixed(1) : '—';
  const moodEmoji = moodAvg>=4.5?'😄':moodAvg>=3.5?'🙂':moodAvg>=2.5?'😐':moodAvg>=1.5?'😕':moodAvg==='—'?'—':'😞';

  // best day
  const bestDay = [...days7].sort((a,b)=>(b.doneCount/Math.max(1,b.schedTotal))-(a.doneCount/Math.max(1,a.schedTotal)))[0];

  const hi = nnRate>=80?'🔥 Strong week — non-negotiables crushing it'
           : nnRate>=50?'⚡ Decent week — push non-neg consistency more'
           : schedAvg>=60?'💪 Schedule completion solid — keep NN focus'
           : '⚠️ Rough week — focus on non-negotiables + schedule first';

  // 7-day mini schedule bar
  const dayBars = days7.map(d => {
    const pct = d.schedTotal > 0 ? Math.round((d.doneCount/d.schedTotal)*100) : 0;
    const col = pct>=80?'#22c55e':pct>=50?'#f59e0b':pct>0?'#ef4444':'#e0e4f0';
    const isToday = d.k === todayStr;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1">
      <div style="font-size:9px;font-weight:700;color:${isToday?'#6c47ff':'#8892b0'}">${d.dayName}</div>
      <div style="width:100%;height:36px;background:#f0f2f8;border-radius:4px;overflow:hidden;display:flex;align-items:flex-end">
        <div style="width:100%;height:${pct||2}%;background:${col};border-radius:4px;transition:height .3s;min-height:2px"></div>
      </div>
      <div style="font-size:9px;color:#8892b0">${pct}%</div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="card-header"><div class="card-title">📊 WEEKLY REVIEW — LIVE</div></div>
    <div class="wrev-grid" style="grid-template-columns:repeat(5,1fr)">
      <div class="wrev-stat"><div class="wrev-val">${state.streak}</div><div class="wrev-lbl">🔥 Streak</div></div>
      <div class="wrev-stat"><div class="wrev-val">${nnRate}%</div><div class="wrev-lbl">NN Hit</div></div>
      <div class="wrev-stat"><div class="wrev-val">${skillAvg}%</div><div class="wrev-lbl">Skill Avg</div></div>
      <div class="wrev-stat"><div class="wrev-val">${schedAvg}%</div><div class="wrev-lbl">Sched Done</div></div>
      <div class="wrev-stat"><div class="wrev-val">${moodEmoji}</div><div class="wrev-lbl">Mood ${moodAvg!=='—'?moodAvg:''}</div></div>
    </div>
    <div style="display:flex;gap:4px;align-items:flex-end;margin:10px 0 4px;padding:0 2px">${dayBars}</div>
    <div style="font-size:9px;color:#8892b0;text-align:center;margin-bottom:8px">Schedule completion per day (last 7 days)</div>
    <div class="wrev-hi">${hi}</div>
    <div style="font-size:11px;color:#8892b0;margin-top:8px;display:flex;flex-wrap:wrap;gap:8px">
      <span>${activeSkills} skill${activeSkills!==1?'s':''} active</span>
      <span>·</span>
      <span>${activeJobs} job${activeJobs!==1?'s':''} in pipeline</span>
      <span>·</span>
      <span>Day ${getJourneyDay(state.startDate, todayStr)}</span>
      ${bestDay&&bestDay.schedTotal>0?`<span>· Best day: <strong>${bestDay.dayName}</strong> (${Math.round(bestDay.doneCount/bestDay.schedTotal*100)}%)</span>`:''}
    </div>`;
}

function calcNNRate7() {
  const today=new Date(); let hit=0;
  for(let i=0;i<7;i++){
    const d=new Date(today); d.setDate(d.getDate()-i);
    const ds=d.toISOString().split('T')[0];
    const c=state.checks[ds]||{};
    if(state.nonNeg.every(n=>c[n.id])) hit++;
  }
  return Math.round((hit/7)*100);
}

function gitHubChartError(imgEl, user) {
  imgEl.parentElement.innerHTML = '<div style="padding:14px;color:#8892b0;font-size:12px;text-align:center">📡 Chart loads when online<br><a href="https://github.com/'+user+'" target="_blank" style="color:#6c47ff">View on GitHub →</a></div>';
}
export function renderGitHubWidget() {
  const el = document.getElementById('github-widget-card');
  if (!el) return;
  const user = localStorage.getItem('soma_github_user') || 'somasaic';
  const editing = window._ghEditing;
  el.innerHTML = `
    <div class="card-header">
      <div class="card-title">🐙 GITHUB CONTRIBUTIONS</div>
      <button class="card-action" onclick="window._ghEditing=!window._ghEditing;renderGitHubWidget()">✏️ ${editing?'Cancel':'Username'}</button>
    </div>
    ${editing ? `
    <div style="display:flex;gap:7px;align-items:center;margin-bottom:10px">
      <input class="sched-input" id="gh-user-input" value="${user}" placeholder="GitHub username" style="flex:1" />
      <button class="btn-sm" onclick="setGitHubUser()">Save</button>
    </div>` : ''}
    <div id="gh-chart-wrap" style="overflow-x:auto;background:#0d1117;border-radius:8px;padding:8px;min-height:60px">
      <img src="https://ghchart.rshah.org/${user}" alt="GitHub contributions chart"
        style="width:100%;display:block;min-height:40px"
        onerror="gitHubChartError(this,'${user}')" />
    </div>
    <div style="font-size:11px;color:#8892b0;margin-top:6px;text-align:center">
      <a href="https://github.com/${user}" target="_blank" style="color:#6c47ff">github.com/${user}</a>
    </div>`;
  if (editing) setTimeout(()=>{ const inp=document.getElementById('gh-user-input'); if(inp)inp.focus(); },50);
}
function setGitHubUser() {
  const inp = document.getElementById('gh-user-input');
  if (!inp || !inp.value.trim()) return;
  localStorage.setItem('soma_github_user', inp.value.trim());
  window._ghEditing = false;
  renderGitHubWidget();
}


function cycleWeekDayType(day) {
  const types=['full','exhausted','gap','interview','rest'];
  const cur=(state.weekPlan[day]||{type:'rest'}).type;
  const next=types[(types.indexOf(cur)+1)%types.length];
  if (!state.weekPlan[day]) state.weekPlan[day]={type:next,skill:''};
  else state.weekPlan[day].type=next;
  save(); renderWeekly();
}
function startWeekSkillEdit(day) {
  window._editingWeekDay=day; renderWeekly();
  setTimeout(()=>{ const el=document.getElementById('wskill-'+day); if(el){el.focus();el.select();} },50);
}
function cancelWeekSkillEdit() { window._editingWeekDay=null; renderWeekly(); }
function saveWeekSkill(day) {
  const el=document.getElementById('wskill-'+day);
  if (!el) return;
  if (!state.weekPlan[day]) state.weekPlan[day]={type:'full',skill:''};
  state.weekPlan[day].skill=el.value.trim();
  save(); window._editingWeekDay=null; renderWeekly();
}


// Bind to window for inline HTML handlers
window.renderWeekly = renderWeekly;
window.cycleWeekDayType = cycleWeekDayType;
window.startWeekSkillEdit = startWeekSkillEdit;
window.cancelWeekSkillEdit = cancelWeekSkillEdit;
window.saveWeekSkill = saveWeekSkill;
window.renderWeeklyReview = renderWeeklyReview;
window.renderGitHubWidget = renderGitHubWidget;
window.setGitHubUser = setGitHubUser;
window.gitHubChartError = gitHubChartError;
window.startGHEdit = () => { window._ghEditing = true; renderGitHubWidget(); };
window.cancelGHEdit = () => { window._ghEditing = false; renderGitHubWidget(); };
