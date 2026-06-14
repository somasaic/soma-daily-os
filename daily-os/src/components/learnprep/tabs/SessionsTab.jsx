import { useState, useRef } from 'react'
import { useLearnPrep } from '../../../store/LearnPrepContext'
import { SKILLS } from '../../../constants/learnPrep'
import { Toast, useToast } from '../../shared/Toast'
import { toggleVoiceInput } from '../../../utils/voice'

const SKILL_IDS = Object.keys(SKILLS)

export default function SessionsTab() {
  const { state, dispatch } = useLearnPrep()
  const { sessions } = state
  const { toast, toastMsg, toastShow } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], heading: '', concepts: '', topics: '', skills: [] })
  const [openSessId, setOpenSessId] = useState(null)
  const [activeSkill, setActiveSkill] = useState({}) // sessId -> skillId
  const [showSol, setShowSol] = useState({}) // `${sessId}_${skill}_${qi}` -> bool
  const [answerText, setAnswerText] = useState({}) // same key -> text
  const [editingQA, setEditingQA] = useState(null) // { sessId, skill, qi }
  const [editQA, setEditQA] = useState({ q: '', a: '' })
  const [addQA, setAddQA] = useState(null) // { sessId, skill }
  const [newQA, setNewQA] = useState({ q: '', a: '' })
  const [showAnswer, setShowAnswer] = useState({}) // `${sessId}_${skill}_${qi}` -> bool
  const ansRef = useRef(null)

  function toggleSkill(skillId) {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skillId)
        ? f.skills.filter(s => s !== skillId)
        : [...f.skills, skillId],
    }))
  }

  function createSession() {
    if (!form.heading.trim()) { toast('Session heading required'); return }
    if (form.skills.length === 0) { toast('Select at least one skill'); return }
    dispatch({ type: 'ADD_SESSION', payload: form })
    setForm({ date: new Date().toISOString().split('T')[0], heading: '', concepts: '', topics: '', skills: [] })
    setShowForm(false)
    toast('Session created!')
  }

  function deleteSession(id) {
    if (!window.confirm('Delete this session?')) return
    dispatch({ type: 'DELETE_SESSION', id })
    toast('Session deleted')
  }

  function startEditQA(sessId, skill, qi, qa) {
    setEditingQA({ sessId, skill, qi })
    setEditQA({ q: qa.q, a: qa.a })
  }

  function saveEditQA() {
    const { sessId, skill, qi } = editingQA
    dispatch({ type: 'EDIT_QA', sessId, skill, qi, q: editQA.q, a: editQA.a })
    setEditingQA(null)
    toast('Q&A updated!')
  }

  function deleteQA(sessId, skill, qi) {
    if (!window.confirm('Delete this question?')) return
    dispatch({ type: 'DELETE_QA', sessId, skill, qi })
    toast('Question deleted')
  }

  function saveAnswer(sessId, skill, qi) {
    const key = `${sessId}_${skill}_${qi}`
    const text = answerText[key]
    if (!text?.trim()) return
    dispatch({ type: 'SAVE_MY_ANSWER', sessId, skill, qi, text: text.trim() })
    setAnswerText(t => ({ ...t, [key]: '' }))
    setShowSol(s => ({ ...s, [key]: false }))
    toast('Answer saved!')
  }

  function addNewQA(sessId, skill) {
    if (!newQA.q.trim()) return
    dispatch({ type: 'ADD_QA', sessId, skill, q: newQA.q.trim(), a: newQA.a.trim() })
    setNewQA({ q: '', a: '' })
    setAddQA(null)
    toast('Question added!')
  }

  return (
    <div>
      {/* Create Session */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Study Sessions</span>
          <button className="card-action" onClick={() => setShowForm(f => !f)}>
            {showForm ? '−' : '+ New Session'}
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <div className="form-title">Create New Session</div>
            <div className="form-row-2">
              <div className="form-row">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="form-row">
                <label>Heading *</label>
                <input placeholder="e.g. Playwright POM Deep Dive" value={form.heading} onChange={e => setForm(f => ({ ...f, heading: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <label>Concepts Covered</label>
              <input placeholder="Fixtures, page objects, API testing…" value={form.concepts} onChange={e => setForm(f => ({ ...f, concepts: e.target.value }))} />
            </div>
            <div className="form-row">
              <label>Topics / Resources</label>
              <input placeholder="Playwright docs, YouTube, udemy…" value={form.topics} onChange={e => setForm(f => ({ ...f, topics: e.target.value }))} />
            </div>
            <div className="form-row">
              <label>Skills (select to load Q&A)</label>
              <div className="skill-pills">
                {SKILL_IDS.map(sk => (
                  <span
                    key={sk}
                    className={`spill${form.skills.includes(sk) ? ' sel' : ''}`}
                    onClick={() => toggleSkill(sk)}
                    style={form.skills.includes(sk) ? { background: SKILLS[sk].color, borderColor: SKILLS[sk].color } : {}}
                  >
                    {SKILLS[sk].label}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="btn-sm" onClick={createSession}>Create Session</button>
              <button className="btn-sm-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Session List */}
      {sessions.length === 0 && <p className="empty-msg">No sessions yet. Create your first session above!</p>}

      {sessions.map(sess => {
        const isOpen = openSessId === sess.id
        const curSkill = activeSkill[sess.id] || sess.skills[0]
        const qaList = (sess.skillQA && sess.skillQA[curSkill]) || []

        return (
          <div key={sess.id} className="sess-card">
            {/* Session Header */}
            <div className="sess-hdr" onClick={() => setOpenSessId(isOpen ? null : sess.id)}>
              <div style={{ flex: 1 }}>
                <div className="sess-date">{sess.date}</div>
                <div className="sess-heading">{sess.heading}</div>
                {sess.concepts && <div className="sess-concepts">{sess.concepts}</div>}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                  {sess.skills.map(sk => (
                    <span key={sk} className="spill" style={{ fontSize: 10, padding: '2px 8px', background: SKILLS[sk]?.color + '22', borderColor: SKILLS[sk]?.color, color: SKILLS[sk]?.color }}>
                      {SKILLS[sk]?.label || sk}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="icon-btn" onClick={e => { e.stopPropagation(); deleteSession(sess.id) }}>🗑️</button>
                <span style={{ fontSize: 14, opacity: .5 }}>{isOpen ? '▾' : '▸'}</span>
              </div>
            </div>

            {/* Session Body */}
            {isOpen && (
              <div className="sess-body open">
                {/* Skill Tabs */}
                <div className="sess-skill-tabs">
                  {sess.skills.map(sk => (
                    <button
                      key={sk}
                      className={`sst${curSkill === sk ? ' active' : ''}`}
                      style={curSkill === sk ? { background: SKILLS[sk]?.color, borderColor: SKILLS[sk]?.color } : {}}
                      onClick={() => setActiveSkill(a => ({ ...a, [sess.id]: sk }))}
                    >
                      {SKILLS[sk]?.label || sk}
                      <span style={{ marginLeft: 4, opacity: .7, fontSize: 10 }}>
                        ({(sess.skillQA?.[sk] || []).length})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Q&A Panel */}
                <div className="qa-panel active">
                  {qaList.length === 0 && <p className="empty-msg">No Q&A for this skill yet.</p>}

                  {qaList.map((qa, qi) => {
                    const key = `${sess.id}_${curSkill}_${qi}`
                    const isEditingThis = editingQA?.sessId === sess.id && editingQA?.skill === curSkill && editingQA?.qi === qi
                    const showAns = showAnswer[key]
                    const solOpen = showSol[key]

                    return (
                      <div key={qi} className="qa-item">
                        {isEditingThis ? (
                          <div>
                            <div className="form-row">
                              <label>Question</label>
                              <textarea rows={2} value={editQA.q} onChange={e => setEditQA(d => ({ ...d, q: e.target.value }))} style={{ width: '100%', border: '1px solid var(--p)', borderRadius: 6, padding: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--card)', color: 'var(--text)' }} />
                            </div>
                            <div className="form-row">
                              <label>Model Answer</label>
                              <textarea rows={3} value={editQA.a} onChange={e => setEditQA(d => ({ ...d, a: e.target.value }))} style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: 8, fontSize: 12, fontFamily: 'inherit', background: 'var(--card)', color: 'var(--text)' }} />
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn-sm" onClick={saveEditQA}>Save</button>
                              <button className="btn-sm-ghost" onClick={() => setEditingQA(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="qa-q">{qi + 1}. {qa.q}</div>

                            {/* Action row: Toggle Answer | Edit Q | Delete Q */}
                            <div className="qa-action-row">
                              <button className="qa-toggle" onClick={() => setShowAnswer(s => ({ ...s, [key]: !s[key] }))}>
                                {showAns ? '▾ Hide Answer' : '▸ Show Answer'}
                              </button>
                              <button
                                className="btn-sm-ghost"
                                style={{ fontSize: 10, padding: '3px 9px' }}
                                onClick={() => startEditQA(sess.id, curSkill, qi, qa)}
                              >
                                ✏️ Edit Q
                              </button>
                              <button
                                className="btn-danger"
                                style={{ fontSize: 10, padding: '3px 9px' }}
                                onClick={() => deleteQA(sess.id, curSkill, qi)}
                              >
                                🗑️ Delete Q
                              </button>
                            </div>

                            {showAns && qa.a && (
                              <div className="qa-a">{qa.a}</div>
                            )}

                            {/* My Answers */}
                            {qa.myAnswers && qa.myAnswers.length > 0 && (
                              <div className="saved-answers">
                                {qa.myAnswers.map((ans, ai) => (
                                  <div key={ai} className="saved-ans">
                                    <span style={{ fontSize: 10, color: 'var(--sub)', display: 'block', marginBottom: 3 }}>{ans.date}</span>
                                    {ans.text}
                                    <button
                                      className="del-ans"
                                      onClick={() => dispatch({ type: 'DELETE_MY_ANSWER', sessId: sess.id, skill: curSkill, qi, ai })}
                                    >×</button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Speak Out Loud (add my answer) */}
                            <div className="sol-box">
                              {!solOpen ? (
                                <button className="qa-toggle" onClick={() => setShowSol(s => ({ ...s, [key]: true }))}>
                                  + Practice my answer
                                </button>
                              ) : (
                                <>
                                  <div className="mic-wrap" style={{ marginBottom: 6 }}>
                                    <textarea
                                      ref={ansRef}
                                      className="sol-box textarea"
                                      rows={3}
                                      placeholder="Speak or type your answer…"
                                      value={answerText[key] || ''}
                                      onChange={e => setAnswerText(t => ({ ...t, [key]: e.target.value }))}
                                      style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 9px', fontSize: 12, background: 'var(--light)', color: 'var(--text)', resize: 'vertical', minHeight: 55 }}
                                    />
                                    <button
                                      className="mic-btn"
                                      onClick={e => toggleVoiceInput(
                                        { current: e.currentTarget.previousSibling },
                                        { current: e.currentTarget },
                                        toast
                                      )}
                                    >🎤</button>
                                  </div>
                                  <div className="sol-row">
                                    <button className="btn-sm" onClick={() => saveAnswer(sess.id, curSkill, qi)}>Save Answer</button>
                                    <button className="btn-sm-ghost" onClick={() => setShowSol(s => ({ ...s, [key]: false }))}>Cancel</button>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}

                  {/* Add new Q */}
                  {addQA?.sessId === sess.id && addQA?.skill === curSkill ? (
                    <div className="qa-item">
                      <div className="form-row">
                        <label>New Question</label>
                        <input value={newQA.q} onChange={e => setNewQA(n => ({ ...n, q: e.target.value }))} placeholder="Question…" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 9px', fontSize: 12, background: 'var(--light)', color: 'var(--text)' }} />
                      </div>
                      <div className="form-row">
                        <label>Model Answer (optional)</label>
                        <textarea rows={2} value={newQA.a} onChange={e => setNewQA(n => ({ ...n, a: e.target.value }))} placeholder="Answer…" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 9px', fontSize: 12, background: 'var(--light)', color: 'var(--text)', resize: 'vertical', minHeight: 50 }} />
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-sm" onClick={() => addNewQA(sess.id, curSkill)}>Add</button>
                        <button className="btn-sm-ghost" onClick={() => setAddQA(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn-add"
                      onClick={() => setAddQA({ sessId: sess.id, skill: curSkill })}
                    >
                      + Add Question
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
