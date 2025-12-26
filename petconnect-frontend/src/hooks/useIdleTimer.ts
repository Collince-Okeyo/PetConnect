import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIdleTimerOptions {
  timeout: number // milliseconds until idle
  warningTime: number // milliseconds to show warning before logout
  onIdle: () => void // callback when user becomes idle
  onWarning: () => void // callback when warning should show
  onActive: () => void // callback when user becomes active again
}

export function useIdleTimer({
  timeout,
  warningTime,
  onIdle,
  onWarning,
  onActive
}: UseIdleTimerOptions) {
  const [isIdle, setIsIdle] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  
  const timeoutRef = useRef<number>()
  const warningTimeoutRef = useRef<number>()
  const countdownIntervalRef = useRef<number>()
  const lastActivityRef = useRef<number>(Date.now())

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    if (warningTimeoutRef.current) window.clearTimeout(warningTimeoutRef.current)
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current)
  }, [])

  const startCountdown = useCallback(() => {
    setRemainingTime(warningTime)
    
    countdownIntervalRef.current = window.setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1000) {
          if (countdownIntervalRef.current) {
            window.clearInterval(countdownIntervalRef.current)
          }
          return 0
        }
        return prev - 1000
      })
    }, 1000)
  }, [warningTime])

  const resetTimer = useCallback(() => {
    clearTimers()
    setIsIdle(false)
    setShowWarning(false)
    setRemainingTime(0)
    lastActivityRef.current = Date.now()

    // Set warning timeout
    warningTimeoutRef.current = window.setTimeout(() => {
      setShowWarning(true)
      onWarning()
      startCountdown()
    }, timeout - warningTime)

    // Set idle timeout
    timeoutRef.current = window.setTimeout(() => {
      setIsIdle(true)
      onIdle()
    }, timeout)
  }, [timeout, warningTime, onIdle, onWarning, clearTimers, startCountdown])

  const handleActivity = useCallback(() => {
    const now = Date.now()
    // Debounce: only reset if more than 1 second since last activity
    if (now - lastActivityRef.current > 1000) {
      if (showWarning || isIdle) {
        onActive()
      }
      resetTimer()
    }
  }, [showWarning, isIdle, onActive, resetTimer])

  useEffect(() => {
    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Start initial timer
    resetTimer()

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      clearTimers()
    }
  }, [handleActivity, resetTimer, clearTimers])

  return {
    isIdle,
    showWarning,
    remainingTime,
    resetTimer
  }
}
