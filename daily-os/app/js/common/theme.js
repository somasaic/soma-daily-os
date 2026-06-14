/**
 * Initializes the dark/light theme based on stored user preferences.
 */
export function initTheme(storageKey, btnId) {
  const isDark = localStorage.getItem(storageKey) === 'dark';
  const btn = document.getElementById(btnId);
  
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (btn) btn.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (btn) btn.textContent = '🌙';
  }
}

/**
 * Toggles the dark/light theme and persists the choice in localStorage.
 */
export function toggleTheme(storageKey, btnId) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btn = document.getElementById(btnId);
  
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(storageKey, 'light');
    if (btn) btn.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(storageKey, 'dark');
    if (btn) btn.textContent = '☀️';
  }
}
