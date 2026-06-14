const DASH_KEY = 'soma_state'
const LP_KEY = 'soma_lp_state'

export function loadDashboard() {
  try {
    const raw = localStorage.getItem(DASH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveDashboard(state) {
  try {
    localStorage.setItem(DASH_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

export function loadLearnPrep() {
  try {
    const raw = localStorage.getItem(LP_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveLearnPrep(state) {
  try {
    localStorage.setItem(LP_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

export function getDark() {
  return localStorage.getItem('soma_dark') === 'true'
}

export function setDark(val) {
  localStorage.setItem('soma_dark', String(val))
}

export function getTimerDay(dateStr) {
  try {
    const raw = localStorage.getItem('soma_timers_' + dateStr)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function setTimerDay(dateStr, data) {
  try {
    localStorage.setItem('soma_timers_' + dateStr, JSON.stringify(data))
  } catch {}
}

export function exportAllData(dashState, lpState) {
  const data = {
    soma_state: dashState,
    soma_lp_state: lpState,
    exported: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'soma-daily-os-backup-' + new Date().toISOString().split('T')[0] + '.json'
  a.click()
}
