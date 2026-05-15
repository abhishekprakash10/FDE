/**
 * Notification.jsx — Bottom-left pill-shaped toast notifications
 * Auto-dismisses after 3.5 seconds.
 * Usage: wrap app in <NotificationProvider>, then call useNotify() hook
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import './Notification.css'

const NotificationContext = createContext(null)

const ICONS = { success: '✓', error: '✕', info: 'ℹ' }
const DISMISS_DELAY = 3500
const ANIM_DURATION = 300

let nextId = 1

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([])
  const timersRef = useRef({})

  const dismiss = useCallback((id) => {
    // Mark as dismissing to play exit animation
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, dismissing: true } : n)))
    // Remove after animation
    setTimeout(() => {
      setItems((prev) => prev.filter((n) => n.id !== id))
      delete timersRef.current[id]
    }, ANIM_DURATION)
  }, [])

  const notify = useCallback(
    (message, type = 'info') => {
      const id = nextId++
      setItems((prev) => [...prev, { id, message, type, dismissing: false }])
      // Auto-dismiss
      timersRef.current[id] = setTimeout(() => dismiss(id), DISMISS_DELAY)
    },
    [dismiss]
  )

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className="notification-container" role="status" aria-live="polite">
        {items.map(({ id, message, type, dismissing }) => (
          <div
            key={id}
            className={`notification ${type}${dismissing ? ' dismissing' : ''}`}
          >
            <span className="notif-icon" aria-hidden="true">{ICONS[type] || 'ℹ'}</span>
            <span className="notif-message">{message}</span>
            <button
              className="notif-dismiss"
              onClick={() => dismiss(id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotify() {
  const fn = useContext(NotificationContext)
  if (!fn) throw new Error('useNotify must be used inside <NotificationProvider>')
  return fn
}
