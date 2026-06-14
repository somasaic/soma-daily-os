import { useState, useRef, useEffect } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { SKILLS_DATA, TIER_COLORS } from '../../../constants/dashboard'
import { Toast, useToast } from '../../shared/Toast'
import { uid } from '../../../utils/utils'
import { playAlarm } from '../../../utils/alarm'

const STATUS_OPTS = [
  { id: 'active', label: '▶ Active' },
  { id: 'paused', label: '⏸ Paused' },
  { id: 'done',   label: '✅ Done' },
]

export default function SkillsTab() {
  const { state, dispatch } = useDashboard()
  const { skills, qwExcluded } = state
  const { toast, toastMsg, toastShow } = useToast()

  // Local skill timers (running intervals)
  const [runningTimers, setRunningTimers] = useState({}) // id -> elapsed secs
  const [timerRunning, setTimerRunning] = useState({}) // id -> bool
  const intervalsRef = useRef({})

  // Custom skill form
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', note: '', tier: 'tier3', pct: 0 })

  // Edit skill inline
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    return () => Object.values(intervalsRef.current).forEach(clearInterval)
  }, [])

  function toggleTimer(id) {
    if (timerRunning[id]) {
      clearInterval(intervalsRef.current[id])
      delete intervalsRef.current[id]
      setTimerRunning(t => ({ ...t, [id]: false }))
      // Save elapsed to state
      const elapsed = runningTimers[id] || 0
      const skill = skills[id] || {}
      dispatch({ type: 'UPDATE_SKILL', id, payload: { timer: (skill.timer || 0) + elapsed } })
      setRunningTimers(t => ({ ...t, [id]: 0 }))
    } else {
      setTimerRunning(t => ({ ...t, [id]: true }))
      setRunningTimers(t => ({ ...t, [id]: 0 }))
      intervalsRef.current[id] = setInterval(() => {
        setRunningTimers(t => ({ ...t, [id]: (t[id] || 0) + 1 }))
      }, 1000)
    }
  }

  function formatTimer(secs) {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h}h ${m}m`
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function addCustomSkill() {
    if (!form.name.trim()) return
    const id = 'custom_' + uid()
    dispatch({ type: 'ADD_CUSTOM_SKILL', payload: { id, ...form, pct: parseInt(form.pct) || 0 } })
    setForm({ name: '', note: '', tier: 'tier3', pct: 0 })
    setShowForm(false)
    toast('Skill added!')
  }

  function updatePct(id, delta) {
    const skill = skills[id] || { pct: 0 }
    const newPct = Math.max(0, Math.min(100, (skill.pct || 0) + delta))
    dispatch({ type: 'UPDATE_SKILL', id, payload: { pct: newPct } })
  }

  // Build full list including custom skills
  const allTiers = [...SKILLS_DATA]
  const customSkills = Object.entries(skills)
    .filter(([id, s]) => s.custom)
    .map(([id, s]) => ({ id, ...s }))

  // Group custom skills by tier
  const customByTier = {}
  customSkills.forEach(s => {
    if (!customByTier[s.tier]) customByTier[s.tier] = []
    customByTier[s.tier].push(s)
  })

  const totalStudyMins = Object.values(skills).reduce((sum, s) => sum + Math.floor((s.timer || 0) / 60), 0)

  return (
    <div>
      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-val">{Object.values(skills).filter(s => s.status === 'active').length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{Math.round(Object.values(skills).reduce((s, sk) => s + (sk.pct || 0), 0) / Math.max(1, Object.keys(skills).length))}<span style={{ fontSize: 12 }}>%</span></div>
          <div className="stat-label">Avg Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{Math.floor(totalStudyMins / 60)}h{totalStudyMins % 60 > 0 ? ` ${totalStudyMins % 60}m` : ''}</div>
          <div className="stat-label">Total Study</div>
        </div>
      </div>

      {allTiers.map(tier => {
        const color = TIER_COLORS[tier.tier] || 'var(--p)'
        const extra = customByTier[tier.tier] || []
        const allSkills = [
          ...tier.skills.map(s => ({ ...s, ...(skills[s.id] || { pct: s.def, status: 'active', timer: 0 }) })),
          ...extra.map(s => ({ ...s, ...skills[s.id] })),
        ]

        return (
          <div key={tier.tier} className="card">
            <div className="tier-header" style={{ borderBottomColor: color, color }}>
              <div className="tier-left">
                <span className="tier-dot" style={{ background: color }} />
                {tier.name}
              </div>
              <span style={{ fontSize: 10, color: 'var(--sub)' }}>{allSkills.length} skills</span>
            </div>

            {allSkills.map(s => {
              const sk = skills[s.id] || { pct: s.def || 0, status: 'active', timer: 0 }
              const running = timerRunning[s.id]
              const elapsed = (runningTimers[s.id] || 0)
              const totalSecs = (sk.timer || 0) + elapsed
              const isEditing = editId === s.id

              return (
                <div key={s.id} className="skill-item">
                  <div className="skill-name-row">
                    {isEditing ? (
                      <div style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <input
                          className="form-input"
                          value={editData.name}
                          autoFocus
                          onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                          placeholder="Skill name"
                          style={{ flex: 1 }}
                        />
                        <input
                          className="form-input"
                          value={editData.note}
                          onChange={e => setEditData(d => ({ ...d, note: e.target.value }))}
                          placeholder="Note"
                          style={{ flex: 1 }}
                        />
                        <button className="btn-sm" onClick={() => {
                          dispatch({ type: 'UPDATE_SKILL', id: s.id, payload: { ...editData } })
                          setEditId(null)
                        }}>Save</button>
                        <button className="btn-sm-ghost" onClick={() => setEditId(null)}>×</button>
                      </div>
                    ) : (
                      <>
                        <span className="skill-name">{s.custom ? sk.name || s.name : s.name}</span>
                        <div className="skill-edit-btns">
                          <button className="icon-btn" onClick={() => {
                            setEditId(s.id)
                            setEditData({ name: sk.name || s.name, note: sk.note || s.note || '' })
                          }} title="Edit">✏️</button>
                        </div>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <>
                      {(sk.note || s.note) && <div className="skill-note">{sk.note || s.note}</div>}
                      <div className="skill-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${sk.pct || 0}%`, background: color }} />
                        </div>
                        <span className="progress-pct" style={{ color }}>{sk.pct || 0}%</span>
                      </div>
                      <div className="skill-controls">
                        {STATUS_OPTS.map(opt => (
                          <button
                            key={opt.id}
                            className={`skill-btn${sk.status === opt.id ? ` btn-${opt.id}` : ''}`}
                            onClick={() => dispatch({ type: 'UPDATE_SKILL', id: s.id, payload: { status: opt.id } })}
                          >
                            {opt.label}
                          </button>
                        ))}
                        <button className="skill-btn" onClick={() => updatePct(s.id, -5)}>−5%</button>
                        <button className="skill-btn" onClick={() => updatePct(s.id, 5)}>+5%</button>
                      </div>
                      <div className="timer-row">
                        <button
                          className={`tbtn${running ? ' trun' : ''}`}
                          onClick={() => toggleTimer(s.id)}
                        >
                          {running ? `⏸ ${formatTimer(elapsed)}` : '▶ Timer'}
                        </button>
                        <span className="tdisp">Total: {formatTimer(totalSecs)}</span>
                        {totalSecs > 0 && (
                          <button className="tbtn" onClick={() => dispatch({ type: 'UPDATE_SKILL', id: s.id, payload: { timer: 0 } })} style={{ opacity: .5 }}>↺</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Add Custom Skill */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Add Custom Skill</span>
          <button className="card-action" onClick={() => setShowForm(s => !s)}>
            {showForm ? '−' : '+'}
          </button>
        </div>

        {showForm && (
          <div className="add-skill-section">
            <div className="skill-form-row">
              <label>Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Skill name" />
            </div>
            <div className="skill-form-row">
              <label>Note</label>
              <input className="form-input" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Short description" />
            </div>
            <div className="skill-form-row">
              <label>Tier</label>
              <select className="form-select" value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}>
                {SKILLS_DATA.map(t => <option key={t.tier} value={t.tier}>{t.name}</option>)}
              </select>
            </div>
            <div className="skill-form-row">
              <label>Level %</label>
              <input type="number" min="0" max="100" className="form-input" value={form.pct} onChange={e => setForm(f => ({ ...f, pct: e.target.value }))} style={{ width: 80 }} />
            </div>
            <div className="form-btns">
              <button className="btn-sm" onClick={addCustomSkill}>Add Skill</button>
              <button className="btn-sm-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
