import { useState } from 'react'
import { useDashboard } from '../../store/DashboardContext'
import { todayStr } from '../../utils/utils'

const STREAK_PLANS = [
  { label: '7 Day', days: 7 },
  { label: '21 Day', days: 21 },
  { label: '30 Day', days: 30 },
  { label: '66 Day', days: 66 },
  { label: '100 Day', days: 100 },
]

export default function StreakPanel({ open }) {
  const { state, dispatch } = useDashboard()
  const { streakCount, streakDate, streakPlan, streakPlanDays, journeyStart } = state
  const [manualVal, setManualVal] = useState('')

  const today = todayStr()
  const alreadyMarked = streakDate === today

  function markToday() {
    if (alreadyMarked) return
    const newCount = streakCount + 1
    dispatch({ type: 'UPDATE_STREAK', payload: { streakCount: newCount, streakDate: today } })
  }

  function resetStreak() {
    if (!window.confirm('Reset streak to 0?')) return
    dispatch({ type: 'UPDATE_STREAK', payload: { streakCount: 0, streakDate: null } })
  }

  function setManual() {
    const v = parseInt(manualVal, 10)
    if (!isNaN(v) && v >= 0) {
      dispatch({ type: 'UPDATE_STREAK', payload: { streakCount: v, streakDate: today } })
      setManualVal('')
    }
  }

  function setPlan(plan, days) {
    dispatch({ type: 'SET_STREAK_PLAN', plan, days })
  }

  function setJourneyStart() {
    const d = window.prompt('Enter journey start date (YYYY-MM-DD):', journeyStart || today)
    if (d) dispatch({ type: 'SET_JOURNEY_START', payload: d })
  }

  const pct = streakPlanDays ? Math.min(100, Math.round((streakCount / streakPlanDays) * 100)) : 0

  return (
    <div className={`streak-panel${open ? ' open' : ''}`}>
      <div className="sp-label">Streak Management</div>

      <div className="sp-plan-row">
        {STREAK_PLANS.map(p => (
          <button
            key={p.label}
            className={`sp-plan-btn${streakPlan === p.label ? ' sp-active' : ''}`}
            onClick={() => setPlan(p.label, p.days)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="sp-input-row">
        <input
          className="sp-input"
          type="number"
          min="0"
          placeholder="Set streak manually…"
          value={manualVal}
          onChange={e => setManualVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setManual()}
          style={{ width: 160 }}
        />
        <button className="sp-btn sp-btn-purple" onClick={setManual}>Set</button>
        <button
          className="sp-btn sp-btn-purple"
          onClick={markToday}
          disabled={alreadyMarked}
          style={alreadyMarked ? { opacity: .5 } : {}}
        >
          {alreadyMarked ? '✓ Marked' : '+ Mark Today'}
        </button>
        <button className="sp-btn sp-btn-red" onClick={resetStreak}>Reset</button>
        <button className="sp-btn" onClick={setJourneyStart} style={{ background: 'var(--light)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          📅 Journey Start
        </button>
      </div>

      {streakPlanDays > 0 && (
        <div className="sp-progress">
          <div className="sp-progress-bar">
            <div className="sp-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="sp-progress-label">{streakCount} / {streakPlanDays} days ({pct}%)</div>
        </div>
      )}
    </div>
  )
}
