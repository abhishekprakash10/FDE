import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listIssues } from '../data/issueApi'
import StatusChip from '../components/StatusChip'
import PriorityFlag from '../components/PriorityFlag'
import './CommandCenter.css'

const CATEGORY_ICONS = {
  'VPN Issue': '🔒',
  'Password Reset': '🔑',
  'Software Installation': '💾',
  'Laptop Issue': '💻',
  'Email Access': '📧',
  'Network Connectivity': '🌐',
  'Hardware Request': '🖥️',
  'Other': '📋',
}

function StatBox({ count, label, colorClass, icon }) {
  return (
    <div className={`stat-box ${colorClass}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-count">{count}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function CommandCenter() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    listIssues()
      .then(setIssues)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total = issues.length
  const openCount = issues.filter((i) => i.status === 'Open').length
  const inProgressCount = issues.filter((i) => i.status === 'In Progress').length
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length

  const recent = issues.slice(0, 8)

  // Category breakdown
  const catBreakdown = issues.reduce((acc, issue) => {
    acc[issue.issue_category] = (acc[issue.issue_category] || 0) + 1
    return acc
  }, {})
  const catEntries = Object.entries(catBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 6)

  if (loading) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="spinner spinner-dark" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content cc-page">
      <div className="cc-header">
        <div>
          <h1 className="cc-heading">Command Center</h1>
          <p className="cc-subheading">Real-time overview of all support issues</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/raise')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Request
        </button>
      </div>

      {/* Stats Grid */}
      <div className="cc-stats-grid">
        <StatBox
          count={total}
          label="Total Issues"
          colorClass="stat-total"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          }
        />
        <StatBox
          count={openCount}
          label="Open"
          colorClass="stat-open"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          }
        />
        <StatBox
          count={inProgressCount}
          label="In Progress"
          colorClass="stat-inprogress"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
            </svg>
          }
        />
        <StatBox
          count={resolvedCount}
          label="Resolved"
          colorClass="stat-resolved"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
        />
      </div>

      <div className="cc-lower">
        {/* Recent Issues */}
        <div className="card cc-recent">
          <div className="cc-section-header">
            <h2 className="cc-section-title">Recent Issues</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/issues')}>
              View All
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <p>No issues filed yet.</p>
            </div>
          ) : (
            <div className="cc-recent-list">
              {recent.map((issue) => (
                <div key={issue.ticket_id} className="cc-recent-row" onClick={() => navigate('/issues')}>
                  <span className="cc-recent-id">#{issue.ticket_id}</span>
                  <span className="cc-recent-name">{issue.employee_name}</span>
                  <span className="cc-recent-cat">{issue.issue_category}</span>
                  <PriorityFlag priority={issue.priority} />
                  <StatusChip status={issue.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="card cc-breakdown">
          <div className="cc-section-header">
            <h2 className="cc-section-title">Category Breakdown</h2>
          </div>
          {catEntries.length === 0 ? (
            <div className="empty-state"><p>No data yet.</p></div>
          ) : (
            <div className="cc-cat-list">
              {catEntries.map(([cat, cnt]) => (
                <div key={cat} className="cc-cat-row">
                  <span className="cc-cat-icon">{CATEGORY_ICONS[cat] || '📋'}</span>
                  <span className="cc-cat-name">{cat}</span>
                  <div className="cc-cat-bar-wrap">
                    <div
                      className="cc-cat-bar"
                      style={{ width: `${Math.round((cnt / total) * 100)}%` }}
                    />
                  </div>
                  <span className="cc-cat-count">{cnt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
