export function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function daysBetween(dateStr) {
  if (!dateStr) return 0
  const now = new Date()
  const then = new Date(dateStr)
  return Math.floor((now - then) / 86400000)
}

export function parseTimeToMins(timeStr) {
  if (!timeStr) return null
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return null
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  const ampm = m[3].toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + min
}

export function minsToDisplay(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
}

export function secsToDisplay(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export function icsDate(dateStr, timeStr) {
  if (!timeStr || !dateStr) return ''
  const mins = parseTimeToMins(timeStr)
  const date = new Date(dateStr)
  date.setHours(Math.floor(mins / 60), mins % 60, 0)
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function getCurrentDayKey() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  return days[new Date().getDay()]
}

export function getDayOfWeek() {
  return new Date().getDay()
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
}

export function getWeekDates() {
  const today = new Date()
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
    const dt = new Date(monday)
    dt.setDate(monday.getDate() + i)
    return dt.toISOString().split('T')[0]
  })
}
