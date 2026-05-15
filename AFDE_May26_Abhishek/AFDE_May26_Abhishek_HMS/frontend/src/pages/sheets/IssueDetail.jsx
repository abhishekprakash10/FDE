import SideSheet from '../../components/SideSheet'
import StatusChip from '../../components/StatusChip'
import PriorityFlag from '../../components/PriorityFlag'
import '../../components/SideSheet.css'

const STATUS_COLORS = {
  'Open': '#1d4ed8',
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

export default function IssueDetail({ issue, isOpen, onClose, isAdmin, onEdit, onDelete, onViewLog }) {
  if (!issue) return null

  const headerColor = STATUS_COLORS[issue.status] || '#1e3a5f'

  const footer = (
    <>
      <button className="btn btn-ghost btn-sm" onClick={onViewLog}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Activity Log
      </button>
      {isAdmin && (
        <>
          <button className="btn btn-primary btn-sm" onClick={onEdit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Issue
          </button>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
            Delete
          </button>
        </>
      )}
    </>
  )

  return (
    <SideSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Issue #${issue.ticket_id}`}
      headerColor={headerColor}
      footer={footer}
    >
      <div className="detail-meta-row">
        <StatusChip status={issue.status} />
        <PriorityFlag priority={issue.priority} />
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 'auto' }}>
          {fmt(issue.created_at)}
        </span>
      </div>

      <div className="detail-grid">
        <div className="detail-field">
          <span className="detail-label">Employee</span>
          <span className="detail-value">{issue.employee_name}</span>
        </div>
        <div className="detail-field">
          <span className="detail-label">Department</span>
          <span className="detail-value">{issue.department}</span>
        </div>
        <div className="detail-field">
          <span className="detail-label">Category</span>
          <span className="detail-value">{issue.issue_category}</span>
        </div>
        <div className="detail-field">
          <span className="detail-label">Priority</span>
          <span className="detail-value">{issue.priority}</span>
        </div>
        <div className="detail-field full-width">
          <span className="detail-label">Description</span>
          <div className="detail-notes-box">{issue.description}</div>
        </div>
        {issue.resolution_notes && (
          <div className="detail-field full-width">
            <span className="detail-label">Resolution Notes</span>
            <div className="detail-notes-box">{issue.resolution_notes}</div>
          </div>
        )}
      </div>
    </SideSheet>
  )
}
