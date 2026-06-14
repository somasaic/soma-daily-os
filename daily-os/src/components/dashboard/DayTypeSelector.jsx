import { useDashboard } from '../../store/DashboardContext'

const DAY_TYPES = [
  { id: 'full',      emoji: '💪', label: 'Full Mode',       cls: 'active-full' },
  { id: 'exhausted', emoji: '😴', label: 'Exhausted Mode',  cls: 'active-exhausted' },
  { id: 'gap',       emoji: '🎯', label: 'Gap Day',         cls: 'active-gap' },
  { id: 'interview', emoji: '🎤', label: 'Interview Day',   cls: 'active-interview' },
  { id: 'rest',      emoji: '🛋️', label: 'Rest & Recharge', cls: 'active-rest' },
]

export default function DayTypeSelector() {
  const { state, dispatch } = useDashboard()
  const { dayType } = state

  return (
    <div className="day-type-section">
      <div className="day-type-label">Today's Mode</div>
      <div className="day-type-buttons">
        {DAY_TYPES.map(dt => (
          <button
            key={dt.id}
            className={`day-type-btn${dayType === dt.id ? ' ' + dt.cls : ''}`}
            onClick={() => dispatch({ type: 'SET_DAY_TYPE', payload: dt.id })}
          >
            {dt.emoji} {dt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
