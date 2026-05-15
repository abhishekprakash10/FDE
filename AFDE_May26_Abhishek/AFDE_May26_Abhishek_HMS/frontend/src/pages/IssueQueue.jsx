import { useState, useEffect, useCallback } from 'react'
import { listIssues, updateIssue, deleteIssue } from '../data/issueApi'
import { useAuth } from '../context/AuthStore'
import { useToast } from '../components/Toast'
import StatusChip from '../components/StatusChip'
import PriorityFlag from '../components/PriorityFlag'
import IssueDetail from './sheets/IssueDetail'
import IssueEditor from './sheets/IssueEditor'
import DeleteConfirm from './sheets/DeleteConfirm'
import ActivityLog from './sheets/ActivityLog'
import './IssueQueue.css'

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function IssueQueue() {
  const { isAdmin } = useAuth()
  const toast = useToast()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = useCallback(() => {
    setLoading(true)
    listIssues()
      .then(setIssues)
      .catch(() => toast('Failed to load issues.', 'error'))
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => { reload() }, [reload])

  const openDetail = (issue) => { setSelected(issue); setDetailOpen(true) }
  const openEditor = (issue) => {
    setSelected(issue)
    setDetailOpen(false)
    setEditorOpen(true)
  }
  const openDelete = (issue) => {
    setSelected(issue)
    setDetailOpen(false)
    setDeleteOpen(true)
  }
  const openLog = (issue) => {
    setSelected(issue || selected)
    setDetailOpen(false)
    setLogOpen(true)
  }

  const handleSave = async (formData) => {
    setIsSaving(true)
    try {
      await updateIssue(selected.ticket_id, formData)
      toast('Issue updated successfully.', 'success')
      setEditorOpen(false)
      reload()
    } catch (e) {
      toast(e.message || 'Update failed.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteIssue(selected.ticket_id)
      toast(`Issue #${selected.ticket_id} deleted.`, 'success')
      setDeleteOpen(false)
      setSelected(null)
      reload()
    } catch (e) {
      toast(e.message || 'Deletion failed.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="page-content iq-page">
      <div className="iq-header">
        <div>
          <h1 className="iq-heading">Issue Queue</h1>
          <p className="iq-sub">All support tickets — {issues.length} total</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={reload}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>

      <div className="card iq-table-wrap">
        {loading ? (
          <div className="empty-state">
            <div className="spinner spinner-dark" />
            <p>Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>No issues found. Create one to get started.</p>
          </div>
        ) : (
          <table className="iq-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.ticket_id}>
                  <td className="iq-id">#{issue.ticket_id}</td>
                  <td className="iq-name">{issue.employee_name}</td>
                  <td className="iq-dept">{issue.department}</td>
                  <td className="iq-cat">{issue.issue_category}</td>
                  <td><PriorityFlag priority={issue.priority} /></td>
                  <td><StatusChip status={issue.status} /></td>
                  <td className="iq-date">{fmt(issue.created_at)}</td>
                  <td className="iq-actions">
                    <button
                      className="iq-action-btn iq-view"
                      onClick={() => openDetail(issue)}
                      title="View details"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          className="iq-action-btn iq-edit"
                          onClick={() => openEditor(issue)}
                          title="Edit issue"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          className="iq-action-btn iq-delete"
                          onClick={() => openDelete(issue)}
                          title="Delete issue"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                          </svg>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Side Sheets */}
      <IssueDetail
        issue={selected}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        isAdmin={isAdmin}
        onEdit={() => openEditor(selected)}
        onDelete={() => openDelete(selected)}
        onViewLog={() => openLog(selected)}
      />

      <IssueEditor
        issue={selected}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <DeleteConfirm
        issue={selected}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <ActivityLog
        issueId={selected?.ticket_id}
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
      />
    </div>
  )
}
