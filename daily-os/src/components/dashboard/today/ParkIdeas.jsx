import { useState, useRef } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { toggleVoiceInput } from '../../../utils/voice'

const IDEA_TAGS = ['💡 Idea','🔧 Feature','📚 Learn','⚡ Automate','🎯 Apply','🤔 Question']

export default function ParkIdeas({ toast }) {
  const { state, dispatch } = useDashboard()
  const { ideas } = state
  const [text, setText] = useState('')
  const [tag, setTag] = useState('💡 Idea')
  const [files, setFiles] = useState([])
  const [filterTag, setFilterTag] = useState('all')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editTag, setEditTag] = useState('💡 Idea')
  const fileInputRef = useRef(null)
  const textRef = useRef(null)
  const editTextRef = useRef(null)

  function add() {
    if (!text.trim()) return
    dispatch({ type: 'ADD_IDEA', payload: { text: text.trim(), tag, files: files.map(f => f.name) } })
    setText('')
    setFiles([])
  }

  function startEdit(idea) {
    setEditId(idea.id)
    setEditText(idea.text)
    setEditTag(idea.tag)
  }

  function saveEdit() {
    if (!editText.trim()) return
    dispatch({ type: 'UPDATE_IDEA', id: editId, payload: { text: editText.trim(), tag: editTag } })
    setEditId(null)
    toast?.('Idea updated!')
  }

  function handleFiles(e) {
    setFiles(Array.from(e.target.files))
  }

  const allTags = ['all', ...IDEA_TAGS]
  const filtered = filterTag === 'all' ? ideas : ideas.filter(i => i.tag === filterTag)

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Park Ideas</span>
        <span style={{ fontSize: 11, color: 'var(--sub)' }}>{ideas.length} idea{ideas.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="idea-tag-row">
        {allTags.map(t => (
          <span
            key={t}
            className={`idea-tag${filterTag === t ? ' sel' : ''}`}
            onClick={() => setFilterTag(t)}
          >
            {t === 'all' ? '🗂 All' : t}
          </span>
        ))}
      </div>

      <div className="mic-wrap" style={{ marginBottom: 8 }}>
        <textarea
          ref={textRef}
          className="note-area"
          rows={2}
          placeholder="Park an idea, insight, or question before it slips…"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ minHeight: 55 }}
        />
        <button
          className="mic-btn"
          onClick={e => toggleVoiceInput(textRef, e.currentTarget, toast)}
        >🎤</button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        <div className="idea-tag-row" style={{ marginBottom: 0 }}>
          {IDEA_TAGS.map(t => (
            <span key={t} className={`idea-tag${tag === t ? ' sel' : ''}`} onClick={() => setTag(t)}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 8 }}>
        <button className="idea-file-btn" onClick={() => fileInputRef.current?.click()}>
          📎 {files.length > 0 ? `${files.length} file(s)` : 'Attach files'}
        </button>
        <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFiles} />
        <button className="btn-sm" onClick={add}>Park It</button>
      </div>

      {filtered.length === 0 && (
        <p className="empty-msg">{filterTag === 'all' ? 'No ideas parked yet.' : `No "${filterTag}" ideas.`}</p>
      )}

      {filtered.map(idea => (
        <div key={idea.id} className="idea-item">
          {editId === idea.id ? (
            <div>
              <div className="idea-tag-row" style={{ marginBottom: 6 }}>
                {IDEA_TAGS.map(t => (
                  <span key={t} className={`idea-tag${editTag === t ? ' sel' : ''}`} onClick={() => setEditTag(t)}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="mic-wrap" style={{ marginBottom: 7 }}>
                <textarea
                  ref={editTextRef}
                  className="note-area"
                  rows={2}
                  value={editText}
                  autoFocus
                  onChange={e => setEditText(e.target.value)}
                  style={{ minHeight: 50 }}
                />
                <button className="mic-btn" onClick={e => toggleVoiceInput(editTextRef, e.currentTarget, toast)}>🎤</button>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-sm" onClick={saveEdit}>Save</button>
                <button className="btn-sm-ghost" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="idea-item-hdr">
                <span className="idea-tag-chip">{idea.tag}</span>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span className="idea-date">{idea.date}</span>
                  <button className="icon-btn" onClick={() => startEdit(idea)} title="Edit">✏️</button>
                  <button className="icon-btn" onClick={() => dispatch({ type: 'DELETE_IDEA', id: idea.id })} title="Delete">🗑️</button>
                </div>
              </div>
              <div className="idea-text">{idea.text}</div>
              {idea.files && idea.files.length > 0 && (
                <div className="idea-files">
                  {idea.files.map((f, i) => (
                    <span key={i} className="idea-file-chip">📎 {f}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}
