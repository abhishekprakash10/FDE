/**
 * Sidebar.jsx — Fixed left navigation sidebar for PulseCheck
 */

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/', icon: '📊', label: 'Overview', exact: true },
  { to: '/entries', icon: '📝', label: 'Entries' },
  { to: '/new', icon: '✍', label: 'New Entry' },
  { to: '/explore', icon: '🔍', label: 'Explore' },
]

export default function Sidebar() {
  const { username, label, role, signOut } = useSession()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/signin')
  }

  const avatarLetter = (label || username || 'U').charAt(0).toUpperCase()

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-name">PulseCheck</div>
        <div className="sidebar-brand-tagline">Feedback Portal</div>
      </div>

      {/* Navigation links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon, label: navLabel, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-icon">{icon}</span>
            {navLabel}
          </NavLink>
        ))}
      </nav>

      {/* User info + sign out */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{avatarLetter}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-username">{label || username}</div>
            <div className="sidebar-role">{role}</div>
          </div>
          <button
            className="sidebar-signout"
            onClick={handleSignOut}
            title="Sign out"
            aria-label="Sign out"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  )
}
