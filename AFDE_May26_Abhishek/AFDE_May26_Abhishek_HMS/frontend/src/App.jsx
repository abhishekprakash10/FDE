import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthStore, useAuth } from './context/AuthStore'
import { ToastProvider } from './components/Toast'
import TopBar from './components/TopBar'
import Login from './pages/Login'
import CommandCenter from './pages/CommandCenter'
import IssueQueue from './pages/IssueQueue'
import RaiseRequest from './pages/RaiseRequest'
import FindIssues from './pages/FindIssues'

function ProtectedRoute({ children }) {
  const { role } = useAuth()
  if (!role) return <Navigate to="/login" replace />
  return children
}

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  )
}

function AppRoutes() {
  const { role } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={role ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CommandCenter />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/issues"
        element={
          <ProtectedRoute>
            <AppLayout>
              <IssueQueue />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/raise"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RaiseRequest />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/find"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FindIssues />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthStore>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthStore>
    </BrowserRouter>
  )
}
