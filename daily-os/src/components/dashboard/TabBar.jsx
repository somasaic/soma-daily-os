const TABS = [
  { id: 'today',  label: '📋 Today' },
  { id: 'skills', label: '🧠 Skills' },
  { id: 'weekly', label: '📅 Weekly' },
  { id: 'notes',  label: '📝 Notes' },
  { id: 'log',    label: '📖 Log' },
  { id: 'jobs',   label: '💼 Job Tracker' },
  { id: 'hunt',   label: '🎯 Hunt' },
]

export default function TabBar({ active, onChange }) {
  return (
    <div className="tabs">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
