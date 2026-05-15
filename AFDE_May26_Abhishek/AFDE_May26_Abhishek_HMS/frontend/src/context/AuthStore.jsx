import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthStore({ children }) {
  const [role, setRole] = useState(() => sessionStorage.getItem('sd_role') || null)
  const [username, setUsername] = useState(() => sessionStorage.getItem('sd_username') || null)

  const isAdmin = role === 'it_admin'

  const signIn = (selectedRole, selectedUsername) => {
    sessionStorage.setItem('sd_role', selectedRole)
    sessionStorage.setItem('sd_username', selectedUsername)
    setRole(selectedRole)
    setUsername(selectedUsername)
  }

  const signOut = () => {
    sessionStorage.removeItem('sd_role')
    sessionStorage.removeItem('sd_username')
    setRole(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ role, username, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthStore')
  return ctx
}
