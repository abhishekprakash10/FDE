import { useEffect } from 'react'
import './SideSheet.css'

export default function SideSheet({ isOpen, onClose, title, headerColor, children, footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="overlay-backdrop" onClick={onClose} />
      <aside className={`sidesheet ${isOpen ? 'sidesheet--open' : ''}`}>
        <div
          className="sidesheet-header"
          style={headerColor ? { background: headerColor } : undefined}
        >
          <h2 className="sidesheet-title">{title}</h2>
          <button className="sidesheet-close" onClick={onClose} aria-label="Close panel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="sidesheet-body">
          {children}
        </div>

        {footer && (
          <div className="sidesheet-footer">
            {footer}
          </div>
        )}
      </aside>
    </>
  )
}
