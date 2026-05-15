import { useEffect, useState } from 'react'
import SideSheet from '../../components/SideSheet'
import { getChangelog } from '../../data/issueApi'
import './ActivityLog.css'

const STATUS_DOT_COLORS = {
  'Open': '#2563eb',
  'In Progress': '#b45309',
  'Resolved': '#047857',
  'Rejected': '#b91c1c',
}

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ActivityLog({ issueId, isOpen, onClose }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen || !issueId) return
    setLoading(true)
    setError('')
    getChangelog(issueId)
      .then(setEntries)
      .catch((e) => setError(e.message || 'Failed to load activity log.'))
      .finally(() => setLoading(false))
  }, [isOpen, issueId])

  return (
    <SideSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Activity Log — Issue #${issueId}`}
    >
      {loading && (
        <div className="empty-state">
          <div className="spinner spinner-dark" />
          <p>Loading history...</p>
        </div>
      )}

      {error && (
        <div className="alert-error">{error}</div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="empty-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <p>No activity recorded yet.</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="activity-timeline">
          {entries.map((entry, idx) => {
            const dotColor = STATUS_DOT_COLORS[entry.to_status] || '#94a3b8'
            const isLast = idx === entries.length - 1
            return (
              <div key={entry.id} className={`timeline-item ${isLast ? 'timeline-item--last' : ''}`}>
                <div className="timeline-left">
                  <div
                    className="timeline-dot"
                    style={{ background: dotColor, borderColor: dotColor }}
                  />
                  {!isLast && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-transition">
                    {entry.from_status ? (
                      <>
                        <span className="tl-status tl-from">{entry.from_status}</span>
                        <span className="tl-arrow">→</span>
                        <span className="tl-status tl-to" style={{ color: dotColor }}>{entry.to_status}</span>
                      </>
                    ) : (
                      <span className="tl-status tl-to" style={{ color: dotColor }}>
                        Created as {entry.to_status}
                      </span>
                    )}
                  </div>
                  <div className="timeline-meta">
                    <span className="tl-by">by {entry.changed_by}</span>
                    <span className="tl-when">{fmt(entry.changed_at)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </SideSheet>
  )
}
