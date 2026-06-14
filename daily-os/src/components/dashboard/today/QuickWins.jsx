import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { SKILLS_DATA } from '../../../constants/dashboard'
import { todayStr } from '../../../utils/utils'

// Build a flat list of all skill chips
const ALL_CHIPS = [
  ...SKILLS_DATA.flatMap(t => t.skills.map(s => ({ id: s.id, label: s.name.split(' — ')[0].split(' — ')[0].split(' (')[0], tier: t.tier }))),
  { id: 'github', label: '📤 GitHub Push', tier: 'habit' },
  { id: 'linkedin', label: '💼 LinkedIn', tier: 'habit' },
  { id: 'job_apply', label: '🎯 Job Applied', tier: 'habit' },
  { id: 'exercise', label: '🏃 Exercise', tier: 'habit' },
  { id: 'leetcode', label: '🧠 LeetCode', tier: 'habit' },
]

export default function QuickWins() {
  const { state, dispatch } = useDashboard()
  const { qwExcluded } = state
  const [tapped, setTapped] = useState({}) // id -> count

  const today = todayStr()
  const visible = ALL_CHIPS.filter(c => !qwExcluded.includes(c.id))

  function tap(id) {
    setTapped(t => ({ ...t, [id]: (t[id] || 0) + 1 }))
  }

  const totalTaps = Object.values(tapped).reduce((a, b) => a + b, 0)

  const tierColors = { tier1:'#ef4444', tier2:'#f97316', tier3:'#f59e0b', tier4:'#6c47ff', tier5:'#22c55e', habit:'#3b82f6' }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Quick Wins Today</span>
        {totalTaps > 0 && (
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--g)' }}>⚡ {totalTaps} action{totalTaps !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div className="qw-grid">
        {visible.map(chip => {
          const count = tapped[chip.id] || 0
          const color = tierColors[chip.tier] || 'var(--p)'
          return (
            <button
              key={chip.id}
              className={`qw-chip${count > 0 ? ' tapped' : ''}`}
              style={count > 0 ? { background: color } : {}}
              onClick={() => tap(chip.id)}
              onContextMenu={e => { e.preventDefault(); dispatch({ type: 'TOGGLE_QW_EXCLUDED', id: chip.id }) }}
              title="Right-click to hide"
            >
              {chip.label}
              {count > 1 && <span className="tap-count">×{count}</span>}
            </button>
          )
        })}
      </div>

      {qwExcluded.length > 0 && (
        <div className="qw-note">
          {qwExcluded.length} hidden · right-click any chip to hide/show
        </div>
      )}
      {qwExcluded.length === 0 && (
        <div className="qw-note">Right-click any chip to hide it</div>
      )}

      {qwExcluded.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--sub)', marginRight: 6 }}>Hidden:</span>
          {qwExcluded.map(id => {
            const chip = ALL_CHIPS.find(c => c.id === id)
            return chip ? (
              <span
                key={id}
                className="idea-tag"
                style={{ marginBottom: 4 }}
                onClick={() => dispatch({ type: 'TOGGLE_QW_EXCLUDED', id })}
              >
                + {chip.label}
              </span>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
