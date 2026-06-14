import { useState, useRef, useEffect, useCallback } from 'react'
import { useDashboard } from '../../../store/DashboardContext'
import {
  DEFAULT_DAY_SCHEDULES, DEFAULT_SCHEDULES, SCHED_TITLES, WEEK_DAYS,
} from '../../../constants/dashboard'
import { todayStr, getCurrentDayKey, icsDate, parseTimeToMins, minsToDisplay } from '../../../utils/utils'
import { playAlarm } from '../../../utils/alarm'

const DOT_TYPES = ['ritual','work','break','habit','health','review','plan','wind','sleep','interrupt','relaxation','screening']

export default function Schedule({ toast }) {
  const { state, dispatch } = useDashboard()
  const { schedule, dayType, scheduleDone } = state

  // Which day tab is selected (default: today)
  const todayDayKey = getCurrentDayKey()
  const [selDay, setSelDay] = useState(todayDayKey)
  const [editingIdx, setEditingIdx] = useState(null)
  const [editSlot, setEditSlot] = useState(null)
  const [addRow, setAddRow] = useState(false)
  const [newSlot, setNewSlot] = useState({ time: '', label: '', type: 'work' })

  // Timers: slotKey -> { elapsed, running }
  const [timers, setTimers] = useState({})
  const [timerDurations, setTimerDurations] = useState({})
  const intervalsRef = useRef({})

  // Get the slots for the selected day
  const savedSlots = schedule[selDay]
  const isToday = selDay === todayDayKey
  const defaultSlots = DEFAULT_DAY_SCHEDULES[selDay] || DEFAULT_SCHEDULES[dayType] || []
  const slots = savedSlots || defaultSlots

  // Done state for today
  const todayDate = todayStr()
  const dayDone = isToday ? (scheduleDone[todayDate] || {}) : {}

  const doneCount = Object.values(dayDone).filter(Boolean).length
  const pct = slots.length > 0 ? Math.round((doneCount / slots.length) * 100) : 0

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => { Object.values(intervalsRef.current).forEach(clearInterval) }
  }, [])

  function slotKey(idx) { return `${selDay}_${idx}` }

  function startTimer(idx) {
    const key = slotKey(idx)
    if (intervalsRef.current[key]) return
    const dur = (timerDurations[key] || 25) * 60
    if (!timers[key]) setTimers(t => ({ ...t, [key]: { elapsed: 0, running: true } }))
    else setTimers(t => ({ ...t, [key]: { ...t[key], running: true } }))

    intervalsRef.current[key] = setInterval(() => {
      setTimers(t => {
        const cur = t[key] || { elapsed: 0, running: true }
        const elapsed = (cur.elapsed || 0) + 1
        if (elapsed >= dur) {
          clearInterval(intervalsRef.current[key])
          delete intervalsRef.current[key]
          playAlarm()
          if (toast) toast(`⏰ Timer done for slot ${idx + 1}!`)
          return { ...t, [key]: { elapsed, running: false, done: true } }
        }
        return { ...t, [key]: { ...cur, elapsed, running: true } }
      })
    }, 1000)
  }

  function stopTimer(idx) {
    const key = slotKey(idx)
    clearInterval(intervalsRef.current[key])
    delete intervalsRef.current[key]
    setTimers(t => ({ ...t, [key]: { ...(t[key] || {}), running: false } }))
  }

  function resetTimer(idx) {
    const key = slotKey(idx)
    clearInterval(intervalsRef.current[key])
    delete intervalsRef.current[key]
    setTimers(t => { const n = { ...t }; delete n[key]; return n })
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function toggleBell(idx) {
    const slot = slots[idx]
    if (!('Notification' in window)) return toast?.('Notifications not supported')
    if (Notification.permission === 'denied') return toast?.('Notifications blocked in browser settings')
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        const mins = parseTimeToMins(slot.time)
        if (mins === null) return toast?.('Cannot parse time for notification')
        const now = new Date()
        const target = new Date(now)
        target.setHours(Math.floor(mins / 60), mins % 60, 0, 0)
        if (target <= now) target.setDate(target.getDate() + 1)
        const delay = target - now
        setTimeout(() => {
          new Notification(`⏰ ${slot.time}`, { body: slot.label, icon: '/favicon.ico' })
        }, delay)
        toast?.(`🔔 Reminder set for ${slot.time}`)
      }
    })
  }

  function startEdit(idx) {
    setEditingIdx(idx)
    setEditSlot({ ...slots[idx] })
  }

  function saveEdit() {
    const updated = [...slots]
    updated[editingIdx] = { ...editSlot }
    dispatch({ type: 'UPDATE_SCHEDULE', dayKey: selDay, slots: updated })
    setEditingIdx(null)
    setEditSlot(null)
  }

  function deleteSlot(idx) {
    const updated = slots.filter((_, i) => i !== idx)
    dispatch({ type: 'UPDATE_SCHEDULE', dayKey: selDay, slots: updated })
  }

  function addSlot() {
    if (!newSlot.label.trim()) return
    const updated = [...slots, { ...newSlot }]
    dispatch({ type: 'UPDATE_SCHEDULE', dayKey: selDay, slots: updated })
    setNewSlot({ time: '', label: '', type: 'work' })
    setAddRow(false)
  }

  function resetToDefault() {
    if (!window.confirm('Reset this day to default schedule?')) return
    const updated = { ...schedule }
    delete updated[selDay]
    dispatch({ type: 'UPDATE_SCHEDULE', dayKey: selDay, slots: DEFAULT_DAY_SCHEDULES[selDay] || DEFAULT_SCHEDULES[dayType] })
  }

  function exportICS() {
    const today = new Date()
    const dayIdx = WEEK_DAYS.indexOf(selDay)
    const diff = (dayIdx - today.getDay() + 8) % 7
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + diff)
    const dateStr = targetDate.toISOString().split('T')[0].replace(/-/g, '')

    const events = slots.filter(s => parseTimeToMins(s.time) !== null).map(s => {
      const startMins = parseTimeToMins(s.time)
      const start = `${dateStr}T${String(Math.floor(startMins / 60)).padStart(2, '0')}${String(startMins % 60).padStart(2, '0')}00`
      const endMins = startMins + 60
      const end = `${dateStr}T${String(Math.floor(endMins / 60)).padStart(2, '0')}${String(endMins % 60).padStart(2, '0')}00`
      return `BEGIN:VEVENT\r\nSUMMARY:${s.label}\r\nDTSTART:${start}\r\nDTEND:${end}\r\nEND:VEVENT`
    }).join('\r\n')

    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Soma Daily OS//EN\r\n${events}\r\nEND:VCALENDAR`
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `soma-schedule-${selDay}.ics`
    a.click()
    URL.revokeObjectURL(url)
    toast?.('📅 ICS downloaded')
  }

  const title = isToday ? (SCHED_TITLES[dayType] || 'TODAY\'S SCHEDULE') : `${selDay.toUpperCase()} SCHEDULE`

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title" style={{ fontSize: 9 }}>{title}</span>
        <div style={{ display: 'flex', gap: 5 }}>
          <button className="card-action" onClick={exportICS} title="Export to calendar">📅</button>
          <button className="card-action" onClick={() => window.print()} title="PDF export">🖨️</button>
          <button className="card-action" onClick={resetToDefault}>Reset</button>
        </div>
      </div>

      {/* Progress bar */}
      {isToday && slots.length > 0 && (
        <div className="comp-bar-wrap">
          <div className="comp-bar">
            <div className="comp-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="comp-label">{doneCount}/{slots.length} slots done ({pct}%)</div>
        </div>
      )}

      {/* Day tab row */}
      <div className="day-tab-row">
        {WEEK_DAYS.map(d => (
          <button
            key={d}
            className={`day-tab-btn${selDay === d ? ' dtab-active' : ''}${d === todayDayKey ? ' dtab-today' : ''}`}
            onClick={() => setSelDay(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Slots */}
      {slots.map((slot, idx) => {
        const key = slotKey(idx)
        const timer = timers[key]
        const dur = timerDurations[key] || 25
        const isDone = dayDone[idx] || false
        const isEditing = editingIdx === idx

        return (
          <div key={idx} className="sched-slot-wrap">
            {isEditing ? (
              <div className="sched-edit-row">
                <input
                  className="sched-input sched-time-input"
                  value={editSlot.time}
                  onChange={e => setEditSlot(s => ({ ...s, time: e.target.value }))}
                  placeholder="Time"
                />
                <input
                  className="sched-input sched-label-input"
                  value={editSlot.label}
                  autoFocus
                  onChange={e => setEditSlot(s => ({ ...s, label: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  placeholder="Label"
                />
                <select
                  className="sched-input sched-type-select"
                  value={editSlot.type}
                  onChange={e => setEditSlot(s => ({ ...s, type: e.target.value }))}
                >
                  {DOT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button className="btn-sm" onClick={saveEdit}>Save</button>
                <button className="btn-sm-ghost" onClick={() => setEditingIdx(null)}>×</button>
              </div>
            ) : (
              <div className={`schedule-item${isDone ? ' sched-item-done' : ''}`}>
                {isToday && (
                  <button
                    className={`sched-done-cb${isDone ? ' is-done' : ''}`}
                    onClick={() => dispatch({ type: 'TOGGLE_SCHEDULE_DONE', index: idx })}
                    title="Mark done"
                  >
                    {isDone ? '✅' : '⬜'}
                  </button>
                )}
                <span className="schedule-time">{slot.time}</span>
                <span className={`schedule-dot dot-${slot.type || 'work'}`} />
                <span className="schedule-label">{slot.label}</span>
                <div className="schedule-actions">
                  <button className="sched-bell" onClick={() => toggleBell(idx)} title="Set reminder">🔔</button>
                  <button className="sched-btn" onClick={() => startEdit(idx)} title="Edit">✏️</button>
                  <button className="sched-btn" onClick={() => deleteSlot(idx)} title="Delete">🗑️</button>
                </div>
              </div>
            )}

            {/* Slot Timer */}
            {!isEditing && (
              <div className="slot-timer-row">
                <span className={`slot-timer-display${timer?.running ? ' st-running' : ''}${timer?.done ? ' st-done' : ''}`}>
                  {timer ? formatTime(timer.elapsed || 0) : '00:00'}
                </span>
                {!timer?.running ? (
                  <button className="slot-timer-btn st-start" onClick={() => startTimer(idx)}>▶ Start</button>
                ) : (
                  <button className="slot-timer-btn st-stop" onClick={() => stopTimer(idx)}>⏸ Pause</button>
                )}
                {timer && <button className="slot-timer-btn st-reset" onClick={() => resetTimer(idx)}>↺</button>}
                <input
                  className="st-dur-input"
                  type="number"
                  min="1"
                  max="120"
                  value={dur}
                  onChange={e => setTimerDurations(d => ({ ...d, [key]: parseInt(e.target.value) || 25 }))}
                  title="Duration in minutes"
                />
                <span className="st-dur-label">min</span>
              </div>
            )}
          </div>
        )
      })}

      {/* Add slot */}
      {addRow ? (
        <div className="add-sched-row">
          <input className="sched-input sched-time-input" placeholder="Time" value={newSlot.time} onChange={e => setNewSlot(s => ({ ...s, time: e.target.value }))} />
          <input className="sched-input sched-label-input" placeholder="Label" autoFocus value={newSlot.label} onChange={e => setNewSlot(s => ({ ...s, label: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addSlot()} />
          <select className="sched-input sched-type-select" value={newSlot.type} onChange={e => setNewSlot(s => ({ ...s, type: e.target.value }))}>
            {DOT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="btn-sm" onClick={addSlot}>Add</button>
          <button className="btn-sm-ghost" onClick={() => setAddRow(false)}>×</button>
        </div>
      ) : (
        <button className="btn-add" onClick={() => setAddRow(true)}>+ Add slot</button>
      )}
    </div>
  )
}
