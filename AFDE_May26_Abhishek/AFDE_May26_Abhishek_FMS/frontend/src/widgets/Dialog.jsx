/**
 * Dialog.jsx — Right-side slide-in drawer panel
 * Closes on backdrop click or Escape key.
 */

import React, { useEffect } from 'react'
import './Dialog.css'

export default function Dialog({ isOpen, onClose, title, children, footer }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="dialog-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Prevent clicks inside the panel from closing the dialog */}
      <div className="dialog-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
          <button className="dialog-close" onClick={onClose} aria-label="Close panel">
            ×
          </button>
        </div>

        <div className="dialog-body">{children}</div>

        {footer && <div className="dialog-footer">{footer}</div>}
      </div>
    </div>
  )
}
