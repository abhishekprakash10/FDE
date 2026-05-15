import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthStore'
import './Login.css'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState('employee')
  const [nameInput, setNameInput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmedName = nameInput.trim()
    if (!trimmedName) {
      setError('Please enter your display name.')
      return
    }

    signIn(selectedRole, trimmedName)
    navigate('/')
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </span>
          <h1 className="login-app-name">ServiceDesk Pro</h1>
          <p className="login-tagline">IT Help Desk Management System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Access Role</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-option ${selectedRole === 'employee' ? 'role-option--active' : ''}`}
                onClick={() => setSelectedRole('employee')}
              >
                <span className="role-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/>
                  </svg>
                </span>
                <span className="role-label">Employee</span>
                <span className="role-desc">Submit support requests</span>
              </button>

              <button
                type="button"
                className={`role-option ${selectedRole === 'it_admin' ? 'role-option--active' : ''}`}
                onClick={() => setSelectedRole('it_admin')}
              >
                <span className="role-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                </span>
                <span className="role-label">IT Admin</span>
                <span className="role-desc">Manage and resolve tickets</span>
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-submit">
            Sign In
          </button>
        </form>

        <p className="login-footer-note">
          No password required. Role determines access level.
        </p>
      </div>
    </div>
  )
}
