import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { loadDashboard, saveDashboard, getDark, setDark } from '../utils/storage'
import { uid, todayStr, getCurrentDayKey } from '../utils/utils'
import {
  SKILLS_DATA, DEFAULT_NON_NEG, DEFAULT_WEEK_PLAN,
  DEFAULT_SCHEDULES, DEFAULT_DAY_SCHEDULES, HUNT_SEED
} from '../constants/dashboard'

// ── Build initial skills map from SKILLS_DATA ────────────────────────────────
function buildDefaultSkills() {
  const skills = {}
  SKILLS_DATA.forEach(tier => {
    tier.skills.forEach(s => {
      skills[s.id] = { pct: s.def, status: 'active', timer: 0, timerDate: null }
    })
  })
  return skills
}

function getInitialState() {
  const saved = loadDashboard()
  const dark = getDark()
  const base = {
    appTitle: "Soma's Daily OS",
    darkMode: dark,
    streakCount: 0,
    streakDate: null,
    streakPlan: null,
    streakPlanDays: 0,
    journeyStart: null,
    dayType: 'full',
    moods: {},
    nonNeg: DEFAULT_NON_NEG.map(n => ({ ...n, done: false })),
    pendings: [],
    ideas: [],
    skills: buildDefaultSkills(),
    qwExcluded: [],
    schedule: {},
    scheduleTimers: {},
    scheduleDone: {},
    notes: [],
    logs: [],
    jobs: [],
    starBank: [],
    weekPlan: { ...DEFAULT_WEEK_PLAN },
    huntApps: [...HUNT_SEED],
    focusPlaylist: null,
    githubUsername: 'somasaic',
    reflections: {},
  }
  if (!saved) return base
  // Merge saved over base (handles missing keys from old saves)
  return {
    ...base,
    ...saved,
    darkMode: dark,
    // Ensure huntApps seeds if empty
    huntApps: (saved.huntApps && saved.huntApps.length) ? saved.huntApps : [...HUNT_SEED],
    // Ensure nonNeg has default if empty
    nonNeg: (saved.nonNeg && saved.nonNeg.length) ? saved.nonNeg : DEFAULT_NON_NEG.map(n => ({ ...n, done: false })),
    skills: saved.skills ? { ...buildDefaultSkills(), ...saved.skills } : buildDefaultSkills(),
  }
}

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // APP META
    case 'SET_TITLE': return { ...state, appTitle: action.payload }
    case 'SET_DARK': return { ...state, darkMode: action.payload }
    case 'SET_DAY_TYPE': return { ...state, dayType: action.payload }

    // STREAK
    case 'UPDATE_STREAK': return { ...state, ...action.payload }
    case 'SET_STREAK_PLAN': return { ...state, streakPlan: action.plan, streakPlanDays: action.days }
    case 'SET_JOURNEY_START': return { ...state, journeyStart: action.payload }

    // MOOD
    case 'SET_MOOD': {
      const day = todayStr()
      return { ...state, moods: { ...state.moods, [day]: action.payload } }
    }

    // NON-NEGOTIABLES
    case 'TOGGLE_NN': {
      const nonNeg = state.nonNeg.map(n => n.id === action.id ? { ...n, done: !n.done } : n)
      return { ...state, nonNeg }
    }
    case 'ADD_NN': {
      const nonNeg = [...state.nonNeg, { id: uid(), label: action.payload, done: false }]
      return { ...state, nonNeg }
    }
    case 'DELETE_NN': {
      const nonNeg = state.nonNeg.filter(n => n.id !== action.id)
      return { ...state, nonNeg }
    }
    case 'UPDATE_NN': {
      const nonNeg = state.nonNeg.map(n => n.id === action.id ? { ...n, label: action.label } : n)
      return { ...state, nonNeg }
    }
    case 'RESET_NN': {
      return { ...state, nonNeg: DEFAULT_NON_NEG.map(n => ({ ...n, done: false })) }
    }

    // PENDINGS
    case 'ADD_PENDING': {
      const pendings = [...state.pendings, { id: uid(), text: action.payload, done: false, date: todayStr(), from: null }]
      return { ...state, pendings }
    }
    case 'TOGGLE_PENDING': {
      const pendings = state.pendings.map(p => p.id === action.id ? { ...p, done: !p.done } : p)
      return { ...state, pendings }
    }
    case 'DELETE_PENDING': {
      const pendings = state.pendings.filter(p => p.id !== action.id)
      return { ...state, pendings }
    }
    case 'UPDATE_PENDING': {
      const pendings = state.pendings.map(p => p.id === action.id ? { ...p, text: action.text } : p)
      return { ...state, pendings }
    }
    case 'CLEAR_DONE_PENDINGS': {
      const pendings = state.pendings.filter(p => !p.done)
      return { ...state, pendings }
    }

    // IDEAS (PARK IDEAS)
    case 'ADD_IDEA': {
      const ideas = [{ id: uid(), ...action.payload, date: todayStr() }, ...state.ideas]
      return { ...state, ideas }
    }
    case 'DELETE_IDEA': {
      const ideas = state.ideas.filter(i => i.id !== action.id)
      return { ...state, ideas }
    }
    case 'UPDATE_IDEA': {
      const ideas = state.ideas.map(i => i.id === action.id ? { ...i, ...action.payload } : i)
      return { ...state, ideas }
    }

    // SKILLS
    case 'UPDATE_SKILL': {
      const skills = { ...state.skills, [action.id]: { ...state.skills[action.id], ...action.payload } }
      return { ...state, skills }
    }
    case 'ADD_CUSTOM_SKILL': {
      const { id, name, note, tier, pct } = action.payload
      const skills = { ...state.skills, [id]: { pct, status: 'active', timer: 0, timerDate: null, custom: true, name, note, tier } }
      return { ...state, skills }
    }
    case 'TOGGLE_QW_EXCLUDED': {
      const qwExcluded = state.qwExcluded.includes(action.id)
        ? state.qwExcluded.filter(x => x !== action.id)
        : [...state.qwExcluded, action.id]
      return { ...state, qwExcluded }
    }

    // SCHEDULE
    case 'UPDATE_SCHEDULE': {
      const schedule = { ...state.schedule, [action.dayKey]: action.slots }
      return { ...state, schedule }
    }
    case 'SET_SCHEDULE_TIMER': {
      const scheduleTimers = { ...state.scheduleTimers, [action.key]: action.minutes }
      return { ...state, scheduleTimers }
    }
    case 'TOGGLE_SCHEDULE_DONE': {
      const day = action.date || todayStr()
      const dayDone = { ...(state.scheduleDone[day] || {}) }
      dayDone[action.index] = !dayDone[action.index]
      const scheduleDone = { ...state.scheduleDone, [day]: dayDone }
      return { ...state, scheduleDone }
    }

    // NOTES
    case 'ADD_NOTE': {
      const notes = [{ id: uid(), ...action.payload, date: todayStr(), pinned: false }, ...state.notes]
      return { ...state, notes }
    }
    case 'DELETE_NOTE': {
      const notes = state.notes.filter(n => n.id !== action.id)
      return { ...state, notes }
    }
    case 'UPDATE_NOTE': {
      const notes = state.notes.map(n => n.id === action.id ? { ...n, ...action.payload } : n)
      return { ...state, notes }
    }
    case 'TOGGLE_PIN_NOTE': {
      const notes = state.notes.map(n => n.id === action.id ? { ...n, pinned: !n.pinned } : n)
      return { ...state, notes }
    }

    // LOGS
    case 'ADD_LOG': {
      const logs = [{ id: uid(), text: action.payload, date: todayStr() }, ...state.logs]
      return { ...state, logs }
    }
    case 'DELETE_LOG': {
      const logs = state.logs.filter(l => l.id !== action.id)
      return { ...state, logs }
    }
    case 'UPDATE_LOG': {
      const logs = state.logs.map(l => l.id === action.id ? { ...l, text: action.text } : l)
      return { ...state, logs }
    }

    // JOBS (KANBAN)
    case 'ADD_JOB': {
      const jobs = [{ id: uid(), ...action.payload, date: todayStr() }, ...state.jobs]
      return { ...state, jobs }
    }
    case 'DELETE_JOB': {
      const jobs = state.jobs.filter(j => j.id !== action.id)
      return { ...state, jobs }
    }
    case 'UPDATE_JOB': {
      const jobs = state.jobs.map(j => j.id === action.id ? { ...j, ...action.payload } : j)
      return { ...state, jobs }
    }
    case 'MOVE_JOB': {
      const jobs = state.jobs.map(j => j.id === action.id ? { ...j, status: action.status } : j)
      return { ...state, jobs }
    }

    // STAR BANK
    case 'ADD_STAR': {
      const starBank = [{ id: uid(), ...action.payload, date: todayStr() }, ...state.starBank]
      return { ...state, starBank }
    }
    case 'DELETE_STAR': {
      const starBank = state.starBank.filter(s => s.id !== action.id)
      return { ...state, starBank }
    }
    case 'UPDATE_STAR': {
      const starBank = state.starBank.map(s => s.id === action.id ? { ...s, ...action.payload } : s)
      return { ...state, starBank }
    }

    // WEEKLY
    case 'SET_WEEK_PLAN': {
      const weekPlan = { ...state.weekPlan, [action.day]: { ...state.weekPlan[action.day], ...action.payload } }
      return { ...state, weekPlan }
    }

    // HUNT
    case 'ADD_HUNT': {
      const huntApps = [{ id: uid(), ...action.payload }, ...state.huntApps]
      return { ...state, huntApps }
    }
    case 'DELETE_HUNT': {
      const huntApps = state.huntApps.filter(h => h.id !== action.id)
      return { ...state, huntApps }
    }
    case 'UPDATE_HUNT': {
      const huntApps = state.huntApps.map(h => h.id === action.id ? { ...h, ...action.payload } : h)
      return { ...state, huntApps }
    }

    // FOCUS MUSIC
    case 'SET_PLAYLIST': return { ...state, focusPlaylist: action.payload }

    // GITHUB
    case 'SET_GITHUB': return { ...state, githubUsername: action.payload }

    // REFLECTIONS
    case 'SAVE_REFLECTION': {
      const day = todayStr()
      const reflections = { ...state.reflections, [day]: action.payload }
      return { ...state, reflections }
    }

    // IMPORT
    case 'IMPORT': return { ...action.payload, darkMode: state.darkMode }

    default: return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)

  // Persist on every state change
  useEffect(() => {
    saveDashboard(state)
  }, [state])

  // Apply dark mode to <html> attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light')
    setDark(state.darkMode)
  }, [state.darkMode])

  // Carry forward undone pendings from previous days
  useEffect(() => {
    const today = todayStr()
    const hasOld = state.pendings.some(p => !p.done && p.date && p.date < today && !p.from)
    if (hasOld) {
      const updated = state.pendings.map(p =>
        (!p.done && p.date && p.date < today && !p.from)
          ? { ...p, from: p.date, date: today }
          : p
      )
      dispatch({ type: 'IMPORT', payload: { ...state, pendings: updated } })
    }
  }, [])

  const value = { state, dispatch }
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be inside DashboardProvider')
  return ctx
}
