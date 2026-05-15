import './Badges.css'

const PRIORITY_CONFIG = {
  'Low': { cls: 'flag-low', label: 'Low' },
  'Medium': { cls: 'flag-medium', label: 'Medium' },
  'High': { cls: 'flag-high', label: 'High' },
  'Critical': { cls: 'flag-critical', label: 'Critical' },
}

export default function PriorityFlag({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || { cls: 'flag-medium', label: priority }
  return <span className={`priority-flag ${cfg.cls}`}>{cfg.label}</span>
}
