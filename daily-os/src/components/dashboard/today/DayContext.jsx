import { useState, useRef } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { todayStr } from '../../../utils/utils'
import { toggleVoiceInput } from '../../../utils/voice'

const RATINGS = ['😫','😔','😐','😊','🤩']

export default function DayContext({ toast }) {
  const { state, dispatch } = useDashboard()
  const { reflections } = state
  const [text, setText] = useState('')
  const [rating, setRating] = useState(null)
  const [editDate, setEditDate] = useState(null)
  const [editText, setEditText] = useState('')
  const [editRating, setEditRating] = useState(null)
  const textRef = useRef(null)
  const editRef = useRef(null)

  const today = todayStr()

  function save() {
    if (!text.trim() && rating === null) return
    dispatch({
      type: 'SAVE_REFLECTION',
      payload: { text: text.trim(), rating, date: today, savedAt: new Date().toLocaleTimeString('en-IN') },
    })
    setText('')
    setRating(null)
    toast?.('Reflection saved!')
  }

  function startEdit(date, ref) {
    setEditDate(date)
    setEditText(ref.text || '')
    setEditRating(ref.rating || null)
  }

  function saveEdit() {
    if (!editText.trim() && editRating === null) return
    dispatch({
      type: 'UPDATE_REFLECTION',
      payload: { date: editDate, text: editText.trim(), rating: editRating },
    })
    setEditDate(null)
    toast?.('Reflection updated!')
  }

  function deleteReflection(date) {
    if (!window.confirm('Delete this reflection?')) return
    dispatch({ type: 'DELETE_REFLECTION', date })
  }

  const recent = Object.entries(reflections)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Day Context & Reflections</span>
      </div>

      <div className="dc-day-rating">
        {RATINGS.map((r, i) => (
          <button
            key={i}
            className={`dc-rating-btn${rating === i + 1 ? ' dc-sel' : ''}`}
            onClick={() => setRating(i + 1)}
            title={`${i + 1} star${i !== 0 ? 's' : ''}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mic-wrap" style={{ marginBottom: 8 }}>
        <textarea
          ref={textRef}
          className="note-area"
          rows={3}
          placeholder="What happened today? Key wins, blockers, feelings, lessons…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          className="mic-btn"
          onClick={e => toggleVoiceInput(textRef, e.currentTarget, toast)}
        >🎤</button>
      </div>

      <button className="btn-sm" onClick={save} style={{ marginBottom: 12 }}>Save Reflection</button>

      {recent.map(([date, ref]) => (
        <div key={date} className="dc-entry">
          {editDate === date ? (
            <div>
              <div className="dc-day-rating" style={{ marginBottom: 8 }}>
                {RATINGS.map((r, i) => (
                  <button
                    key={i}
                    className={`dc-rating-btn${editRating === i + 1 ? ' dc-sel' : ''}`}
                    onClick={() => setEditRating(i + 1)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="mic-wrap" style={{ marginBottom: 7 }}>
                <textarea
                  ref={editRef}
                  className="note-area"
                  rows={3}
                  value={editText}
                  autoFocus
                  onChange={e => setEditText(e.target.value)}
                />
                <button className="mic-btn" onClick={e => toggleVoiceInput(editRef, e.currentTarget, toast)}>🎤</button>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-sm" onClick={saveEdit}>Save</button>
                <button className="btn-sm-ghost" onClick={() => setEditDate(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="dc-entry-date">
                <span>{date === today ? '📅 Today' : date}</span>
                {ref.rating && <span>{RATINGS[ref.rating - 1]}</span>}
                {ref.savedAt && <span style={{ fontWeight: 400, fontSize: 10, opacity: .7 }}>{ref.savedAt}</span>}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                  <button className="icon-btn" onClick={() => startEdit(date, ref)} title="Edit">✏️</button>
                  <button className="icon-btn" onClick={() => deleteReflection(date)} title="Delete">🗑️</button>
                </div>
              </div>
              {ref.text && <div className="dc-entry-text">{ref.text}</div>}
            </>
          )}
        </div>
      ))}
    </div>
  )
}
