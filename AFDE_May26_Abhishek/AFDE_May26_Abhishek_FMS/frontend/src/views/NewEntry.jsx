/**
 * NewEntry.jsx — Form page to submit a new feedback entry
 */

import React, { useState } from 'react'
import RatingSelector from '../widgets/RatingSelector'
import { submitEntry } from '../data/surveyApi'
import { useNotify } from '../widgets/Notification'
import './NewEntry.css'

const EMPTY_FORM = { respondent_name: '', course_name: '', score: 0, remarks: '' }

export default function NewEntry() {
  const notify = useNotify()
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.score) {
      notify('Please select a score before submitting.', 'error')
      return
    }
    setSubmitting(true)
    try {
      await submitEntry({
        respondent_name: form.respondent_name,
        course_name: form.course_name,
        score: form.score,
        remarks: form.remarks || null,
      })
      notify('Feedback submitted successfully!', 'success')
      setForm({ ...EMPTY_FORM })
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to submit feedback.'
      notify(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setForm({ ...EMPTY_FORM })
  }

  return (
    <div className="new-entry-page">
      <h1>New Entry</h1>
      <p className="new-entry-subtitle">Submit your feedback for a program or event</p>

      <div className="card new-entry-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="ne-name">Your Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              id="ne-name"
              name="respondent_name"
              className="form-control"
              placeholder="Enter your full name"
              value={form.respondent_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ne-course">Program / Event <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              id="ne-course"
              name="course_name"
              className="form-control"
              placeholder="e.g. React Fundamentals Workshop"
              value={form.course_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <RatingSelector
              label={<>Score <span style={{ color: 'var(--danger)' }}>*</span></>}
              value={form.score}
              onChange={(val) => setForm((prev) => ({ ...prev, score: val }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ne-remarks">Remarks <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              id="ne-remarks"
              name="remarks"
              className="form-control"
              placeholder="Share any additional thoughts or suggestions…"
              value={form.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="new-entry-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleReset}
              disabled={submitting}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
