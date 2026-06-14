import { useState, useCallback, useRef } from 'react'

export function useToast() {
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)
  const timer = useRef(null)

  const toast = useCallback((message, duration = 2200) => {
    setMsg(message)
    setShow(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShow(false), duration)
  }, [])

  return { toast, toastMsg: msg, toastShow: show }
}

export function Toast({ msg, show }) {
  return <div className={`toast${show ? ' show' : ''}`}>{msg}</div>
}
