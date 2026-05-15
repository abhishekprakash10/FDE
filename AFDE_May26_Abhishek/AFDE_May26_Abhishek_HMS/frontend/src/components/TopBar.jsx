import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthStore'
import './TopBar.css'

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', exact: true },
  { path: '/issues', label: 'Issue Queue' },
  { path: '/raise', label: 'Raise Request' },
  { path: '/find', label: 'Find Issues' },
]

export default function TopBar() {
  const { username, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </span>
        <span className="topbar-title">ServiceDesk Pro</span>
      </div>

      <nav className="topbar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `topbar-link ${isActive ? 'topbar-link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="topbar-right">
        <span className="topbar-user-badge">
          <span className="topbar-user-avatar">
            {(username || 'U').charAt(0).toUpperCase()}
          </span>
          <span className="topbar-user-info">
            <span className="topbar-user-name">{username}</span>
            <span className="topbar-user-role">{isAdmin ? 'IT Admin' : 'Employee'}</span>
          </span>
        </span>
        <button className="topbar-signout" onClick={handleSignOut} title="Sign out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
