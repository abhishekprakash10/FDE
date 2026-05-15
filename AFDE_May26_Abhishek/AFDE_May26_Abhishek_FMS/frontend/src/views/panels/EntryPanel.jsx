/**
 * EntryPanel.jsx — Read-only detail drawer for a survey entry
 */

import React from 'react'
import Dialog from '../../widgets/Dialog'
import ScoreMeter from '../../widgets/ScoreMeter'

function DetailRow({ label, value }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: '0.95rem', color: 'var(--text)' }}>{value || <em style={{ color: 'var(--text-light)' }}>Not provided</em>}</div>
    </div>
  )
}

export default function EntryPanel({ entry, onClose }) {
  if (!entry) return null

  const recorded = entry.recorded_at
    ? new Date(entry.recorded_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

  return (
    <Dialog isOpen={!!entry} onClose={onClose} title="Entry Details">
      <DetailRow label="Respondent" value={entry.respondent_name} />
      <DetailRow label="Program / Course" value={entry.course_name} />
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>
          Score
        </div>
        <ScoreMeter score={entry.score} showFraction showLabel />
      </div>
      <DetailRow label="Remarks" value={entry.remarks} />
      <DetailRow label="Submitted" value={recorded} />

      <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Entry ID</div>
        <div style={{ fontSize: '0.88rem', fontFamily: 'monospace', color: 'var(--text)' }}>#{entry.entry_id}</div>
      </div>
    </Dialog>
  )
}
