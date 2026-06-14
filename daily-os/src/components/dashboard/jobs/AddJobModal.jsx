import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { PIPELINE_STAGES } from '../../../constants/dashboard'

const KANBAN_STAGES = PIPELINE_STAGES.filter(s => s.id !== 'all')

const DEFAULT_FORM = {
  company: '', role: '', location: '', status: 'applied',
  notes: '', linkedinUrl: '', salary: '', resume: '',
}

export default function AddJobModal({ onClose, toast }) {
  const { dispatch } = useDashboard()
  const [form, setForm] = useState({ ...DEFAULT_FORM })

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
  }

  function submit() {
    if (!form.company.trim()) { toast?.('Company name required'); return }
    dispatch({ type: 'ADD_JOB', payload: { ...form } })
    toast?.(`✅ ${form.company} added to Job Tracker!`)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">
          Add Job
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="form-row-2">
          <div className="form-row">
            <label>Company *</label>
            <input placeholder="Company name" value={form.company} onChange={e => set('company', e.target.value)} />
          </div>
          <div className="form-row">
            <label>Role *</label>
            <input placeholder="Job title" value={form.role} onChange={e => set('role', e.target.value)} />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-row">
            <label>Location</label>
            <input placeholder="City / Remote" value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
          <div className="form-row">
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              {KANBAN_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <label>LinkedIn / Job URL</label>
          <input placeholder="https://linkedin.com/jobs/…" value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} />
        </div>

        <div className="form-row-2">
          <div className="form-row">
            <label>Salary Range</label>
            <input placeholder="e.g. 8-10 LPA" value={form.salary} onChange={e => set('salary', e.target.value)} />
          </div>
          <div className="form-row">
            <label>Resume Used</label>
            <input placeholder="e.g. Playwright_v3" value={form.resume} onChange={e => set('resume', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <label>Notes</label>
          <textarea rows={3} placeholder="Recruiter name, contact, source, notes…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button className="btn-sm-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-sm" onClick={submit}>Add Job</button>
        </div>
      </div>
    </div>
  )
}
