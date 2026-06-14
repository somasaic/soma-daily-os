import { useState } from 'react'
import { SKILLS, DEFAULT_QA } from '../../../constants/learnPrep'

const SKILL_IDS = Object.keys(SKILLS)

export default function QABankTab() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({}) // `${skill}_${idx}` -> bool

  const allQA = SKILL_IDS.flatMap(sk =>
    (DEFAULT_QA[sk] || []).map((qa, idx) => ({ ...qa, skill: sk, idx }))
  )

  const filtered = allQA.filter(qa => {
    const matchSkill = filter === 'all' || qa.skill === filter
    const matchSearch = !search || qa.q.toLowerCase().includes(search.toLowerCase()) || qa.a.toLowerCase().includes(search.toLowerCase())
    return matchSkill && matchSearch
  })

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Q&A Reference Bank</span>
          <span style={{ fontSize: 11, color: 'var(--sub)' }}>{filtered.length} questions</span>
        </div>

        {/* Skill filter */}
        <div className="qb-skill-filter">
          <button className={`qbf${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
          {SKILL_IDS.filter(sk => DEFAULT_QA[sk]?.length > 0).map(sk => (
            <button
              key={sk}
              className={`qbf${filter === sk ? ' active' : ''}`}
              style={filter === sk ? { background: SKILLS[sk].color, borderColor: SKILLS[sk].color } : {}}
              onClick={() => setFilter(sk)}
            >
              {SKILLS[sk].label}
              <span style={{ marginLeft: 4, opacity: .7 }}>({DEFAULT_QA[sk]?.length})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          className="note-search"
          placeholder="Search questions and answers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 12 }}
        />
      </div>

      {filtered.length === 0 && <p className="empty-msg">No questions match your search.</p>}

      {filtered.map(qa => {
        const key = `${qa.skill}_${qa.idx}`
        const open = expanded[key]
        return (
          <div key={key} className="qb-item">
            <div className="qb-skill-tag" style={{ color: SKILLS[qa.skill]?.color }}>
              {SKILLS[qa.skill]?.label}
            </div>
            <div className="qa-q" style={{ cursor: 'pointer' }} onClick={() => setExpanded(e => ({ ...e, [key]: !e[key] }))}>
              {qa.q}
            </div>
            <button className="qa-toggle" onClick={() => setExpanded(e => ({ ...e, [key]: !e[key] }))}>
              {open ? '▾ Hide Answer' : '▸ Show Answer'}
            </button>
            {open && <div className="qa-a">{qa.a}</div>}
          </div>
        )
      })}
    </div>
  )
}
