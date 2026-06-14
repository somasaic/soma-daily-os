import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { PIPELINE_STAGES, KANBAN_COLUMNS } from '../../../constants/dashboard'
import { Toast, useToast } from '../../shared/Toast'
import KanbanBoard from '../jobs/KanbanBoard'
import AddJobModal from '../jobs/AddJobModal'
import StarBank from '../jobs/StarBank'

export default function JobsTab() {
  const { state, dispatch } = useDashboard()
  const { jobs } = state
  const { toast, toastMsg, toastShow } = useToast()

  const [view, setView] = useState('kanban') // 'kanban' | 'list'
  const [showModal, setShowModal] = useState(false)
  const [listFilter, setListFilter] = useState('all')

  // Stats
  const total = jobs.length
  const active = jobs.filter(j => !['rejected','withdrawn'].includes(j.status)).length
  const interviews = jobs.filter(j => ['round1','round2'].includes(j.status)).length
  const offers = jobs.filter(j => j.status === 'offer').length

  // List view filtered
  const listJobs = listFilter === 'all'
    ? jobs
    : jobs.filter(j => j.status === listFilter)

  // CSV Export
  function exportCSV() {
    const headers = ['Company','Role','Location','Status','Date','LinkedIn URL','Salary','Resume','Notes']
    const rows = jobs.map(j => [
      j.company, j.role, j.location, j.status, j.date,
      j.linkedinUrl || '', j.salary || '', j.resume || '',
      (j.notes || '').replace(/,/g, ';'),
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'soma-jobs.csv'; a.click()
    URL.revokeObjectURL(url)
    toast('📊 CSV exported!')
  }

  return (
    <div>
      {/* Stats */}
      <div className="stats-row" style={{ padding: '0 0 11px' }}>
        <div className="stat-card"><div className="stat-val">{total}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-val">{active}</div><div className="stat-label">Active</div></div>
        <div className="stat-card"><div className="stat-val">{interviews}</div><div className="stat-label">Interviews</div></div>
      </div>

      {/* Header bar */}
      <div className="jobs-header-bar">
        <div className="jobs-view-toggle">
          <button
            className={`view-toggle-btn${view === 'kanban' ? ' active' : ''}`}
            onClick={() => setView('kanban')}
          >
            🗂 Kanban
          </button>
          <button
            className={`view-toggle-btn${view === 'list' ? ' active' : ''}`}
            onClick={() => setView('list')}
          >
            ≡ List
          </button>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <button className="btn-sm-ghost" onClick={exportCSV}>📊 CSV</button>
          <button className="btn-sm" onClick={() => setShowModal(true)}>+ Add Job</button>
        </div>
      </div>

      {/* Kanban Board */}
      {view === 'kanban' && (
        <KanbanBoard toast={toast} />
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="job-list-view">
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
            {PIPELINE_STAGES.map(s => (
              <button
                key={s.id}
                className={`note-filter${listFilter === s.id ? ' active' : ''}`}
                onClick={() => setListFilter(s.id)}
              >
                {s.label}
                {s.id !== 'all' && (
                  <span style={{ marginLeft: 4, fontSize: 10, opacity: .7 }}>
                    ({jobs.filter(j => j.status === s.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          {listJobs.length === 0 && <p className="empty-msg">No jobs in this stage.</p>}
          {listJobs.map(j => {
            const stage = PIPELINE_STAGES.find(s => s.id === j.status)
            return (
              <div key={j.id} className="job-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="job-company">{j.company}</div>
                    <div className="job-role-line">{j.role}{j.location ? ` · ${j.location}` : ''}</div>
                    <div className="job-meta">
                      {stage && <span className={`jchip ${stage.cls || ''}`}>{stage.label}</span>}
                      <span className="job-date-txt">{j.date}</span>
                      {j.salary && <span style={{ fontSize: 10, color: 'var(--g)', fontWeight: 700 }}>{j.salary}</span>}
                      {j.resume && <span style={{ fontSize: 10, background: 'var(--light)', border: '1px solid var(--border)', borderRadius: 7, padding: '1px 7px', color: 'var(--text)' }}>{j.resume}</span>}
                      {j.linkedinUrl && (
                        <a href={j.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--p)' }}>🔗</a>
                      )}
                    </div>
                    {j.notes && <div className="job-note-txt">{j.notes}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    <button className="icon-btn" onClick={() => dispatch({ type: 'DELETE_JOB', id: j.id })}>🗑️</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* STAR Prep Bank */}
      <div style={{ padding: '0 12px 12px' }}>
        <StarBank toast={toast} />
      </div>

      {/* Add Job Modal */}
      {showModal && <AddJobModal onClose={() => setShowModal(false)} toast={toast} />}

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
