import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { toggleVoiceInput } from '../../../utils/voice'

export default function NonNegotiables({ toast }) {
  const { state, dispatch } = useDashboard()
  const { nonNeg } = state
  const [newText, setNewText] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const inputRef = { current: null }

  const done = nonNeg.filter(n => n.done).length
  const total = nonNeg.length

  function add() {
    if (!newText.trim()) return
    dispatch({ type: 'ADD_NN', payload: newText.trim() })
    setNewText('')
  }

  function startEdit(n) {
    setEditId(n.id)
    setEditText(n.label)
  }

  function saveEdit(id) {
    if (editText.trim()) dispatch({ type: 'UPDATE_NN', id, label: editText.trim() })
    setEditId(null)
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Non-Negotiables</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: done === total ? 'var(--g)' : 'var(--sub)' }}>{done}/{total}</span>
          <button className="card-action" onClick={() => dispatch({ type: 'RESET_NN' })}>Reset</button>
        </div>
      </div>

      {nonNeg.map(n => (
        <div key={n.id}>
          {editId === n.id ? (
            <div className="pending-edit-row">
              <input
                className="pending-input"
                value={editText}
                autoFocus
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(n.id); if (e.key === 'Escape') setEditId(null) }}
              />
              <button className="btn-sm" onClick={() => saveEdit(n.id)}>Save</button>
              <button className="btn-sm-ghost" onClick={() => setEditId(null)}>Cancel</button>
            </div>
          ) : (
            <div className={`nn-item${n.done ? ' checked-item' : ''}`}>
              <div
                className={`nn-checkbox${n.done ? ' checked' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_NN', id: n.id })}
              >
                {n.done ? '✓' : ''}
              </div>
              <span className="nn-text" onClick={() => dispatch({ type: 'TOGGLE_NN', id: n.id })}>
                {n.label}
              </span>
              <div className="pending-actions">
                <button className="icon-btn" onClick={() => startEdit(n)}>✏️</button>
                <button className="icon-btn" onClick={() => dispatch({ type: 'DELETE_NN', id: n.id })}>🗑️</button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="pending-input-row">
        <div className="mic-wrap" style={{ flex: 1 }}>
          <input
            className="pending-input"
            placeholder="Add non-negotiable…"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            ref={el => { inputRef.current = el }}
          />
          <button
            className="mic-btn"
            onClick={e => toggleVoiceInput(inputRef, e.currentTarget, toast)}
          >🎤</button>
        </div>
        <button className="btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  )
}
