import { useDashboard } from '../../../store/DashboardContext'
import { todayStr } from '../../../utils/utils'

const MOODS = [
  { val: 5, emoji: '🤩', label: 'Amazing' },
  { val: 4, emoji: '😊', label: 'Good' },
  { val: 3, emoji: '😐', label: 'Okay' },
  { val: 2, emoji: '😔', label: 'Low' },
  { val: 1, emoji: '😫', label: 'Rough' },
]

export default function MoodTracker() {
  const { state, dispatch } = useDashboard()
  const todayMood = state.moods[todayStr()]

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Mood Check-in</span>
        {todayMood && <span style={{ fontSize: 11, color: 'var(--sub)' }}>Logged ✓</span>}
      </div>
      <div className="mood-row">
        {MOODS.map(m => (
          <button
            key={m.val}
            className={`mood-btn${todayMood === m.val ? ' mood-sel' : ''}`}
            onClick={() => dispatch({ type: 'SET_MOOD', payload: m.val })}
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
        {todayMood && <span style={{ fontSize: 12, color: 'var(--sub)' }}>{MOODS.find(m => m.val === todayMood)?.label}</span>}
      </div>
    </div>
  )
}
