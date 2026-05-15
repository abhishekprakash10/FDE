/**
 * SignIn.jsx — Login page with role selector (user / admin)
 * Admin requires username=admin, password=admin123
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import './SignIn.css'

export default function SignIn() {
  const { signIn } = useSession()
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState('user')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (selectedRole === 'admin') {
      if (username !== 'admin' || password !== 'admin123') {
        setError('Invalid admin credentials. Use admin / admin123.')
        return
      }
      signIn('admin', 'admin', 'Administrator')
    } else {
      // Regular user — any name works
      const displayName = username.trim() || 'Guest'
      signIn('user', displayName, displayName)
    }
    navigate('/')
  }

  return (
    <div className="signin-page">
      <div className="signin-card">
        {/* Header */}
        <div className="signin-header">
          <div className="signin-logo">📊</div>
          <h1 className="signin-title">PulseCheck</h1>
          <p className="signin-subtitle">Feedback Collection Portal</p>
        </div>

        {/* Form */}
        <div className="signin-body">
          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div className="signin-role-section">
              <span className="signin-role-label">Sign in as</span>
              <div className="signin-role-options">
                <button
                  type="button"
                  className={`signin-role-btn${selectedRole === 'user' ? ' active' : ''}`}
                  onClick={() => { setSelectedRole('user'); setError('') }}
                >
                  <span className="role-btn-icon">👤</span>
                  <span className="role-btn-name">User</span>
                  <span className="role-btn-hint">Submit feedback</span>
                </button>
                <button
                  type="button"
                  className={`signin-role-btn${selectedRole === 'admin' ? ' active' : ''}`}
                  onClick={() => { setSelectedRole('admin'); setError('') }}
                >
                  <span className="role-btn-icon">🛡</span>
                  <span className="role-btn-name">Admin</span>
                  <span className="role-btn-hint">Manage entries</span>
                </button>
              </div>
            </div>

            {/* Credentials */}
            <div className="signin-admin-fields">
              <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                <label className="form-label" htmlFor="si-username">
                  {selectedRole === 'admin' ? 'Username' : 'Your Name'}
                </label>
                <input
                  id="si-username"
                  type="text"
                  className="form-control"
                  placeholder={selectedRole === 'admin' ? 'admin' : 'Enter your name'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={selectedRole === 'admin'}
                />
              </div>

              {selectedRole === 'admin' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="si-password">Password</label>
                  <input
                    id="si-password"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {error && <div className="signin-error">{error}</div>}

            <button type="submit" className="signin-submit" style={{ marginTop: '1rem' }}>
              Continue →
            </button>
          </form>

          <p className="signin-footer-note">
            Admin credentials: admin / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
