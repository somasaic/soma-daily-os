import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDashboard } from '../../../store/DashboardContext'
import { PIPELINE_STAGES } from '../../../constants/dashboard'

const STAGES = PIPELINE_STAGES.filter(s => s.id !== 'all')

export default function JobCard({ job, toast }) {
  const { dispatch } = useDashboard()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...job })

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: job.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const daysSince = job.date
    ? Math.floor((Date.now() - new Date(job.date).getTime()) / 86400000)
    : null

  function saveEdit() {
    dispatch({ type: 'UPDATE_JOB', id: job.id, payload: { ...form } })
    setEditing(false)
    toast?.('Updated!')
  }

  if (editing) {
    return (
      <div className="kanban-card" ref={setNodeRef} style={style}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input className="" style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 12, background: 'var(--light)', color: 'var(--text)', width: '100%' }} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company" />
          <input style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 12, background: 'var(--light)', color: 'var(--text)', width: '100%' }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Role" />
          <input style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 12, background: 'var(--light)', color: 'var(--text)', width: '100%' }} value={form.linkedinUrl || ''} onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))} placeholder="LinkedIn URL" />
          <input style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 12, background: 'var(--light)', color: 'var(--text)', width: '100%' }} value={form.salary || ''} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="Salary range" />
          <input style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 12, background: 'var(--light)', color: 'var(--text)', width: '100%' }} value={form.resume || ''} onChange={e => setForm(f => ({ ...f, resume: e.target.value }))} placeholder="Resume used" />
          <textarea style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 11, background: 'var(--light)', color: 'var(--text)', width: '100%', resize: 'vertical', minHeight: 50 }} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes" />
          <select style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', fontSize: 12, background: 'var(--light)', color: 'var(--text)' }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 5 }}>
            <button className="btn-sm" onClick={saveEdit} style={{ flex: 1 }}>Save</button>
            <button className="btn-sm-ghost" onClick={() => setEditing(false)}>×</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`kanban-card${isDragging ? ' dragging' : ''}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="kanban-card-actions">
        {job.linkedinUrl && (
          <a
            href={job.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="kanban-li-link"
            onClick={e => e.stopPropagation()}
            title="Open job link"
          >
            🔗
          </a>
        )}
        <button
          className="icon-btn"
          onClick={e => { e.stopPropagation(); setEditing(true) }}
          title="Edit"
          style={{ opacity: .5 }}
        >✏️</button>
        <button
          className="icon-btn"
          onClick={e => { e.stopPropagation(); if (window.confirm(`Delete ${job.company}?`)) dispatch({ type: 'DELETE_JOB', id: job.id }) }}
          title="Delete"
          style={{ opacity: .5 }}
        >🗑️</button>
      </div>

      <div className="kanban-card-co">{job.company}</div>
      {job.role && <div className="kanban-card-role">{job.role}{job.location ? ` · ${job.location}` : ''}</div>}

      <div className="kanban-card-meta">
        {daysSince !== null && (
          <span className="kanban-card-days">{daysSince === 0 ? 'Today' : `${daysSince}d ago`}</span>
        )}
        {job.resume && <span className="kanban-card-resume">{job.resume}</span>}
        {job.salary && <span className="kanban-card-salary">{job.salary}</span>}
      </div>

      {job.notes && (
        <div style={{ fontSize: 10, color: 'var(--sub)', marginTop: 3, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {job.notes}
        </div>
      )}
    </div>
  )
}
