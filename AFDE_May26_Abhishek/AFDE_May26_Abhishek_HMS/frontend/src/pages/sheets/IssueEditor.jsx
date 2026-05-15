import { useState, useEffect } from 'react'
import SideSheet from '../../components/SideSheet'

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Rejected']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
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

export default function IssueEditor({ issue, isOpen, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({
    employee_name: '',
    department: '',
    issue_category: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    resolution_notes: '',
    changed_by: '',
  })

  useEffect(() => {
    if (issue) {
      setForm({
        employee_name: issue.employee_name || '',
        department: issue.department || '',
        issue_category: issue.issue_category || '',
        description: issue.description || '',
        priority: issue.priority || 'Medium',
        status: issue.status || 'Open',
        resolution_notes: issue.resolution_notes || '',
        changed_by: '',
      })
    }
  }, [issue])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  if (!issue) return null

  const footer = (
    <>
      <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={isSaving}>
        Cancel
      </button>
      <button
        className="btn btn-primary btn-sm"
        form="issue-editor-form"
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? <span className="spinner" /> : null}
        Save Changes
      </button>
    </>
  )

  return (
    <SideSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Issue #${issue.ticket_id}`}
      footer={footer}
    >
      <form id="issue-editor-form" className="sheet-form" onSubmit={handleSubmit}>
        <div className="sheet-form-row">
          <div className="form-group">
            <label className="form-label">Employee Name</label>
            <input
              type="text"
              className="form-control"
              name="employee_name"
              value={form.employee_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="sheet-form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              name="issue_category"
              value={form.issue_category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-control"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Resolution Notes</label>
          <textarea
            className="form-control"
            name="resolution_notes"
            value={form.resolution_notes}
            onChange={handleChange}
            rows={3}
            placeholder="Describe how the issue was resolved (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Updated By <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input
            type="text"
            className="form-control"
            name="changed_by"
            value={form.changed_by}
            onChange={handleChange}
            placeholder="Your name (required for audit log)"
            required
          />
        </div>
      </form>
    </SideSheet>
  )
}
