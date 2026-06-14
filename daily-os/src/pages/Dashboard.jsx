import { useState } from 'react'
import Header from '../components/dashboard/Header'
import StreakPanel from '../components/dashboard/StreakPanel'
import DayTypeSelector from '../components/dashboard/DayTypeSelector'
import TabBar from '../components/dashboard/TabBar'
import TodayTab from '../components/dashboard/tabs/TodayTab'
import SkillsTab from '../components/dashboard/tabs/SkillsTab'
import WeeklyTab from '../components/dashboard/tabs/WeeklyTab'
import NotesTab from '../components/dashboard/tabs/NotesTab'
import LogTab from '../components/dashboard/tabs/LogTab'
import JobsTab from '../components/dashboard/tabs/JobsTab'
import HuntTab from '../components/dashboard/tabs/HuntTab'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('today')
  const [streakOpen, setStreakOpen] = useState(false)

  return (
    <div className="app-root">
      <Header onStreakClick={() => setStreakOpen(o => !o)} />
      <StreakPanel open={streakOpen} />
      <DayTypeSelector />
      <TabBar active={activeTab} onChange={setActiveTab} />

      <div className={`tab-content${activeTab === 'today'  ? ' active' : ''}`}><TodayTab  /></div>
      <div className={`tab-content${activeTab === 'skills' ? ' active' : ''}`}><SkillsTab /></div>
      <div className={`tab-content${activeTab === 'weekly' ? ' active' : ''}`}><WeeklyTab /></div>
      <div className={`tab-content${activeTab === 'notes'  ? ' active' : ''}`}><NotesTab  /></div>
      <div className={`tab-content${activeTab === 'log'    ? ' active' : ''}`}><LogTab    /></div>
      <div className={`tab-content${activeTab === 'jobs'   ? ' active' : ''}`}><JobsTab   /></div>
      <div className={`tab-content${activeTab === 'hunt'   ? ' active' : ''}`}><HuntTab   /></div>
    </div>
  )
}
