let recognition = null
let activeTarget = null
let activeBtn = null

function getRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  if (!recognition) {
    recognition = new SR()
    recognition.lang = 'en-IN'
    recognition.continuous = true
    recognition.interimResults = true
  }
  return recognition
}

// Unwrap React refs ({ current: el }) or pass-through plain DOM elements
function unwrap(x) {
  return (x && typeof x === 'object' && 'current' in x) ? x.current : x
}

// Use native property setter so React's synthetic onChange fires correctly
function setNativeValue(el, value) {
  if (!el) return
  const isTA = el.tagName === 'TEXTAREA'
  const proto = isTA ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
  if (setter) setter.call(el, value)
  else el.value = value
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

export function toggleVoiceInput(targetOrRef, btnOrRef, onToast) {
  const rec = getRecognition()
  if (!rec) {
    if (onToast) onToast('Voice input not supported. Use Chrome.')
    return
  }

  const targetEl = unwrap(targetOrRef)
  const btnEl = unwrap(btnOrRef)

  if (!targetEl) return

  // Toggle off if same target
  if (activeTarget === targetEl) {
    rec.stop()
    if (btnEl) btnEl.classList.remove('mic-active')
    activeTarget = null
    activeBtn = null
    return
  }

  // Stop previous
  if (activeTarget) {
    rec.stop()
    if (activeBtn) activeBtn.classList.remove('mic-active')
  }

  activeTarget = targetEl
  activeBtn = btnEl

  const base = targetEl.value || ''
  let accumulated = ''

  rec.onresult = (e) => {
    let interim = ''
    accumulated = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) accumulated += e.results[i][0].transcript
      else interim += e.results[i][0].transcript
    }
    setNativeValue(targetEl, base + accumulated + interim)
  }

  rec.onerror = (e) => {
    if (e.error === 'not-allowed') {
      if (onToast) onToast('Mic blocked. Click 🔒 in Chrome address bar → Allow microphone.')
    } else if (e.error !== 'aborted') {
      if (onToast) onToast('Mic error: ' + e.error)
    }
    if (btnEl) btnEl.classList.remove('mic-active')
    activeTarget = null
    activeBtn = null
  }

  rec.onend = () => {
    if (activeTarget === targetEl) {
      try { rec.start() } catch {}
    }
  }

  if (btnEl) btnEl.classList.add('mic-active')
  try { rec.start() } catch {}
}

export function stopAllVoice() {
  if (recognition) {
    try { recognition.stop() } catch {}
  }
  if (activeBtn) activeBtn.classList.remove('mic-active')
  activeTarget = null
  activeBtn = null
}
