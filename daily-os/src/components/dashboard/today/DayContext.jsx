import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { todayStr } from '../../../utils/utils'
import { toggleVoiceInput } from '../../../utils/voice'
import { useRef } from 'react'

const RATINGS = ['😫','😔','😐','😊','🤩']

export default function DayContext({ toast }) {
  const { state, dispatch } = useDashboard()
  const { reflections } = state
  const [text, setText] = useState('')
  const [rating, setRating] = useState(null)
  const textRef = useRef(null)

  const today = todayStr()
  const todayReflection = reflections[today]

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
          onClick={e => toggleVoiceInput(textRef, { current: e.currentTarget }, toast)}
        >🎤</button>
      </div>

      <button className="btn-sm" onClick={save} style={{ marginBottom: 12 }}>Save Reflection</button>

      {recent.map(([date, ref]) => (
        <div key={date} className="dc-entry">
          <div className="dc-entry-date">
            {date === today ? '📅 Today' : date}
            {ref.rating && <span>{RATINGS[ref.rating - 1]}</span>}
            {ref.savedAt && <span style={{ fontWeight: 400, fontSize: 10, opacity: .7 }}>{ref.savedAt}</span>}
          </div>
          {ref.text && <div className="dc-entry-text">{ref.text}</div>}
        </div>
      ))}
    </div>
  )
}
