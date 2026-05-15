/**
 * EntryForm.jsx — Drawer form for editing an existing survey entry (admin only)
 */

import React, { useState, useEffect } from 'react'
import Dialog from '../../widgets/Dialog'
import RatingSelector from '../../widgets/RatingSelector'
import { patchEntry } from '../../data/surveyApi'
import { useNotify } from '../../widgets/Notification'

export default function EntryForm({ entry, onClose, onSaved }) {
  const notify = useNotify()
  const [form, setForm] = useState({ respondent_name: '', course_name: '', score: 0, remarks: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (entry) {
      setForm({
        respondent_name: entry.respondent_name || '',
        course_name: entry.course_name || '',
        score: entry.score || 0,
        remarks: entry.remarks || '',
      })
    }
  }, [entry])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.score) {
      notify('Please select a score.', 'error')
      return
    }
    setSaving(true)
    try {
      const updated = await patchEntry(entry.entry_id, form)
      notify('Entry updated successfully.', 'success')
      onSaved(updated)
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to update entry.'
      notify(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const footer = (
    <>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={saving}>
        Cancel
      </button>
      <button type="submit" form="entry-edit-form" className="btn btn-primary btn-sm" disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </>
  )

  return (
    <Dialog isOpen={!!entry} onClose={onClose} title="Edit Entry" footer={footer}>
      <form id="entry-edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="ef-name">Respondent Name</label>
          <input
            id="ef-name"
            name="respondent_name"
            className="form-control"
            value={form.respondent_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ef-course">Program / Course</label>
          <input
            id="ef-course"
            name="course_name"
            className="form-control"
            value={form.course_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <RatingSelector
            label="Score"
            value={form.score}
            onChange={(val) => setForm((prev) => ({ ...prev, score: val }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ef-remarks">Remarks (optional)</label>
          <textarea
            id="ef-remarks"
            name="remarks"
            className="form-control"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Any additional comments…"
          />
        </div>
      </form>
    </Dialog>
  )
}
