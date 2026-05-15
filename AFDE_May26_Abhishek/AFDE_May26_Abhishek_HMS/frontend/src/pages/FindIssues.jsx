import { useState } from 'react'
import { searchIssues } from '../data/issueApi'
import { useAuth } from '../context/AuthStore'
import { useToast } from '../components/Toast'
import StatusChip from '../components/StatusChip'
import PriorityFlag from '../components/PriorityFlag'
import IssueDetail from './sheets/IssueDetail'
import IssueEditor from './sheets/IssueEditor'
import DeleteConfirm from './sheets/DeleteConfirm'
import ActivityLog from './sheets/ActivityLog'
import { updateIssue, deleteIssue } from '../data/issueApi'
import './FindIssues.css'

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

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Rejected']

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function FindIssues() {
  const { isAdmin } = useAuth()
  const toast = useToast()

  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)

  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!keyword.trim() && !category && !status) {
      toast('Enter at least one search criterion.', 'warning')
      return
    }
    setSearching(true)
    try {
      const params = {}
      if (keyword.trim()) params.keyword = keyword.trim()
      if (category) params.category = category
      if (status) params.status = status
      const data = await searchIssues(params)
      setResults(data)
      setSearched(true)
    } catch (err) {
      toast(err.message || 'Search failed.', 'error')
    } finally {
      setSearching(false)
    }
  }

  const handleReset = () => {
    setKeyword('')
    setCategory('')
    setStatus('')
    setResults([])
    setSearched(false)
  }

  const openDetail = (issue) => { setSelected(issue); setDetailOpen(true) }
  const openEditor = (issue) => { setSelected(issue); setDetailOpen(false); setEditorOpen(true) }
  const openDelete = (issue) => { setSelected(issue); setDetailOpen(false); setDeleteOpen(true) }
  const openLog = () => { setDetailOpen(false); setLogOpen(true) }

  const handleSave = async (formData) => {
    setIsSaving(true)
    try {
      await updateIssue(selected.ticket_id, formData)
      toast('Issue updated.', 'success')
      setEditorOpen(false)
      // Refresh results
      if (searched) {
        const params = {}
        if (keyword.trim()) params.keyword = keyword.trim()
        if (category) params.category = category
        if (status) params.status = status
        const data = await searchIssues(params)
        setResults(data)
      }
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
      setResults((prev) => prev.filter((i) => i.ticket_id !== selected.ticket_id))
      setSelected(null)
    } catch (e) {
      toast(e.message || 'Deletion failed.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="page-content fi-page">
      <div className="fi-header">
        <div>
          <h1 className="fi-heading">Find Issues</h1>
          <p className="fi-sub">Search and filter the issue database</p>
        </div>
      </div>

      {/* Search Panel */}
      <div className="card fi-search-panel">
        <form className="fi-search-form" onSubmit={handleSearch}>
          <div className="fi-search-inputs">
            <div className="form-group fi-keyword-group">
              <label className="form-label">Keyword</label>
              <div className="fi-search-input-wrap">
                <svg className="fi-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="form-control fi-search-input"
                  placeholder="Search by name, department, description..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="fi-search-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className="btn btn-primary" disabled={searching}>
              {searching ? <span className="spinner" /> : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              )}
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="card fi-results">
          <div className="fi-results-header">
            <span className="fi-results-count">
              {results.length === 0 ? 'No results' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No issues match your search criteria.</p>
            </div>
          ) : (
            <table className="fi-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Dept</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((issue) => (
                  <tr key={issue.ticket_id}>
                    <td className="fi-id">#{issue.ticket_id}</td>
                    <td>{issue.employee_name}</td>
                    <td className="fi-muted">{issue.department}</td>
                    <td className="fi-muted">{issue.issue_category}</td>
                    <td><PriorityFlag priority={issue.priority} /></td>
                    <td><StatusChip status={issue.status} /></td>
                    <td className="fi-muted fi-date">{fmt(issue.created_at)}</td>
                    <td className="fi-actions">
                      <button
                        className="iq-action-btn iq-view"
                        onClick={() => openDetail(issue)}
                        title="View"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            className="iq-action-btn iq-edit"
                            onClick={() => openEditor(issue)}
                            title="Edit"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            className="iq-action-btn iq-delete"
                            onClick={() => openDelete(issue)}
                            title="Delete"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
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
      )}

      {/* Sheets */}
      <IssueDetail
        issue={selected}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        isAdmin={isAdmin}
        onEdit={() => openEditor(selected)}
        onDelete={() => openDelete(selected)}
        onViewLog={openLog}
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
