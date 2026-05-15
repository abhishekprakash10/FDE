import './Badges.css'

const STATUS_CONFIG = {
  'Open': { cls: 'chip-open', label: 'Open' },
  'In Progress': { cls: 'chip-inprogress', label: 'In Progress' },
  'Resolved': { cls: 'chip-resolved', label: 'Resolved' },
  'Rejected': { cls: 'chip-rejected', label: 'Rejected' },
}

export default function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status] || { cls: 'chip-open', label: status }
  return <span className={`status-chip ${cfg.cls}`}>{cfg.label}</span>
}
