import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { NOTE_TYPES } from '../../../constants/dashboard'
import { Toast, useToast } from '../../shared/Toast'
import { useRef } from 'react'
import { toggleVoiceInput } from '../../../utils/voice'

export default function NotesTab() {
  const { state, dispatch } = useDashboard()
  const { notes } = state
  const { toast, toastMsg, toastShow } = useToast()

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [noteType, setNoteType] = useState('general')
  const [noteText, setNoteText] = useState('')
  const [followupDate, setFollowupDate] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const textRef = useRef(null)

  function addNote() {
    if (!noteText.trim()) return
    dispatch({ type: 'ADD_NOTE', payload: { type: noteType, text: noteText.trim(), followupDate } })
    setNoteText('')
    setFollowupDate('')
    toast('Note saved!')
  }

  function saveEdit(id) {
    if (editText.trim()) dispatch({ type: 'UPDATE_NOTE', id, payload: { text: editText.trim() } })
    setEditId(null)
  }

  const noteTypeInfo = Object.fromEntries(NOTE_TYPES.map(t => [t.id, t]))

  const filtered = notes.filter(n => {
    const matchType = filter === 'all' || n.type === filter
    const matchSearch = !search || n.text.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  const typeOpts = NOTE_TYPES.filter(t => t.id !== 'all')

  return (
    <div>
      {/* Add Note Form */}
      <div className="note-add-form">
        <div className="note-form-title">New Note</div>
        <div className="note-type-select-row">
          {typeOpts.map(t => (
            <button
              key={t.id}
              className={`note-type-opt${noteType === t.id ? ' selected' : ''}`}
              style={noteType === t.id ? { background: t.color, borderColor: t.color } : {}}
              onClick={() => setNoteType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mic-wrap" style={{ marginBottom: 8 }}>
          <textarea
            ref={textRef}
            className="note-area"
            rows={3}
            placeholder="Write a note…"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
          />
          <button
            className="mic-btn"
            onClick={e => toggleVoiceInput(textRef, { current: e.currentTarget }, toast)}
          >🎤</button>
        </div>
        {(noteType === 'followup' || noteType === 'recruiter') && (
          <div className="form-row" style={{ marginBottom: 8 }}>
            <label>Follow-up Date</label>
            <input
              type="date"
              value={followupDate}
              onChange={e => setFollowupDate(e.target.value)}
              style={{ width: 'auto' }}
            />
          </div>
        )}
        <button className="btn-sm" onClick={addNote}>Save Note</button>
      </div>

      {/* Filters */}
      <div className="note-type-filters">
        {NOTE_TYPES.map(t => (
          <button
            key={t.id}
            className={`note-filter${filter === t.id ? ' active' : ''}`}
            onClick={() => setFilter(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        className="note-search"
        placeholder="Search notes…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filtered.length === 0 && <p className="empty-msg">No notes found.</p>}

      {filtered.map(note => {
        const info = noteTypeInfo[note.type] || noteTypeInfo.general
        return (
          <div key={note.id} className={`note-card${note.pinned ? ' pinned' : ''}`}>
            <div className="note-card-header">
              <div className="note-meta">
                <span
                  className="note-type-chip"
                  style={{ background: info.bg, color: info.color }}
                >
                  {info.label}
                </span>
                <span className="note-date">{note.date}</span>
                {note.followupDate && (
                  <span style={{ fontSize: 10, color: '#d97706', fontWeight: 700 }}>
                    📅 {note.followupDate}
                  </span>
                )}
              </div>
              <div className="note-actions">
                <button className="icon-btn" onClick={() => dispatch({ type: 'TOGGLE_PIN_NOTE', id: note.id })} title="Pin">
                  {note.pinned ? '📌' : '📍'}
                </button>
                <button className="icon-btn" onClick={() => { setEditId(note.id); setEditText(note.text) }}>✏️</button>
                <button className="icon-btn" onClick={() => dispatch({ type: 'DELETE_NOTE', id: note.id })}>🗑️</button>
              </div>
            </div>

            {editId === note.id ? (
              <div>
                <textarea
                  className="note-edit-area"
                  value={editText}
                  autoFocus
                  onChange={e => setEditText(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-sm" onClick={() => saveEdit(note.id)}>Save</button>
                  <button className="btn-sm-ghost" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="note-text">{note.text}</div>
            )}
          </div>
        )
      })}

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
