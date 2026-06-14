import { useRef } from 'react'
import { useLearnPrep } from '../../../store/LearnPrepContext'
import { Toast, useToast } from '../../shared/Toast'
import { loadLearnPrep, saveLearnPrep } from '../../../utils/storage'

export default function SettingsTab() {
  const { state, dispatch } = useLearnPrep()
  const { toast, toastMsg, toastShow } = useToast()
  const fileRef = useRef(null)

  function exportJSON() {
    const data = JSON.stringify({ learnPrep: state }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `soma-learn-prep-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('✅ Learn & Prep data exported!')
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result)
        const lp = data.learnPrep || data
        if (lp.sessions || lp.companies) {
          dispatch({ type: 'IMPORT', payload: lp })
          toast('✅ Data imported!')
        } else {
          toast('❌ Invalid file format')
        }
      } catch {
        toast('❌ Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function clearAll() {
    if (!window.confirm('Clear ALL Learn & Prep data? This cannot be undone.')) return
    dispatch({ type: 'CLEAR_ALL' })
    toast('All data cleared')
  }

  const stats = {
    sessions: state.sessions.length,
    totalQA: state.sessions.reduce((sum, s) =>
      sum + Object.values(s.skillQA || {}).reduce((a, b) => a + b.length, 0), 0),
    companies: state.companies.length,
    postLogs: state.postInterviewLogs.length,
  }

  return (
    <div>
      {/* Stats */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Your Learn & Prep Stats</span>
        </div>
        <div className="stats-row">
          <div className="stat-card"><div className="stat-val">{stats.sessions}</div><div className="stat-label">Sessions</div></div>
          <div className="stat-card"><div className="stat-val">{stats.totalQA}</div><div className="stat-label">Total Q&As</div></div>
          <div className="stat-card"><div className="stat-val">{stats.companies}</div><div className="stat-label">Companies</div></div>
        </div>
      </div>

      {/* Backup */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Backup & Restore</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 12 }}>
          Export your sessions, interview prep, and Q&A bank as JSON. Import to restore.
        </p>
        <div className="backup-row">
          <button className="btn-sm" onClick={exportJSON}>📤 Export JSON</button>
          <button className="btn-sm-ghost" onClick={() => fileRef.current?.click()}>📥 Import JSON</button>
        </div>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: 'var(--r)' }}>
        <div className="card-header">
          <span className="card-title" style={{ color: 'var(--r)' }}>Danger Zone</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 10 }}>
          Permanently delete all sessions, interview prep data, and Q&A records.
        </p>
        <button className="btn-danger" onClick={clearAll}>🗑️ Clear All Data</button>
      </div>

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
