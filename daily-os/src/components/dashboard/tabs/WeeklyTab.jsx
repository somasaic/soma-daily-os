import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { WEEK_DAYS, DEFAULT_WEEK_PLAN } from '../../../constants/dashboard'
import { getWeekDates } from '../../../utils/utils'
import { Toast, useToast } from '../../shared/Toast'

const DAY_TYPE_CHIPS = {
  full:      { cls: 'chip-full',      emoji: '💪', label: 'Full' },
  exhausted: { cls: 'chip-exhausted', emoji: '😴', label: 'Exhausted' },
  gap:       { cls: 'chip-gap',       emoji: '✈️',  label: 'Gap' },
  interview: { cls: 'chip-interview', emoji: '🎤', label: 'Interview' },
  rest:      { cls: 'chip-rest',      emoji: '🛋️', label: 'Rest' },
}

const DAY_TYPE_OPTIONS = ['full','exhausted','gap','interview','rest']

export default function WeeklyTab() {
  const { state, dispatch } = useDashboard()
  const { weekPlan, skills, githubUsername } = state
  const { toast, toastMsg, toastShow } = useToast()
  const [editDay, setEditDay] = useState(null)
  const [editGh, setEditGh] = useState(false)
  const [ghDraft, setGhDraft] = useState(githubUsername || '')

  const weekDates = getWeekDates()
  const today = new Date().toISOString().split('T')[0]
  const todayName = WEEK_DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]

  // Weekly stats
  const doneCount = Object.values(weekPlan).filter(p => p.type !== 'rest').length
  const studyDays = Object.values(weekPlan).filter(p => p.type === 'full' || p.type === 'gap').length

  function updatePlan(day, field, val) {
    dispatch({ type: 'SET_WEEK_PLAN', day, payload: { [field]: val } })
  }

  function saveGithub() {
    dispatch({ type: 'SET_GITHUB', payload: ghDraft.trim() })
    setEditGh(false)
    toast('GitHub username saved!')
  }

  return (
    <div>
      {/* Week Grid */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">This Week</span>
          <span style={{ fontSize: 11, color: 'var(--sub)' }}>
            {weekDates[0]} – {weekDates[6]}
          </span>
        </div>
        <div className="week-grid">
          {WEEK_DAYS.map((d, i) => {
            const plan = weekPlan[d] || DEFAULT_WEEK_PLAN[d] || {}
            const chip = DAY_TYPE_CHIPS[plan.type] || DAY_TYPE_CHIPS.full
            const isToday = d === todayName
            return (
              <div
                key={d}
                className={`week-day${isToday ? ' today' : ''}`}
                onClick={() => setEditDay(editDay === d ? null : d)}
                title={plan.skill}
              >
                <div className="week-day-name">{d}</div>
                <div className="week-day-num">{weekDates[i]?.split('-')[2] || ''}</div>
                <div className="week-type-chip">{chip.emoji}</div>
              </div>
            )
          })}
        </div>
        <div className="week-hint">Click a day to edit its plan</div>

        {editDay && (
          <div className="card" style={{ marginTop: 10, background: 'var(--light)' }}>
            <div className="card-header">
              <span className="card-title">Edit {editDay}</span>
              <button className="icon-btn" onClick={() => setEditDay(null)}>×</button>
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
              {DAY_TYPE_OPTIONS.map(t => (
                <button
                  key={t}
                  className={`day-tab-btn${(weekPlan[editDay]?.type || DEFAULT_WEEK_PLAN[editDay]?.type) === t ? ' dtab-mode-active' : ''}`}
                  onClick={() => updatePlan(editDay, 'type', t)}
                >
                  {DAY_TYPE_CHIPS[t]?.emoji} {t}
                </button>
              ))}
            </div>
            <input
              className="form-input"
              placeholder="Focus skill / activity…"
              value={(weekPlan[editDay] || DEFAULT_WEEK_PLAN[editDay] || {}).skill || ''}
              onChange={e => updatePlan(editDay, 'skill', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Week Plan Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Week Plan</span>
        </div>
        {WEEK_DAYS.map(d => {
          const plan = weekPlan[d] || DEFAULT_WEEK_PLAN[d] || {}
          const chip = DAY_TYPE_CHIPS[plan.type] || DAY_TYPE_CHIPS.full
          return (
            <div key={d} className="week-plan-row">
              <span className="week-plan-day">{d}</span>
              <span className={`week-chip chip-${plan.type || 'full'}`}>{chip.emoji} {chip.label}</span>
              <span className="week-plan-skill">{plan.skill || '—'}</span>
            </div>
          )
        })}
      </div>

      {/* Weekly Review */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Weekly Review</span>
        </div>
        <div className="wrev-grid">
          <div className="wrev-stat">
            <div className="wrev-val">{studyDays}</div>
            <div className="wrev-lbl">Study Days</div>
          </div>
          <div className="wrev-stat">
            <div className="wrev-val">{Object.values(weekPlan).filter(p => p.type === 'interview').length}</div>
            <div className="wrev-lbl">Interviews</div>
          </div>
          <div className="wrev-stat">
            <div className="wrev-val">{Object.values(weekPlan).filter(p => p.type === 'rest').length}</div>
            <div className="wrev-lbl">Rest Days</div>
          </div>
        </div>
        <div className="wrev-hi">
          🎯 Focus this week: {weekPlan[todayName]?.skill || DEFAULT_WEEK_PLAN[todayName]?.skill || 'Set a skill focus above'}
        </div>
      </div>

      {/* GitHub Widget */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">GitHub Activity</span>
          <button className="card-action" onClick={() => { setGhDraft(githubUsername || ''); setEditGh(e => !e) }}>
            {editGh ? 'Cancel' : '✏️ Edit'}
          </button>
        </div>
        {editGh ? (
          <div style={{ display: 'flex', gap: 7 }}>
            <input
              className="form-input"
              placeholder="GitHub username…"
              value={ghDraft}
              onChange={e => setGhDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveGithub()}
            />
            <button className="btn-sm" onClick={saveGithub}>Save</button>
          </div>
        ) : githubUsername ? (
          <div>
            <p style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 10 }}>
              github.com/{githubUsername} · contribution graph
            </p>
            <img
              src={`https://ghchart.rshah.org/${githubUsername}`}
              alt="GitHub contributions"
              style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--sub)' }}>
            Enter your GitHub username to see your contribution chart.
          </p>
        )}
      </div>

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
