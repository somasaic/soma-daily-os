/**
 * Generates a unique client-side identifier.
 */
export function uid() {
  return 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

/**
 * Escapes HTML special characters to prevent XSS injection.
 */
export function esc(s) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Formats seconds into human-readable duration strings (e.g. "1h 15m" or "45m 12s").
 */
export function formatSeconds(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${sec}s`;
  return `${sec}s`;
}

/**
 * Formats a duration in seconds into digital clock style (e.g., "12:34" or "01:23:45").
 */
export function fmtSlotTime(secs) {
  if (secs < 0) secs = 0;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h) {
    return String(h).padStart(2, '0') + ':' + 
           String(m).padStart(2, '0') + ':' + 
           String(s).padStart(2, '0');
  }
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

/**
 * Calculates local date difference in days: (today - date).
 * Returns null if input is falsy.
 */
export function hdiff(d) {
  if (!d) return null;
  const a = new Date(new Date().toISOString().split('T')[0]);
  const b = new Date(d);
  return Math.round((a - b) / 86400000);
}

/**
 * Calculates journey day index (1-based) since start date.
 */
export function getJourneyDay(startDate, todayStr) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const today = new Date(todayStr);
  return Math.max(1, Math.round((today - start) / 86400000) + 1);
}

/**
 * Parses time strings like "6:00 AM" or "11:30 PM" into total minutes from midnight.
 */
export function parseTimeToMinutes(timeStr) {
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const period = m[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

/**
 * Formats a JavaScript Date object into the standard ICS date string format (YYYYMMDDTHHMMSS).
 * Uses local time representation.
 */
export function formatICSDate(dateObj) {
  const pad = n => String(n).padStart(2, '0');
  return [
    dateObj.getFullYear(),
    pad(dateObj.getMonth() + 1),
    pad(dateObj.getDate()),
    'T',
    pad(dateObj.getHours()),
    pad(dateObj.getMinutes()),
    '00'
  ].join('');
}
