import { createContext, useContext, useReducer, useEffect } from 'react'
import { loadLearnPrep, saveLearnPrep } from '../utils/storage'
import { uid } from '../utils/utils'
import { DEFAULT_QA } from '../constants/learnPrep'

function getInitialState() {
  const saved = loadLearnPrep()
  const base = { sessions: [], companies: [], postInterviewLogs: [] }
  if (!saved) return base
  return { ...base, ...saved }
}

function reducer(state, action) {
  switch (action.type) {

    // SESSIONS
    case 'ADD_SESSION': {
      const { date, heading, concepts, topics, skills } = action.payload
      const skillQA = {}
      skills.forEach(sk => {
        skillQA[sk] = (DEFAULT_QA[sk] || []).map((item, i) => ({
          id: 'qa_' + Date.now() + '_' + i,
          q: item.q,
          a: item.a,
          myAnswers: [],
          score: null,
        }))
      })
      const sess = { id: 'sess_' + Date.now(), date, heading, concepts, topics, skills, skillQA, createdAt: new Date().toISOString() }
      return { ...state, sessions: [sess, ...state.sessions] }
    }
    case 'DELETE_SESSION': {
      return { ...state, sessions: state.sessions.filter(s => s.id !== action.id) }
    }

    // Q&A within session
    case 'ADD_QA': {
      const sessions = state.sessions.map(s => {
        if (s.id !== action.sessId) return s
        const skillQA = { ...s.skillQA }
        if (!skillQA[action.skill]) skillQA[action.skill] = []
        skillQA[action.skill] = [...skillQA[action.skill], {
          id: 'qa_' + Date.now(),
          q: action.q,
          a: action.a || '',
          myAnswers: [],
          score: null,
        }]
        return { ...s, skillQA }
      })
      return { ...state, sessions }
    }
    case 'EDIT_QA': {
      const sessions = state.sessions.map(s => {
        if (s.id !== action.sessId) return s
        const skillQA = { ...s.skillQA }
        if (skillQA[action.skill]) {
          skillQA[action.skill] = skillQA[action.skill].map((qa, i) =>
            i === action.qi ? { ...qa, q: action.q, a: action.a } : qa
          )
        }
        return { ...s, skillQA }
      })
      return { ...state, sessions }
    }
    case 'DELETE_QA': {
      const sessions = state.sessions.map(s => {
        if (s.id !== action.sessId) return s
        const skillQA = { ...s.skillQA }
        if (skillQA[action.skill]) {
          skillQA[action.skill] = skillQA[action.skill].filter((_, i) => i !== action.qi)
        }
        return { ...s, skillQA }
      })
      return { ...state, sessions }
    }
    case 'SAVE_MY_ANSWER': {
      const sessions = state.sessions.map(s => {
        if (s.id !== action.sessId) return s
        const skillQA = { ...s.skillQA }
        if (skillQA[action.skill] && skillQA[action.skill][action.qi]) {
          const qa = { ...skillQA[action.skill][action.qi] }
          qa.myAnswers = [...(qa.myAnswers || []), { text: action.text, date: new Date().toLocaleDateString('en-IN') }]
          skillQA[action.skill] = skillQA[action.skill].map((q, i) => i === action.qi ? qa : q)
        }
        return { ...s, skillQA }
      })
      return { ...state, sessions }
    }
    case 'DELETE_MY_ANSWER': {
      const sessions = state.sessions.map(s => {
        if (s.id !== action.sessId) return s
        const skillQA = { ...s.skillQA }
        if (skillQA[action.skill] && skillQA[action.skill][action.qi]) {
          const qa = { ...skillQA[action.skill][action.qi] }
          qa.myAnswers = qa.myAnswers.filter((_, i) => i !== action.ai)
          skillQA[action.skill] = skillQA[action.skill].map((q, i) => i === action.qi ? qa : q)
        }
        return { ...s, skillQA }
      })
      return { ...state, sessions }
    }

    // COMPANIES (INTERVIEW PREP)
    case 'ADD_COMPANY': {
      const { name, role, date, stage } = action.payload
      const company = {
        id: 'co_' + Date.now(),
        name, role, date, stage,
        prepQA: {},
        createdAt: new Date().toISOString(),
      }
      return { ...state, companies: [company, ...state.companies] }
    }
    case 'DELETE_COMPANY': {
      return { ...state, companies: state.companies.filter(c => c.id !== action.id) }
    }
    case 'ADD_PREP_QA': {
      const companies = state.companies.map(c => {
        if (c.id !== action.compId) return c
        const prepQA = { ...c.prepQA }
        if (!prepQA[action.prepType]) prepQA[action.prepType] = []
        prepQA[action.prepType] = [...prepQA[action.prepType], {
          id: 'pqa_' + Date.now(),
          q: action.q,
          a: action.a || '',
          myAnswer: '',
          done: false,
        }]
        return { ...c, prepQA }
      })
      return { ...state, companies }
    }
    case 'UPDATE_PREP_QA': {
      const companies = state.companies.map(c => {
        if (c.id !== action.compId) return c
        const prepQA = { ...c.prepQA }
        if (prepQA[action.prepType]) {
          prepQA[action.prepType] = prepQA[action.prepType].map(q =>
            q.id === action.qaId ? { ...q, ...action.payload } : q
          )
        }
        return { ...c, prepQA }
      })
      return { ...state, companies }
    }

    // POST-INTERVIEW LOGS
    case 'ADD_POST_LOG': {
      const log = { id: uid(), text: action.payload, date: new Date().toISOString().split('T')[0] }
      return { ...state, postInterviewLogs: [log, ...state.postInterviewLogs] }
    }
    case 'DELETE_POST_LOG': {
      return { ...state, postInterviewLogs: state.postInterviewLogs.filter(l => l.id !== action.id) }
    }

    // IMPORT
    case 'IMPORT': return { ...action.payload }

    // CLEAR ALL
    case 'CLEAR_ALL': return { sessions: [], companies: [], postInterviewLogs: [] }

    default: return state
  }
}

const LearnPrepContext = createContext(null)

export function LearnPrepProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)

  useEffect(() => {
    saveLearnPrep(state)
  }, [state])

  return <LearnPrepContext.Provider value={{ state, dispatch }}>{children}</LearnPrepContext.Provider>
}

export function useLearnPrep() {
  const ctx = useContext(LearnPrepContext)
  if (!ctx) throw new Error('useLearnPrep must be inside LearnPrepProvider')
  return ctx
}
