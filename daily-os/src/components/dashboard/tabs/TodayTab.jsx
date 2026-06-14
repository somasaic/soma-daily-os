import { useDashboard } from '../../../store/DashboardContext'
import { BANNERS, FOCUS_MAP, NOTE_TYPES } from '../../../constants/dashboard'
import { Toast, useToast } from '../../shared/Toast'
import MoodTracker from '../today/MoodTracker'
import NonNegotiables from '../today/NonNegotiables'
import Pendings from '../today/Pendings'
import ParkIdeas from '../today/ParkIdeas'
import QuickWins from '../today/QuickWins'
import Schedule from '../today/Schedule'
import FocusMusic from '../today/FocusMusic'
import DayContext from '../today/DayContext'
import BackupRestore from '../today/BackupRestore'

export default function TodayTab() {
  const { state } = useDashboard()
  const { dayType, notes } = state
  const { toast, toastMsg, toastShow } = useToast()

  const banner = BANNERS[dayType]
  const focus = FOCUS_MAP[dayType]

  // Recruiter follow-up notes due today or overdue
  const today = new Date().toISOString().split('T')[0]
  const followups = notes.filter(n => n.type === 'followup' || n.type === 'recruiter')
  const urgentFollowups = followups.filter(n => n.followupDate && n.followupDate <= today)

  return (
    <div>
      {/* Mode Banner */}
      {banner && (
        <div className={`mode-banner ${banner.cls}`}>
          <span style={{ fontSize: 18 }}>{banner.icon}</span>
          <span>{banner.text}</span>
        </div>
      )}

      {/* Recruiter Follow-up Banner */}
      {urgentFollowups.length > 0 && (
        <div className="followup-banner show">
          <span>⚠️</span>
          <span>
            <strong>{urgentFollowups.length} recruiter follow-up{urgentFollowups.length > 1 ? 's' : ''} due!</strong>
            {' '}{urgentFollowups.map(n => n.text.slice(0, 40)).join(' · ')}
          </span>
        </div>
      )}

      {/* Focus Card */}
      {focus && (
        <div className="focus-card">
          <div className="card-title">Today's Focus</div>
          <div className="focus-name">{focus.name}</div>
          <div className="focus-sub">{focus.sub}</div>
        </div>
      )}

      <MoodTracker />
      <NonNegotiables toast={toast} />
      <Pendings toast={toast} />
      <Schedule toast={toast} />
      <QuickWins />
      <ParkIdeas toast={toast} />
      <FocusMusic toast={toast} />
      <DayContext toast={toast} />
      <BackupRestore toast={toast} />

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  )
}
