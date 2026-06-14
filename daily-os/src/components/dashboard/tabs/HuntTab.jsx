import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { HUNT_DAY_CFG, HUNT_STATUS_MAP, HUNT_GROUPS } from '../../../constants/dashboard'
import { Toast, useToast } from '../../shared/Toast'
import { uid } from '../../../utils/utils'

const CHANNELS = ['LinkedIn DM','Email','Wellfound','Indeed','Referral','Direct','Naukri','Other']
const STATUSES = Object.entries(HUNT_STATUS_MAP).map(([id, v]) => ({ id, ...v }))

const DEFAULT_FORM = {
  company: '', role: '', location: '', status: 'applied',
  contact: '', channel: 'LinkedIn DM', followupDate: '', source: '', match: '80', notes: '',
}

const FOLLOW_UP_TEMPLATES = [
  "Hi [Name], I wanted to follow up on my application for [Role] at [Company]. I remain very excited about this opportunity and would love to discuss how my Playwright + TypeScript automation experience aligns with your team's needs. Would you have 15 minutes this week?",
  "Hi [Name], following up on my application sent [DATE]. I've been working on [RECENT_WORK] which directly applies to this role. Happy to share a portfolio link or take a short assessment. Please let me know!",
  "Hi [Name], hope you're having a great week! Just checking in on the [Role] position. I'm an immediate joiner and very motivated to contribute to [Company]'s QA automation goals.",
]

