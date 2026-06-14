import { useState } from 'react'
import { useLearnPrep } from '../../../store/LearnPrepContext'
import { PREP_TYPES } from '../../../constants/learnPrep'
import { Toast, useToast } from '../../shared/Toast'

const STAGES = ['Shortlisted','Phone Screen','Round 1','Round 2','Final Round','Offer','Rejected']

export default function InterviewPrepTab() {
  const { state, dispatch } = useLearnPrep()
  const { companies } = state
  const { toast, toastMsg, toastShow } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', date: '', stage: 'Shortlisted' })
  const [openCoId, setOpenCoId] = useState(null)
  const [activePrepType, setActivePrepType] = useState({}) // coId -> prepTypeId
  const [addQA, setAddQA] = useState(null) // coId
  const [newQA, setNewQA] = useState({ q: '', a: '' })
  const [expandedPrepQA, setExpandedPrepQA] = useState({}) // `${coId}_${prepType}_${idx}` -> bool

  function createCompany() {
    if (!form.name.trim()) { toast('Company name required'); return }
    dispatch({ type: 'ADD_COMPANY', payload: form })
    setForm({ name: '', role: '', date: '', stage: 'Shortlisted' })
    setShowForm(false)
    toast('Company added!')
  }

  function addPrepQA(coId) {
    const prepType = activePrepType[coId] || PREP_TYPES[0].id
    if (!newQA.q.trim()) return
    dispatch({ type: 'ADD_PREP_QA', compId: coId, prepType, q: newQA.q.trim(), a: newQA.a.trim() })
    setNewQA({ q: '', a: '' })
    setAddQA(null)
    toast('Question added!')
  }

  function togglePrepQA(coId, prepType, idx, field, val) {
    dispatch({ type: 'UPDATE_PREP_QA', compId: coId, prepType, qaId: null, payload: null })
    // use index-based update
    const co = companies.find(c => c.id === coId)
    if (!co) return
    const qa = (co.prepQA[prepType] || [])[idx]
    if (!qa) return
    dispatch({ type: 'UPDATE_PREP_QA', compId: coId, prepType, qaId: qa.id, payload: { [field]: val } })
  }

  function markDone(coId, prepType, qa) {
    dispatch({ type: 'UPDATE_PREP_QA', compId: coId, prepType, qaId: qa.id, payload: { done: !qa.done } })
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Interview Prep by Company</span>
          <button className="card-action" onClick={() => setShowForm(f => !f)}>
            {showForm ? '−' : '+ Add Company'}
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <div className="form-title">Add Company / Interview</div>
            <div className="form-row-2">
              <div className="form-row">
                <label>Company *</label>
                <input placeholder="Company name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-row">
                <label>Role</label>
                <input placeholder="Job title" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-row">
                <label>Interview Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="form-row">
                <label>Stage</label>
                <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="btn-sm" onClick={createCompany}>Add</button>
              <button className="btn-sm-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {companies.length === 0 && <p className="empty-msg">No companies added yet.</p>}

      {companies.map(co => {
        const isOpen = openCoId === co.id
        const curType = activePrepType[co.id] || PREP_TYPES[0].id
        const prepList = (co.prepQA && co.prepQA[curType]) || []
        const totalDone = Object.values(co.prepQA || {}).flat().filter(q => q.done).length
        const totalQ = Object.values(co.prepQA || {}).flat().length

        return (
          <div key={co.id} className="co-card">
            <div
              className={`co-hdr${isOpen ? ' open' : ''}`}
              onClick={() => setOpenCoId(isOpen ? null : co.id)}
            >
              <div>
                <div className="co-name">{co.name}</div>
                <div className="co-role">{co.role}{co.date ? ` · ${co.date}` : ''}{co.stage ? ` · ${co.stage}` : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {totalQ > 0 && (
                  <span style={{ fontSize: 10, color: 'var(--sub)', fontWeight: 700 }}>
                    {totalDone}/{totalQ} done
                  </span>
                )}
                <button className="icon-btn" onClick={e => { e.stopPropagation(); if(window.confirm(`Delete ${co.name}?`)) dispatch({ type: 'DELETE_COMPANY', id: co.id }) }}>🗑️</button>
                <span style={{ fontSize: 13, opacity: .5 }}>{isOpen ? '▾' : '▸'}</span>
              </div>
            </div>

            {isOpen && (
              <div className="co-body open">
                {/* Prep Type Tabs */}
                <div className="prep-type-tabs">
                  {PREP_TYPES.map(pt => (
                    <button
                      key={pt.id}
                      className={`ptt${curType === pt.id ? ' active' : ''}`}
                      onClick={() => setActivePrepType(a => ({ ...a, [co.id]: pt.id }))}
                    >
                      {pt.label}
                      <span style={{ marginLeft: 4, opacity: .6, fontSize: 9 }}>({(co.prepQA?.[pt.id] || []).length})</span>
                    </button>
                  ))}
                </div>

                {/* Q list */}
                {prepList.length === 0 && <p className="empty-msg">No questions for this type yet.</p>}

                {prepList.map((qa, idx) => {
                  const key = `${co.id}_${curType}_${idx}`
                  const expanded = expandedPrepQA[key]
                  return (
                    <div key={qa.id} className="prep-qa-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                            <button
                              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}
                              onClick={() => markDone(co.id, curType, qa)}
                              title="Mark done"
                            >
                              {qa.done ? '✅' : '⬜'}
                            </button>
                            <span style={{ fontSize: 13, fontWeight: qa.done ? 400 : 700, textDecoration: qa.done ? 'line-through' : 'none', color: qa.done ? 'var(--sub)' : 'var(--text)' }}>
                              {qa.q}
                            </span>
                          </div>
                          {qa.a && (
                            <>
                              <button className="qa-toggle" onClick={() => setExpandedPrepQA(e => ({ ...e, [key]: !e[key] }))}>
                                {expanded ? '▾ Hide answer' : '▸ Show answer'}
                              </button>
                              {expanded && <div className="qa-a">{qa.a}</div>}
                            </>
                          )}
                          <div style={{ marginTop: 6 }}>
                            <textarea
                              rows={2}
                              placeholder="My prepared answer…"
                              value={qa.myAnswer || ''}
                              onChange={e => dispatch({ type: 'UPDATE_PREP_QA', compId: co.id, prepType: curType, qaId: qa.id, payload: { myAnswer: e.target.value } })}
                              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 9px', fontSize: 12, background: 'var(--card)', color: 'var(--text)', resize: 'vertical', minHeight: 40 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Add Q */}
                {addQA === co.id ? (
                  <div style={{ background: 'var(--light)', borderRadius: 10, padding: 12, border: '1px solid var(--border)' }}>
                    <input value={newQA.q} onChange={e => setNewQA(n => ({ ...n, q: e.target.value }))} placeholder="Question…" style={{ width: '100%', marginBottom: 6, border: '1px solid var(--border)', borderRadius: 6, padding: '7px 9px', fontSize: 12, background: 'var(--card)', color: 'var(--text)' }} />
                    <textarea rows={2} value={newQA.a} onChange={e => setNewQA(n => ({ ...n, a: e.target.value }))} placeholder="Model answer (optional)…" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 9px', fontSize: 12, background: 'var(--card)', color: 'var(--text)', resize: 'vertical', minHeight: 50 }} />
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <button className="btn-sm" onClick={() => addPrepQA(co.id)}>Add</button>
                      <button className="btn-sm-ghost" onClick={() => setAddQA(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-add" onClick={() => setAddQA(co.id)}>+ Add Question</button>
                )}
              </div>
            )}
          </div>
        )
      })}

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
