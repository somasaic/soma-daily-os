import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { toggleVoiceInput } from '../../../utils/voice'

export default function Pendings({ toast }) {
  const { state, dispatch } = useDashboard()
  const { pendings } = state
  const [newText, setNewText] = useState('')
  const pendingInputRef = { current: null }
  const [showDone, setShowDone] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  const undone = pendings.filter(p => !p.done)
  const done = pendings.filter(p => p.done)
  const carriedOver = undone.filter(p => p.from)

  function add() {
    if (!newText.trim()) return
    dispatch({ type: 'ADD_PENDING', payload: newText.trim() })
    setNewText('')
  }

  function startEdit(p) {
    setEditId(p.id)
    setEditText(p.text)
  }

  function saveEdit(id) {
    if (editText.trim()) dispatch({ type: 'UPDATE_PENDING', id, text: editText.trim() })
    setEditId(null)
  }

  function renderItem(p) {
    return (
      <div key={p.id} className="pending-item">
        <div
          className={`pending-check${p.done ? ' done' : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_PENDING', id: p.id })}
        >
          {p.done ? '✓' : ''}
        </div>
        <div className="pending-body">
          {editId === p.id ? (
            <div className="pending-edit-row">
              <input
                className="pending-input"
                value={editText}
                autoFocus
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(p.id); if (e.key === 'Escape') setEditId(null) }}
              />
              <button className="btn-sm" onClick={() => saveEdit(p.id)}>Save</button>
              <button className="btn-sm-ghost" onClick={() => setEditId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <div className={`pending-text${p.done ? ' done-text' : ''}`}>{p.text}</div>
              {p.from && <div className="pending-from">↩ Carried from {p.from}</div>}
            </>
          )}
        </div>
        {editId !== p.id && (
          <div className="pending-actions">
            <button className="icon-btn" onClick={() => startEdit(p)}>✏️</button>
            <button className="icon-btn" onClick={() => dispatch({ type: 'DELETE_PENDING', id: p.id })}>🗑️</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          Pendings
          {carriedOver.length > 0 && (
            <span className="pending-count-badge">↩ {carriedOver.length} carried</span>
          )}
        </span>
        {done.length > 0 && (
          <button className="card-action" onClick={() => dispatch({ type: 'CLEAR_DONE_PENDINGS' })}>
            Clear done
          </button>
        )}
      </div>

      {undone.length === 0 && done.length === 0 && (
        <p className="empty-msg">No pending items — all clear!</p>
      )}

      {undone.map(renderItem)}

      {done.length > 0 && (
        <>
          <div className="done-toggle" onClick={() => setShowDone(s => !s)}>
            {showDone ? '▾' : '▸'} {done.length} done
          </div>
          {showDone && done.map(renderItem)}
        </>
      )}

      <div className="pending-input-row">
        <div className="mic-wrap" style={{ flex: 1 }}>
          <input
            className="pending-input"
            placeholder="Add pending task…"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            ref={el => { pendingInputRef.current = el }}
          />
          <button
            className="mic-btn"
            onClick={e => toggleVoiceInput(pendingInputRef, e.currentTarget, toast)}
          >🎤</button>
        </div>
        <button className="btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  )
}
