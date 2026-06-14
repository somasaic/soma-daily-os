/**
 * Generic load from localStorage with default fallback.
 */
export function getLocalItem(key, defaultValue = null) {
  const val = localStorage.getItem(key);
  if (val === null) return defaultValue;
  try {
    return JSON.parse(val);
  } catch (e) {
    return val; // fallback for string values
  }
}

/**
 * Generic save to localStorage with JSON serialization.
 */
export function setLocalItem(key, value) {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
}

/**
 * Loads the main dashboard state.
 */
export function loadDashboardState(defaultNonNeg, defaultWeekPlan) {
  const todayStr = new Date().toISOString().split('T')[0];
  return {
    dayType:           localStorage.getItem('soma_day_type')     || 'full',
    streak:            parseInt(localStorage.getItem('soma_streak') || '0'),
    lastDate:          localStorage.getItem('soma_last_date')    || '',
    startDate:         localStorage.getItem('soma_start_date')   || todayStr,
    skills:            getLocalItem('soma_skills', {}),
    skillStatus:       getLocalItem('soma_skill_status', {}),
    skillEdits:        getLocalItem('soma_skill_edits', {}),
    customSkills:      getLocalItem('soma_custom_skills', []),
    checks:            getLocalItem('soma_checks', {}),
    weekPlan:          getLocalItem('soma_week_plan', defaultWeekPlan),
    logs:              getLocalItem('soma_logs', []),
    notes:             getLocalItem('soma_notes', []),
    customSchedule:    getLocalItem('soma_custom_schedule', {}),
    customDaySchedule: getLocalItem('soma_custom_day_sched', {}),
    pendings:          getLocalItem('soma_pendings', []),
    nonNeg:            getLocalItem('soma_nonneg', defaultNonNeg),
    streakTarget:      parseInt(localStorage.getItem('soma_streak_target') || '0'),
    streakTargetLabel: localStorage.getItem('soma_streak_target_label')    || '',
    jobs:              getLocalItem('soma_jobs', []),
    starBank:          getLocalItem('soma_star_bank', []),
    moods:             getLocalItem('soma_moods', {}),
    schedDone:         getLocalItem('soma_sched_done', {}),
  };
}

/**
 * Saves the main dashboard state.
 */
export function saveDashboardState(state) {
  localStorage.setItem('soma_day_type',       state.dayType);
  localStorage.setItem('soma_streak',         state.streak);
  localStorage.setItem('soma_last_date',      state.lastDate);
  localStorage.setItem('soma_start_date',     state.startDate);
  setLocalItem('soma_skills',                 state.skills);
  setLocalItem('soma_skill_status',           state.skillStatus);
  setLocalItem('soma_skill_edits',            state.skillEdits);
  setLocalItem('soma_custom_skills',          state.customSkills);
  setLocalItem('soma_checks',                 state.checks);
  setLocalItem('soma_week_plan',              state.weekPlan);
  setLocalItem('soma_logs',                   state.logs);
  setLocalItem('soma_notes',                  state.notes);
  setLocalItem('soma_custom_schedule',        state.customSchedule);
  setLocalItem('soma_custom_day_sched',       state.customDaySchedule);
  setLocalItem('soma_pendings',               state.pendings);
  setLocalItem('soma_nonneg',                 state.nonNeg);
  localStorage.setItem('soma_streak_target',  state.streakTarget);
  localStorage.setItem('soma_streak_target_label', state.streakTargetLabel);
  setLocalItem('soma_jobs',                   state.jobs);
  setLocalItem('soma_star_bank',              state.starBank);
  setLocalItem('soma_moods',                  state.moods);
  setLocalItem('soma_sched_done',             state.schedDone);
}

/**
 * Loads the Learn & Prep sub-dashboard state.
 */
export function loadLearnPrepState() {
  return {
    sessions:       getLocalItem('slp_sessions', []),
    companies:      getLocalItem('slp_companies', []),
    postInterviews: getLocalItem('slp_postinterview', []),
  };
}

/**
 * Saves the Learn & Prep sub-dashboard state.
 */
export function saveLearnPrepState(state) {
  setLocalItem('slp_sessions',      state.sessions);
  setLocalItem('slp_companies',     state.companies);
  setLocalItem('slp_postinterview', state.postInterviews);
}

/**
 * Exports all storage items matching the namespace prefix as a JSON file download.
 */
export function exportAllData(prefix, filename) {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) {
      data[k] = localStorage.getItem(k);
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Imports JSON data into localStorage, replacing existing records under the namespace.
 */
export function importAllData(file, onComplete, onError) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(k => {
        localStorage.setItem(k, data[k]);
      });
      onComplete();
    } catch (err) {
      onError(err);
    }
  };
  reader.readAsText(file);
}
