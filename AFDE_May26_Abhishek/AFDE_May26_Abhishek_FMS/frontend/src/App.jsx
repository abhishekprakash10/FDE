/**
 * App.jsx — Root component with routing, session provider, and sidebar layout
 *
 * Layout: Fixed 220px sidebar on the left, scrollable main content on the right.
 * Protected routes redirect to /signin if no session is active.
 */

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { SessionProvider, useSession } from './context/SessionContext'
import { NotificationProvider } from './widgets/Notification'
import Sidebar from './widgets/Sidebar'
import SignIn from './views/SignIn'
import Overview from './views/Overview'
import Entries from './views/Entries'
import NewEntry from './views/NewEntry'
import Explore from './views/Explore'

/* ---- Layout wrapper for authenticated pages ---- */
function AppShell() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, background: 'var(--bg)', overflowY: 'auto', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}

/* ---- Guard: redirect to /signin if not authenticated ---- */
function RequireAuth() {
  const { role } = useSession()
  if (!role) return <Navigate to="/signin" replace />
  return <Outlet />
}

/* ---- Guard: redirect to / if already signed in ---- */
function PublicOnly() {
  const { role } = useSession()
  if (role) return <Navigate to="/" replace />
  return <Outlet />
}

export default function App() {
  return (
    <SessionProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route element={<PublicOnly />}>
              <Route path="/signin" element={<SignIn />} />
            </Route>

            {/* Protected routes with sidebar shell */}
            <Route element={<RequireAuth />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<Overview />} />
                <Route path="/entries" element={<Entries />} />
                <Route path="/new" element={<NewEntry />} />
                <Route path="/explore" element={<Explore />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </SessionProvider>
  )
}
