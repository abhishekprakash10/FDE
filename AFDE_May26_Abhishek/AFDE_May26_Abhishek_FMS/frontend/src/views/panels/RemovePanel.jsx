/**
 * RemovePanel.jsx — Confirmation drawer for deleting a survey entry (admin only)
 */

import React, { useState } from 'react'
import Dialog from '../../widgets/Dialog'
import { removeEntry } from '../../data/surveyApi'
import { useNotify } from '../../widgets/Notification'

export default function RemovePanel({ entry, onClose, onRemoved }) {
  const notify = useNotify()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await removeEntry(entry.entry_id)
      notify('Entry deleted.', 'success')
      onRemoved(entry.entry_id)
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to delete entry.'
      notify(msg, 'error')
    } finally {
      setDeleting(false)
    }
  }

  const footer = (
    <>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={deleting}>
        Cancel
      </button>
      <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Yes, Delete'}
      </button>
    </>
  )

  return (
    <Dialog isOpen={!!entry} onClose={onClose} title="Delete Entry" footer={footer}>
      {entry && (
        <div>
          <p style={{ marginBottom: '1rem', color: 'var(--text)', lineHeight: 1.7 }}>
            Are you sure you want to delete the entry from{' '}
            <strong>{entry.respondent_name}</strong> for{' '}
            <strong>{entry.course_name}</strong>?
          </p>
          <div style={{
            padding: '0.85rem',
            background: 'var(--danger-light)',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius)',
            fontSize: '0.88rem',
            color: '#b91c1c'
          }}>
            This action cannot be undone.
          </div>
        </div>
      )}
    </Dialog>
  )
}
