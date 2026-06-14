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

export function toggleVoiceInput(targetEl, btnEl, onToast) {
  const rec = getRecognition()
  if (!rec) {
    if (onToast) onToast('Voice input not supported in this browser. Use Chrome.')
    return
  }

  if (activeTarget === targetEl) {
    rec.stop()
    if (btnEl) btnEl.classList.remove('mic-active')
    activeTarget = null
    activeBtn = null
    return
  }

  if (activeTarget) {
    rec.stop()
    if (activeBtn) activeBtn.classList.remove('mic-active')
  }

  activeTarget = targetEl
  activeBtn = btnEl

  let interim = ''
  const base = targetEl.value || ''

  rec.onresult = (e) => {
    let final = ''
    interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript
      else interim += e.results[i][0].transcript
    }
    targetEl.value = base + final + interim
    targetEl.dispatchEvent(new Event('input', { bubbles: true }))
  }

  rec.onerror = (e) => {
    if (e.error === 'not-allowed') {
      if (onToast) onToast('Mic blocked. Click the 🔒 icon in Chrome address bar → Allow microphone.')
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
