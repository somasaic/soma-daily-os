import { useState, useRef } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { STAR_CATEGORIES } from '../../../constants/dashboard'
import { toggleVoiceInput } from '../../../utils/voice'

export default function StarBank({ toast }) {
  const { state, dispatch } = useDashboard()
  const { starBank } = state
  const [cat, setCat] = useState('behavioral')
  const [q, setQ] = useState('')
  const [situation, setSituation] = useState('')
  const [task, setTask] = useState('')
  const [action, setAction] = useState('')
  const [result, setResult] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [expanded, setExpanded] = useState({})
  const sitRef = useRef(null)

  function add() {
    if (!q.trim()) return
    dispatch({
      type: 'ADD_STAR',
      payload: {
        category: cat, q,
        situation: situation.trim(),
        task: task.trim(),
        action: action.trim(),
        result: result.trim(),
      },
    })
    setQ(''); setSituation(''); setTask(''); setAction(''); setResult('')
    toast?.('STAR entry saved!')
  }

  function startEdit(s) {
    setEditId(s.id)
    setEditData({ q: s.q, situation: s.situation || '', task: s.task || '', action: s.action || '', result: s.result || '', category: s.category })
  }

  function saveEdit() {
    dispatch({ type: 'UPDATE_STAR', id: editId, payload: editData })
    setEditId(null)
    toast?.('Updated!')
  }

  const filtered = starBank.filter(s => filterCat === 'all' || s.category === filterCat)

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="card-header">
        <span className="card-title">STAR Prep Bank</span>
        <span style={{ fontSize: 11, color: 'var(--sub)' }}>{starBank.length} stories</span>
      </div>

      {/* Add form */}
      <div style={{ background: 'var(--light)', borderRadius: 10, padding: 12, marginBottom: 12, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
          {STAR_CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`spill${cat === c.id ? ' sel' : ''}`}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input style={{ width: '100%', marginBottom: 6, border: '1px solid var(--border)', borderRadius: 6, padding: '7px 10px', fontSize: 12, background: 'var(--card)', color: 'var(--text)' }} placeholder="Behavioral question / situation title…" value={q} onChange={e => setQ(e.target.value)} />
        {[['Situation', situation, setSituation, sitRef], ['Task', task, setTask, null], ['Action', action, setAction, null], ['Result', result, setResult, null]].map(([label, val, setter, ref]) => (
          <div key={label} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--sub)', marginBottom: 2 }}>{label.toUpperCase()}</div>
            <div className="mic-wrap">
              <textarea
                ref={ref}
                rows={2}
                style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 9px', fontSize: 12, background: 'var(--card)', color: 'var(--text)', resize: 'vertical', minHeight: 40 }}
                placeholder={`${label}…`}
                value={val}
                onChange={e => setter(e.target.value)}
              />
              {ref && (
                <button
                  className="mic-btn"
                  onClick={e => toggleVoiceInput(ref, { current: e.currentTarget }, toast)}
                >🎤</button>
              )}
            </div>
          </div>
        ))}
        <button className="btn-sm" onClick={add}>Add STAR Story</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
        <button className={`spill${filterCat === 'all' ? ' sel' : ''}`} onClick={() => setFilterCat('all')}>All</button>
        {STAR_CATEGORIES.map(c => (
          <button key={c.id} className={`spill${filterCat === c.id ? ' sel' : ''}`} onClick={() => setFilterCat(c.id)}>{c.label}</button>
        ))}
      </div>

      {filtered.length === 0 && <p className="empty-msg">No STAR stories yet.</p>}

      {filtered.map(s => {
        const open = expanded[s.id]
        return (
          <div key={s.id} className="star-entry">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <span className={`star-cat-chip star-cat-${s.category}`}>{STAR_CATEGORIES.find(c => c.id === s.category)?.label}</span>
                {editId === s.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
                    <input style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 12, background: 'var(--light)', color: 'var(--text)', width: '100%' }} value={editData.q} onChange={e => setEditData(d => ({ ...d, q: e.target.value }))} placeholder="Question" />
                    {['situation','task','action','result'].map(f => (
                      <textarea key={f} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 11, background: 'var(--light)', color: 'var(--text)', width: '100%', minHeight: 40, resize: 'vertical' }} value={editData[f] || ''} onChange={e => setEditData(d => ({ ...d, [f]: e.target.value }))} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} />
                    ))}
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn-sm" onClick={saveEdit}>Save</button>
                      <button className="btn-sm-ghost" onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="star-q" onClick={() => setExpanded(e => ({ ...e, [s.id]: !e[s.id] }))}>
                    {s.q}
                  </div>
                )}
              </div>
              {editId !== s.id && (
                <div style={{ display: 'flex', gap: 3 }}>
                  <button className="icon-btn" onClick={() => startEdit(s)}>✏️</button>
                  <button className="icon-btn" onClick={() => dispatch({ type: 'DELETE_STAR', id: s.id })}>🗑️</button>
                </div>
              )}
            </div>

            {open && editId !== s.id && (
              <div style={{ marginTop: 8 }}>
                {['situation','task','action','result'].map(f => s[f] ? (
                  <div key={f} style={{ marginBottom: 5 }}>
                    <div className="star-sat-label">{f.toUpperCase()}</div>
                    <div className="star-sat-text">{s[f]}</div>
                  </div>
                ) : null)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