export default function HuntTab() {
  const { state, dispatch } = useDashboard()
  const { huntApps } = state
  const { toast, toastMsg, toastShow } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...DEFAULT_FORM })
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [collapsed, setCollapsed] = useState({})

  const dayOfWeek = new Date().getDay()
  const dayCfg = HUNT_DAY_CFG[dayOfWeek]

  // Follow-ups due today or overdue
  const today = new Date().toISOString().split('T')[0]
  const urgentFU = huntApps.filter(h =>
    h.followupDate && h.followupDate <= today && !['rejected','closed'].includes(h.status)
  ).sort((a, b) => a.followupDate.localeCompare(b.followupDate))
  const hotFU = urgentFU.filter(h => h.followupDate < today)
  const todayFU = urgentFU.filter(h => h.followupDate === today)
  const upcomingFU = huntApps.filter(h =>
    h.followupDate && h.followupDate > today && !['rejected','closed'].includes(h.status)
  ).slice(0, 5)

  function addApp() {
    if (!form.company.trim()) return
    dispatch({ type: 'ADD_HUNT', payload: { ...form, id: uid(), appliedDate: today } })
    setForm({ ...DEFAULT_FORM })
    setShowForm(false)
    toast('Application added!')
  }

  function saveEdit(id) {
    dispatch({ type: 'UPDATE_HUNT', id, payload: editData })
    setEditId(null)
    toast('Updated!')
  }

  function copyTemplate(template) {
    navigator.clipboard?.writeText(template).then(() => toast('Copied!')).catch(() => toast('Copy failed'))
  }

  function toggleGroup(key) {
    setCollapsed(c => ({ ...c, [key]: !c[key] }))
  }

  // Group apps
  const grouped = HUNT_GROUPS.map(g => ({
    ...g,
    apps: huntApps.filter(h => g.statuses.includes(h.status)),
  }))

  return (
    <div>
      {/* Day Mode Banner */}
      <div className={`hunt-day-banner ${dayCfg.cls}`}>
        <span style={{ fontSize: 20 }}>{dayCfg.icon}</span>
        <div>
          <strong>{dayCfg.mode}</strong><br />
          <span style={{ fontWeight: 400 }}>{dayCfg.desc}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 11 }}>
        <div className="stat-card"><div className="stat-val">{huntApps.length}</div><div className="stat-label">Total Apps</div></div>
        <div className="stat-card"><div className="stat-val">{huntApps.filter(h => ['interview','consideration','close'].includes(h.status)).length}</div><div className="stat-label">Hot</div></div>
        <div className="stat-card"><div className="stat-val">{urgentFU.length}</div><div className="stat-label">Follow-ups</div></div>
      </div>

      {/* Urgent Follow-ups */}
      {(hotFU.length > 0 || todayFU.length > 0) && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Action Required — Follow-ups</span>
          </div>
          {hotFU.map(h => (
            <div key={h.id} className="hunt-fu-item hunt-fu-urg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: 13 }}>{h.company}</strong>
                  <span style={{ fontSize: 11, color: 'var(--sub)', marginLeft: 6 }}>{h.role}</span>
                  <span className={`hunt-fu-badge hunt-fu-ov`} style={{ marginLeft: 6 }}>OVERDUE {h.followupDate}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-sm" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => {
                    const newDate = new Date()
                    newDate.setDate(newDate.getDate() + 3)
                    dispatch({ type: 'UPDATE_HUNT', id: h.id, payload: { followupDate: newDate.toISOString().split('T')[0] } })
                    toast('Follow-up snoozed 3 days')
                  }}>Snooze 3d</button>
                  <button className="icon-btn" onClick={() => { setEditId(h.id); setEditData({ ...h }) }}>✏️</button>
                </div>
              </div>
              {h.contact && <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 3 }}>📞 {h.contact}</div>}
            </div>
          ))}
          {todayFU.map(h => (
            <div key={h.id} className="hunt-fu-item hunt-fu-hot">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: 13 }}>{h.company}</strong>
                  <span style={{ fontSize: 11, color: 'var(--sub)', marginLeft: 6 }}>{h.role}</span>
                  <span className="hunt-fu-badge hunt-fu-td" style={{ marginLeft: 6 }}>TODAY</span>
                </div>
                <button className="icon-btn" onClick={() => { setEditId(h.id); setEditData({ ...h }) }}>✏️</button>
              </div>
              {h.contact && <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 3 }}>📞 {h.contact}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Follow-up Templates */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Follow-up Templates</span>
        </div>
        {FOLLOW_UP_TEMPLATES.map((tmpl, i) => (
          <button key={i} className="hunt-copy-btn" onClick={() => copyTemplate(tmpl)}>
            {tmpl.slice(0, 100)}…
          </button>
        ))}
      </div>

      {/* Upcoming Follow-ups */}
      {upcomingFU.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Upcoming Follow-ups</span>
          </div>
          {upcomingFU.map(h => (
            <div key={h.id} className="hunt-fu-item hunt-fu-ok">
              <strong style={{ fontSize: 13 }}>{h.company}</strong>
              <span style={{ fontSize: 11, color: 'var(--sub)', marginLeft: 6 }}>{h.role}</span>
              <span className="hunt-fu-badge hunt-fu-up" style={{ marginLeft: 6 }}>{h.followupDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Application Form */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Log Application</span>
          <button className="card-action" onClick={() => setShowForm(f => !f)}>
            {showForm ? '−' : '+ Add'}
          </button>
        </div>
        {showForm && (
          <div>
            <div className="form-row-2">
              <div className="form-row">
                <label>Company *</label>
                <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company name" />
              </div>
              <div className="form-row">
                <label>Role</label>
                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Job title" />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-row">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Channel</label>
                <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}>
                  {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-row">
                <label>Contact Person</label>
                <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="Recruiter name" />
              </div>
              <div className="form-row">
                <label>Follow-up Date</label>
                <input type="date" value={form.followupDate} onChange={e => setForm(f => ({ ...f, followupDate: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <label>Notes</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Source, notes, JD highlights…" />
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="btn-sm" onClick={addApp}>Add Application</button>
              <button className="btn-sm-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Pipeline grouped */}
      {grouped.map(g => (
        <div key={g.key} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            className={`hunt-grp-hdr ${g.cls}`}
            onClick={() => toggleGroup(g.key)}
          >
            {collapsed[g.key] ? '▸' : '▾'} {g.label} ({g.apps.length})
          </div>
          {!collapsed[g.key] && g.apps.map(h => {
            const statusInfo = HUNT_STATUS_MAP[h.status] || { label: h.status, cls: '' }
            const fuBadge = h.followupDate
              ? h.followupDate < today ? 'hunt-fu-ov'
              : h.followupDate === today ? 'hunt-fu-td' : 'hunt-fu-up'
              : null
            return (
              <div key={h.id} className="hunt-app-row">
                {editId === h.id ? (
                  <div style={{ padding: '6px 0' }}>
                    <div className="form-row-2">
                      <div className="form-row">
                        <label>Company</label>
                        <input value={editData.company || ''} onChange={e => setEditData(d => ({ ...d, company: e.target.value }))} />
                      </div>
                      <div className="form-row">
                        <label>Role</label>
                        <input value={editData.role || ''} onChange={e => setEditData(d => ({ ...d, role: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-row-2">
                      <div className="form-row">
                        <label>Status</label>
                        <select value={editData.status || 'applied'} onChange={e => setEditData(d => ({ ...d, status: e.target.value }))}>
                          {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </div>
                      <div className="form-row">
                        <label>Follow-up</label>
                        <input type="date" value={editData.followupDate || ''} onChange={e => setEditData(d => ({ ...d, followupDate: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-row-2">
                      <div className="form-row">
                        <label>Contact</label>
                        <input value={editData.contact || ''} onChange={e => setEditData(d => ({ ...d, contact: e.target.value }))} />
                      </div>
                      <div className="form-row">
                        <label>Location</label>
                        <input value={editData.location || ''} onChange={e => setEditData(d => ({ ...d, location: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-row">
                      <label>Notes</label>
                      <textarea rows={2} value={editData.notes || ''} onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))} />
                    </div>
                    <div style={{ display: 'flex', gap: 7, marginTop: 6 }}>
                      <button className="btn-sm" onClick={() => saveEdit(editId)}>Save</button>
                      <button className="btn-sm-ghost" onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="hunt-app-co">{h.company}</span>
                        <span className={`hunt-stage-chip ${statusInfo.cls}`}>{statusInfo.label}</span>
                        {fuBadge && h.followupDate && (
                          <span className={`hunt-fu-badge ${fuBadge}`}>{h.followupDate}</span>
                        )}
                      </div>
                      <div className="hunt-app-role">{h.role}{h.location ? ` · ${h.location}` : ''}</div>
                      {h.contact && <div style={{ fontSize: 10, color: 'var(--sub)' }}>📞 {h.contact} · {h.channel}</div>}
                      {h.notes && <div style={{ fontSize: 11, color: 'var(--text)', marginTop: 3, opacity: .8 }}>{h.notes}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 3 }}>
                      <button className="icon-btn" onClick={() => { setEditId(h.id); setEditData({ ...h }) }}>✏️</button>
                      <button className="icon-btn" onClick={() => dispatch({ type: 'DELETE_HUNT', id: h.id })}>🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
