import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { SKILLS_DATA } from '../../../constants/dashboard'

const BUILTIN_CHIPS = [
  ...SKILLS_DATA.flatMap(t => t.skills.map(s => ({
    id: s.id,
    label: s.name.split(' — ')[0].split(' (')[0],
    tier: t.tier,
  }))),
  { id: 'github',    label: '📤 GitHub Push', tier: 'habit' },
  { id: 'linkedin',  label: '💼 LinkedIn',    tier: 'habit' },
  { id: 'job_apply', label: '🎯 Job Applied', tier: 'habit' },
  { id: 'exercise',  label: '🏃 Exercise',    tier: 'habit' },
  { id: 'leetcode',  label: '🧠 LeetCode',    tier: 'habit' },
]

const TIER_COLORS = {
  tier1: '#ef4444', tier2: '#f97316', tier3: '#f59e0b',
  tier4: '#6c47ff', tier5: '#22c55e', habit: '#3b82f6', custom: '#8b5cf6',
}

export default function QuickWins() {
  const { state, dispatch } = useDashboard()
  const { qwExcluded, qwCustomChips = [] } = state

  const [tapped, setTapped] = useState({})
  const [newLabel, setNewLabel] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const allChips = [
    ...BUILTIN_CHIPS,
    ...qwCustomChips.map(c => ({ ...c, tier: 'custom' })),
  ]
  const visible = allChips.filter(c => !qwExcluded.includes(c.id))
  const totalTaps = Object.values(tapped).reduce((a, b) => a + b, 0)

  function tap(id) {
    setTapped(t => ({ ...t, [id]: (t[id] || 0) + 1 }))
  }

  function resetCount(id, e) {
    e.stopPropagation()
    setTapped(t => { const n = { ...t }; delete n[id]; return n })
  }

  function addChip() {
    if (!newLabel.trim()) return
    dispatch({ type: 'ADD_QW_CHIP', payload: newLabel.trim() })
    setNewLabel('')
    setShowAdd(false)
  }

  function deleteChip(id, e) {
    e.stopPropagation()
    dispatch({ type: 'DELETE_QW_CHIP', id })
    setTapped(t => { const n = { ...t }; delete n[id]; return n })
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Quick Wins Today</span>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {totalTaps > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--g)' }}>
              ⚡ {totalTaps} action{totalTaps !== 1 ? 's' : ''}
            </span>
          )}
          <button className="card-action" onClick={() => setShowAdd(s => !s)}>
            {showAdd ? '−' : '+ Add'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottom: '1px dashed var(--border)' }}>
          <input
            className="pending-input"
            placeholder="New quick win chip…"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addChip()}
            autoFocus
            style={{ flex: 1 }}
          />
          <button className="btn-sm" onClick={addChip}>Add</button>
          <button className="btn-sm-ghost" onClick={() => setShowAdd(false)}>×</button>
        </div>
      )}

      <div className="qw-grid">
        {visible.map(chip => {
          const count = tapped[chip.id] || 0
          const color = TIER_COLORS[chip.tier] || 'var(--p)'
          const isCustom = qwCustomChips.some(c => c.id === chip.id)

          return (
            <div key={chip.id} className="qw-chip-wrap">
              <button
                className={`qw-chip${count > 0 ? ' tapped' : ''}`}
                style={count > 0 ? { background: color } : {}}
                onClick={() => tap(chip.id)}
                onContextMenu={e => { e.preventDefault(); dispatch({ type: 'TOGGLE_QW_EXCLUDED', id: chip.id }) }}
                title="Click to log · Right-click to hide"
              >
                {chip.label}
                {count > 0 && (
                  <span
                    className="tap-count"
                    title="Click to reset this count"
                    onClick={e => resetCount(chip.id, e)}
                  >
                    ×{count} ↺
                  </span>
                )}
              </button>
              {isCustom && (
                <button
                  className="qw-del-btn"
                  onClick={e => deleteChip(chip.id, e)}
                  title="Remove chip"
                >
                  ×
                </button>
              )}
            </div>
          )
        })}
      </div>

      {qwExcluded.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="qw-note" style={{ marginBottom: 5 }}>
            {qwExcluded.length} hidden · right-click any chip to hide/show
          </div>
          {qwExcluded.map(id => {
            const chip = allChips.find(c => c.id === id)
            return chip ? (
              <span
                key={id}
                className="idea-tag"
                style={{ marginRight: 4, marginBottom: 4 }}
                onClick={() => dispatch({ type: 'TOGGLE_QW_EXCLUDED', id })}
              >
                + {chip.label}
              </span>
            ) : null
          })}
        </div>
      )}
      {qwExcluded.length === 0 && (
        <div className="qw-note">Right-click any chip to hide it</div>
      )}
    </div>
  )
}
