import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../store/DashboardContext'
import SessionsTab from '../components/learnprep/tabs/SessionsTab'
import InterviewPrepTab from '../components/learnprep/tabs/InterviewPrepTab'
import QABankTab from '../components/learnprep/tabs/QABankTab'
import PracticeTab from '../components/learnprep/tabs/PracticeTab'
import SettingsTab from '../components/learnprep/tabs/SettingsTab'

const TABS = [
  { id: 'sessions',  label: '📚 Sessions' },
  { id: 'interview', label: '🎯 Interview Prep' },
  { id: 'qabank',    label: '🗂 Q&A Bank' },
  { id: 'practice',  label: '⚡ Practice' },
  { id: 'settings',  label: '⚙️ Settings' },
]

export default function LearnPrep() {
  const { state, dispatch } = useDashboard()
  const { darkMode } = state
  const [activeTab, setActiveTab] = useState('sessions')

  return (
    <div className="app-root">
      <div className="hdr">
        <div>
          <h1>Learn & Prep Hub</h1>
          <div className="hdr-sub">Sessions · Interview Prep · Q&A Bank · Practice</div>
        </div>
        <div className="hdr-right">
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="header-nav-btn" onClick={() => dispatch({ type: 'SET_DARK', payload: !darkMode })}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Link to="/" className="header-nav-btn">⬅ Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`tab-content${activeTab === 'sessions'  ? ' active' : ''}`}><SessionsTab     /></div>
      <div className={`tab-content${activeTab === 'interview' ? ' active' : ''}`}><InterviewPrepTab /></div>
      <div className={`tab-content${activeTab === 'qabank'    ? ' active' : ''}`}><QABankTab        /></div>
      <div className={`tab-content${activeTab === 'practice'  ? ' active' : ''}`}><PracticeTab      /></div>
      <div className={`tab-content${activeTab === 'settings'  ? ' active' : ''}`}><SettingsTab      /></div>
    </div>
  )
}
