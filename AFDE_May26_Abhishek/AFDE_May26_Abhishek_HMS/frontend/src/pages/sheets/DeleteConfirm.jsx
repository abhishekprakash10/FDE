import SideSheet from '../../components/SideSheet'
import './DeleteConfirm.css'

export default function DeleteConfirm({ issue, isOpen, onClose, onConfirm, isDeleting }) {
  if (!issue) return null

  const footer = (
    <>
      <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={isDeleting}>
        Cancel
      </button>
      <button
        className="btn btn-danger btn-sm"
        onClick={onConfirm}
        disabled={isDeleting}
      >
        {isDeleting ? <span className="spinner" /> : null}
        Yes, Delete
      </button>
    </>
  )

  return (
    <SideSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      headerColor="#b91c1c"
      footer={footer}
    >
      <div className="delete-confirm-body">
        <div className="delete-warn-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 className="delete-heading">Delete Issue #{issue.ticket_id}?</h3>
        <p className="delete-sub">
          You are about to permanently delete the issue submitted by{' '}
          <strong>{issue.employee_name}</strong> regarding{' '}
          <em>{issue.issue_category}</em>.
        </p>
        <p className="delete-warn-text">
          This action cannot be undone. All activity logs for this issue will also be removed.
        </p>
      </div>
    </SideSheet>
  )
}
