import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../../store/DashboardContext'

export default function Header({ onStreakClick }) {
  const { state, dispatch } = useDashboard()
  const { appTitle, darkMode, streakCount, streakPlan, journeyStart } = state
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(appTitle)

  const today = new Date()
  const journeyDay = journeyStart
    ? Math.floor((today - new Date(journeyStart)) / 86400000) + 1
    : null

  const planLabel = streakPlan ? ` · ${streakPlan}` : ''
  const planBadge = streakPlanDays(state)

  function saveTitle() {
    if (titleDraft.trim()) dispatch({ type: 'SET_TITLE', payload: titleDraft.trim() })
    setEditing(false)
  }

  function toggleDark() {
    dispatch({ type: 'SET_DARK', payload: !darkMode })
  }

  return (
    <div className="header">
      <div>
        {editing ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={e => { if (e.key === 'Enter') saveTitle() }}
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 6, color: 'white', padding: '3px 8px', fontSize: 17, fontWeight: 800, width: 200 }}
          />
        ) : (
          <h1 onClick={() => { setTitleDraft(appTitle); setEditing(true) }} style={{ cursor: 'pointer' }}>
            {appTitle}
          </h1>
        )}
        <div className="header-sub">
          {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          {journeyDay ? ` · Day ${journeyDay}${planLabel}` : ''}
        </div>
      </div>
      <div className="header-right">
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button className="header-nav-btn" onClick={toggleDark} title="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <Link to="/learn-prep" className="header-nav-btn">
            📚 Learn & Prep
          </Link>
        </div>
        <div
          className="streak-badge"
          onClick={onStreakClick}
          title="Click to manage streak"
        >
          🔥 {streakCount}{planBadge}
        </div>
        {journeyDay && (
          <div className="journey-day" style={{ fontSize: 10, opacity: .7, textAlign: 'right' }}>
            Journey day {journeyDay}
          </div>
        )}
      </div>
    </div>
  )
}

function streakPlanDays(state) {
  if (!state.streakPlan || !state.streakPlanDays) return ''
  return ` / ${state.streakPlanDays}`
}
