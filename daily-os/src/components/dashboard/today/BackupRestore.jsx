import { useRef } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import { exportAllData } from '../../../utils/storage'

export default function BackupRestore({ toast }) {
  const { state, dispatch } = useDashboard()
  const fileRef = useRef(null)

  function exportJSON() {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `soma-daily-os-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast?.('✅ Backup exported!')
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.dashboard) {
          dispatch({ type: 'IMPORT', payload: data.dashboard })
        }
        toast?.('✅ Data restored!')
      } catch {
        toast?.('❌ Invalid backup file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Backup & Restore</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 10 }}>
        Export all your data as JSON to keep a local backup or restore it later.
      </p>
      <div className="backup-row">
        <button className="btn-sm" onClick={exportJSON}>📤 Export JSON</button>
        <button className="btn-sm-ghost" onClick={() => fileRef.current?.click()}>📥 Import JSON</button>
      </div>
      <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
    </div>
  )
}
