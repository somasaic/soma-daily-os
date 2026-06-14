import { useState, useRef } from 'react'
import { useLearnPrep } from '../../../store/LearnPrepContext'
import { SKILLS, DEFAULT_QA } from '../../../constants/learnPrep'
import { Toast, useToast } from '../../shared/Toast'
import { toggleVoiceInput } from '../../../utils/voice'

const SKILL_IDS = Object.keys(SKILLS)

export default function PracticeTab() {
  const { state, dispatch } = useLearnPrep()
  const { toast, toastMsg, toastShow } = useToast()

  const [skill, setSkill] = useState(SKILL_IDS[0])
  const [source, setSource] = useState('bank') // 'bank' | 'sessions'
  const [idx, setIdx] = useState(0)
  const [myAnswer, setMyAnswer] = useState('')
  const [showModel, setShowModel] = useState(false)
  const [score, setScore] = useState(null)
  const ansRef = useRef(null)

  // Build Q list
  let qList = []
  if (source === 'bank') {
    qList = (DEFAULT_QA[skill] || [])
  } else {
    // Pull from sessions
    const allSessQA = state.sessions.flatMap(s =>
      (s.skillQA?.[skill] || [])
    )
    qList = allSessQA
  }

  const total = qList.length
  const current = qList[idx]

  function next() {
    setIdx(i => Math.min(i + 1, total - 1))
    setMyAnswer('')
    setShowModel(false)
    setScore(null)
  }

  function prev() {
    setIdx(i => Math.max(i - 1, 0))
    setMyAnswer('')
    setShowModel(false)
    setScore(null)
  }

  function shuffle() {
    setIdx(Math.floor(Math.random() * total))
    setMyAnswer('')
    setShowModel(false)
    setScore(null)
  }

  function saveAnswer() {
    if (!myAnswer.trim() || !current) return
    // Find this Q in sessions and save
    state.sessions.forEach(sess => {
      const qaList = sess.skillQA?.[skill] || []
      const qi = qaList.findIndex(q => q.q === current.q)
      if (qi !== -1) {
        dispatch({ type: 'SAVE_MY_ANSWER', sessId: sess.id, skill, qi, text: myAnswer.trim() })
      }
    })
    toast('Answer saved to sessions!')
    setMyAnswer('')
  }

  if (total === 0) {
    return (
      <div>
        <div className="card">
          <div className="card-header"><span className="card-title">Practice Mode</span></div>
          <div className="skill-pills" style={{ marginBottom: 12 }}>
            {SKILL_IDS.map(sk => (
              <span
                key={sk}
                className={`spill${skill === sk ? ' sel' : ''}`}
                style={skill === sk ? { background: SKILLS[sk].color, borderColor: SKILLS[sk].color } : {}}
                onClick={() => { setSkill(sk); setIdx(0) }}
              >
                {SKILLS[sk].label}
              </span>
            ))}
          </div>
          <p className="empty-msg">No questions for {SKILLS[skill]?.label} in {source === 'bank' ? 'the Q&A bank' : 'your sessions'}.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Skill & source selector */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Practice Mode — Flashcards</span>
          <span style={{ fontSize: 11, color: 'var(--sub)' }}>{idx + 1}/{total}</span>
        </div>
        <div className="skill-pills" style={{ marginBottom: 8 }}>
          {SKILL_IDS.filter(sk => (DEFAULT_QA[sk] || []).length > 0).map(sk => (
            <span
              key={sk}
              className={`spill${skill === sk ? ' sel' : ''}`}
              style={skill === sk ? { background: SKILLS[sk].color, borderColor: SKILLS[sk].color } : {}}
              onClick={() => { setSkill(sk); setIdx(0); setMyAnswer(''); setShowModel(false) }}
            >
              {SKILLS[sk].label}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <button className={`spill${source === 'bank' ? ' sel' : ''}`} onClick={() => { setSource('bank'); setIdx(0) }}>Q&A Bank</button>
          <button className={`spill${source === 'sessions' ? ' sel' : ''}`} onClick={() => { setSource('sessions'); setIdx(0) }}>My Sessions</button>
        </div>
      </div>

      {/* Flashcard */}
      {current && (
        <div className="practice-card">
          <div className="q-num">Q {idx + 1} of {total} · {SKILLS[skill]?.label}</div>
          <div className="q-text">{current.q}</div>

          <div className="mic-wrap" style={{ marginBottom: 10 }}>
            <textarea
              ref={ansRef}
              rows={3}
              placeholder="Type or speak your answer…"
              value={myAnswer}
              onChange={e => setMyAnswer(e.target.value)}
            />
            <button
              className="mic-btn"
              style={{ background: 'rgba(255,255,255,0.2)', opacity: .8 }}
              onClick={e => toggleVoiceInput(ansRef, { current: e.currentTarget }, toast)}
            >🎤</button>
          </div>

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <button
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              onClick={() => setShowModel(s => !s)}
            >
              {showModel ? '▾ Hide Model' : '▸ Show Model Answer'}
            </button>
            <button
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              onClick={saveAnswer}
            >
              💾 Save Answer
            </button>
          </div>

          {showModel && current.a && (
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: 10, marginTop: 10, fontSize: 12, lineHeight: 1.6 }}>
              <strong style={{ opacity: .7, fontSize: 10, display: 'block', marginBottom: 4 }}>MODEL ANSWER</strong>
              {current.a}
            </div>
          )}
        </div>
      )}

      {/* Score */}
      <div className="card">
        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 7 }}>
          <span style={{ fontSize: 12, color: 'var(--sub)', fontWeight: 600, alignSelf: 'center' }}>Self-score:</span>
          {[1,2,3].map(s => (
            <button
              key={s}
              className={`score-badge score-${s}`}
              style={{ cursor: 'pointer', border: score === s ? '2px solid currentColor' : '2px solid transparent', fontSize: 13 }}
              onClick={() => setScore(s)}
            >
              {s === 1 ? '😅 Needs Work' : s === 2 ? '🙂 Almost' : '✅ Nailed It'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
          <button className="btn-sm-ghost" onClick={prev} disabled={idx === 0}>← Prev</button>
          <button className="btn-sm-ghost" onClick={shuffle}>🔀 Random</button>
          <button className="btn-sm" onClick={next} disabled={idx === total - 1}>Next →</button>
        </div>
      </div>

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
