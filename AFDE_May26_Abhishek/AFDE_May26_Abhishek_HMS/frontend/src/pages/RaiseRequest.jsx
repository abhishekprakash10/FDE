import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIssue } from '../data/issueApi'
import { useAuth } from '../context/AuthStore'
import { useToast } from '../components/Toast'
import './RaiseRequest.css'

const CATEGORIES = [
  'VPN Issue',
  'Password Reset',
  'Software Installation',
  'Laptop Issue',
  'Email Access',
  'Network Connectivity',
  'Hardware Request',
  'Other',
]

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const DEPARTMENTS = [
  'Engineering',
  'Finance',
  'HR',
  'IT',
  'Legal',
  'Marketing',
  'Operations',
  'Product',
  'Sales',
  'Other',
]

const INITIAL_FORM = {
  employee_name: '',
  department: '',
  issue_category: '',
  description: '',
  priority: 'Medium',
}

export default function RaiseRequest() {
  const { username } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    ...INITIAL_FORM,
    employee_name: username || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [newId, setNewId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const result = await createIssue(form)
      setNewId(result.ticket_id)
      setSuccess(true)
      toast(`Issue #${result.ticket_id} submitted successfully!`, 'success')
    } catch (err) {
      toast(err.message || 'Failed to submit request.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    setNewId(null)
    setForm({ ...INITIAL_FORM, employee_name: username || '' })
  }

  if (success) {
    return (
      <div className="page-content rr-page">
        <div className="rr-success-card card">
          <div className="rr-success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <h2 className="rr-success-title">Request Submitted!</h2>
          <p className="rr-success-text">
            Your issue has been registered as <strong>Ticket #{newId}</strong>. Our IT team will review it shortly.
          </p>
          <div className="rr-success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/issues')}>
              View All Issues
            </button>
            <button className="btn btn-ghost" onClick={handleReset}>
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content rr-page">
      <div className="rr-header">
        <div>
          <h1 className="rr-heading">Raise a Request</h1>
          <p className="rr-sub">Describe your IT issue and we'll get it resolved</p>
        </div>
      </div>

      <div className="card rr-form-card">
        <div className="rr-form-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          New Support Request
        </div>

        <form className="rr-form" onSubmit={handleSubmit}>
          <div className="rr-form-row">
            <div className="form-group">
              <label className="form-label">Your Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                name="employee_name"
                value={form.employee_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department <span className="required">*</span></label>
              <select
                className="form-control"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rr-form-row">
            <div className="form-group">
              <label className="form-label">Issue Category <span className="required">*</span></label>
              <select
                className="form-control"
                name="issue_category"
                value={form.issue_category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="priority-radio-group">
                {PRIORITIES.map((p) => (
                  <label
                    key={p}
                    className={`priority-radio ${form.priority === p ? 'priority-radio--active' : ''} priority-radio--${p.toLowerCase()}`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={form.priority === p}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Please describe the issue in detail — what happened, when it started, any error messages..."
              required
            />
            <span className="form-hint">{form.description.length} characters</span>
          </div>

          <div className="rr-form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setForm({ ...INITIAL_FORM, employee_name: username || '' })}
            >
              Clear Form
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="spinner" /> : null}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
