/**
 * Entries.jsx — Table of all feedback entries with view / edit / delete actions
 */

import React, { useEffect, useState } from 'react'
import { fetchAll } from '../data/surveyApi'
import ScoreMeter from '../widgets/ScoreMeter'
import EntryPanel from './panels/EntryPanel'
import EntryForm from './panels/EntryForm'
import RemovePanel from './panels/RemovePanel'
import { useSession } from '../context/SessionContext'
import { useNotify } from '../widgets/Notification'
import './Entries.css'

export default function Entries() {
  const { isAdmin } = useSession()
  const notify = useNotify()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const [viewEntry, setViewEntry] = useState(null)
  const [editEntry, setEditEntry] = useState(null)
  const [deleteEntry, setDeleteEntry] = useState(null)

  useEffect(() => {
    fetchAll()
      .then(setEntries)
      .catch(() => notify('Could not load entries.', 'error'))
      .finally(() => setLoading(false))
  }, [])

  function handleSaved(updated) {
    setEntries((prev) => prev.map((e) => (e.entry_id === updated.entry_id ? updated : e)))
  }

  function handleRemoved(id) {
    setEntries((prev) => prev.filter((e) => e.entry_id !== id))
  }

  if (loading) {
    return (
      <div className="entries-page" style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: '3rem' }}>
        <div className="spinner" /> Loading entries…
      </div>
    )
  }

  return (
    <div className="entries-page">
      <h1>All Entries</h1>
      <p className="entries-subtitle">Complete list of submitted feedback</p>

      <div className="entries-toolbar">
        <span className="entries-count">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
      </div>

      {entries.length === 0 ? (
        <div className="card empty-state">
          <span className="empty-icon">📋</span>
          <p>No feedback has been submitted yet.</p>
        </div>
      ) : (
        <div className="table-wrapper card">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Respondent</th>
                <th>Program</th>
                <th>Score</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={entry.entry_id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{idx + 1}</td>
                  <td>
                    <div className="respondent-cell">
                      <div className="respondent-badge">
                        {entry.respondent_name.charAt(0).toUpperCase()}
                      </div>
                      {entry.respondent_name}
                    </div>
                  </td>
                  <td>{entry.course_name}</td>
                  <td>
                    <ScoreMeter score={entry.score} showFraction showLabel={false} />
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {new Date(entry.recorded_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </td>
                  <td>
                    <div className="entries-actions">
                      <button
                        className="action-icon-btn"
                        onClick={() => setViewEntry(entry)}
                        title="View details"
                        aria-label="View entry"
                      >
                        👁
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            className="action-icon-btn"
                            onClick={() => setEditEntry(entry)}
                            title="Edit entry"
                            aria-label="Edit entry"
                          >
                            ✏
                          </button>
                          <button
                            className="action-icon-btn danger"
                            onClick={() => setDeleteEntry(entry)}
                            title="Delete entry"
                            aria-label="Delete entry"
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Panels */}
      <EntryPanel entry={viewEntry} onClose={() => setViewEntry(null)} />
      <EntryForm entry={editEntry} onClose={() => setEditEntry(null)} onSaved={handleSaved} />
      <RemovePanel entry={deleteEntry} onClose={() => setDeleteEntry(null)} onRemoved={handleRemoved} />
    </div>
  )
}
