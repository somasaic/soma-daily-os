let activeRecognition = null;
let activeTargetId = null;
let activeBtnId = null;
const micCommits = {};

/**
 * Checks if Speech Recognition is supported in the browser.
 */
export function isSpeechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Handles mic error alerts.
 */
function handleMicError(error, targetId, btnId, toastCallback) {
  const msgs = {
    'not-allowed': '🚫 Mic blocked — allow microphone in browser site settings and retry.',
    'network': '🌐 Network error — voice recognition requires an internet connection.',
  };
  const msg = msgs[error];
  if (msg) {
    if (toastCallback) toastCallback(msg);
    else alert(msg);
  }
  
  stopVoiceInput(targetId, btnId);
}

/**
 * Stops current active voice recognition.
 */
export function stopVoiceInput(targetId, btnId) {
  if (activeRecognition) {
    try {
      activeRecognition.onend = null;
      activeRecognition.onerror = null;
      activeRecognition.stop();
    } catch (e) {}
    activeRecognition = null;
  }
  
  const btn = document.getElementById(btnId || 'mic-btn-' + targetId);
  if (btn) {
    btn.classList.remove('mic-active');
    btn.classList.remove('active');
    btn.textContent = '🎙️';
  }
  
  delete micCommits[targetId];
  activeTargetId = null;
  activeBtnId = null;
}

/**
 * Starts the Web Speech API recognition process.
 */
function startSpeechService(targetId, btnId, toastCallback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = document.getElementById(btnId || 'mic-btn-' + targetId);
  const textarea = document.getElementById(targetId);
  if (!textarea) return;

  // Stop current if running
  if (activeRecognition) {
    stopVoiceInput(activeTargetId, activeBtnId);
  }

  const recog = new SpeechRecognition();
  recog.lang = 'en-IN';
  recog.interimResults = true;
  recog.continuous = true;
  recog.maxAlternatives = 1;

  activeRecognition = recog;
  activeTargetId = targetId;
  activeBtnId = btnId;
  
  // Initialize committed text from current textarea content
  micCommits[targetId] = textarea.value;

  if (btn) {
    btn.classList.add('mic-active');
    btn.classList.add('active');
    btn.textContent = '⏹️';
  }

  recog.onresult = e => {
    let interimText = '';
    let finalChunk = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        finalChunk += e.results[i][0].transcript + ' ';
      } else {
        interimText += e.results[i][0].transcript;
      }
    }
    if (finalChunk) {
      const sep = micCommits[targetId].trimEnd().length > 0 ? ' ' : '';
      micCommits[targetId] = micCommits[targetId].trimEnd() + sep + finalChunk.trimEnd();
    }
    
    const ta = document.getElementById(targetId);
    if (ta) {
      const committed = micCommits[targetId];
      const sep = committed.trimEnd().length > 0 && interimText.length > 0 ? ' ' : '';
      ta.value = committed + sep + interimText;
      // Trigger input event to update char counts / autosizes if any
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  recog.onerror = e => {
    if (e.error !== 'no-speech' && e.error !== 'aborted') {
      handleMicError(e.error, targetId, btnId, toastCallback);
    }
  };

  recog.onend = () => {
    // Auto-restart on silence if this is still the active session
    if (activeTargetId === targetId && activeRecognition === recog) {
      const ta = document.getElementById(targetId);
      if (ta && ta.value.trim()) {
        micCommits[targetId] = ta.value;
      }
      try {
        recog.start();
      } catch (e2) {
        stopVoiceInput(targetId, btnId);
      }
    }
  };

  recog.start();
}

/**
 * Toggles voice recognition for a target textarea/input.
 */
export function toggleVoiceInput(targetId, btnId = null, toastCallback = null) {
  if (!isSpeechSupported()) {
    const errorMsg = 'Voice input requires Chrome/Edge browser. Firefox/Safari are not supported.';
    if (toastCallback) toastCallback(errorMsg);
    else alert(errorMsg);
    return;
  }

  // If already recording this target — STOP
  if (activeRecognition && activeTargetId === targetId) {
    stopVoiceInput(targetId, btnId);
    return;
  }

  // Request mic permission explicitly via getUserMedia to prompt the user
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Release stream, SpeechRecognition will manage its own audio capturing
        stream.getTracks().forEach(t => t.stop());
        startSpeechService(targetId, btnId, toastCallback);
      })
      .catch(() => {
        const errorMsg = '🚫 Microphone access denied. Please click the Lock icon in address bar to allow mic access.';
        if (toastCallback) toastCallback(errorMsg);
        else alert(errorMsg);
      });
  } else {
    // Fallback direct start
    startSpeechService(targetId, btnId, toastCallback);
  }
}
