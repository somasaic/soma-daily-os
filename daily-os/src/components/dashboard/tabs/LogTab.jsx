import { useState, useRef } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { Toast, useToast } from '../../shared/Toast'
import { toggleVoiceInput } from '../../../utils/voice'

export default function LogTab() {
  const { state, dispatch } = useDashboard()
  const { logs } = state
  const { toast, toastMsg, toastShow } = useToast()
  const [logText, setLogText] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const textRef = useRef(null)
  const editRef = useRef(null)

  function addLog() {
    if (!logText.trim()) return
    dispatch({ type: 'ADD_LOG', payload: logText.trim() })
    setLogText('')
    toast('Log entry saved!')
  }

  function saveEdit(id) {
    if (editText.trim()) dispatch({ type: 'UPDATE_LOG', id, text: editText.trim() })
    setEditId(null)
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Daily Log</span>
          <span style={{ fontSize: 11, color: 'var(--sub)' }}>{logs.length} entries</span>
        </div>
        <div className="mic-wrap" style={{ marginBottom: 10 }}>
          <textarea
            ref={textRef}
            className="log-input"
            rows={4}
            placeholder="What did you do today? Notes, blockers, wins, learnings…"
            value={logText}
            onChange={e => setLogText(e.target.value)}
          />
          <button
            className="mic-btn"
            onClick={e => toggleVoiceInput(textRef, { current: e.currentTarget }, toast)}
          >🎤</button>
        </div>
        <button className="btn-sm" onClick={addLog}>Log It</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Log History</span>
        </div>

        {logs.length === 0 && <p className="empty-msg">No log entries yet.</p>}

        {logs.map(entry => (
          <div key={entry.id} className="log-entry">
            <div className="log-entry-header">
              <span className="log-date">{entry.date}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="icon-btn" onClick={() => { setEditId(entry.id); setEditText(entry.text) }}>✏️</button>
                <button className="icon-btn" onClick={() => dispatch({ type: 'DELETE_LOG', id: entry.id })}>🗑️</button>
              </div>
            </div>
            {editId === entry.id ? (
              <div>
                <textarea
                  className="log-edit-area"
                  value={editText}
                  autoFocus
                  onChange={e => setEditText(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button className="btn-sm" onClick={() => saveEdit(entry.id)}>Save</button>
                  <button className="btn-sm-ghost" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="log-text">{entry.text}</div>
            )}
          </div>
        ))}
      </div>

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
