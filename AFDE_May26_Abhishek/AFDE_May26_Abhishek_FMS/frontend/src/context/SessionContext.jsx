/**
 * SessionContext.jsx — Authentication state provider for PulseCheck
 *
 * Provides: role, username, label, isAdmin, signIn(), signOut()
 * Persists session to sessionStorage under keys: pc_role, pc_user, pc_label
 */

import React, { createContext, useContext, useState } from 'react'

const SessionContext = createContext(null)

const STORAGE_KEYS = {
  role: 'pc_role',
  user: 'pc_user',
  label: 'pc_label',
}

export function SessionProvider({ children }) {
  const [role, setRole] = useState(() => sessionStorage.getItem(STORAGE_KEYS.role) || null)
  const [username, setUsername] = useState(() => sessionStorage.getItem(STORAGE_KEYS.user) || null)
  const [label, setLabel] = useState(() => sessionStorage.getItem(STORAGE_KEYS.label) || null)

  function signIn(newRole, newUsername, newLabel) {
    sessionStorage.setItem(STORAGE_KEYS.role, newRole)
    sessionStorage.setItem(STORAGE_KEYS.user, newUsername)
    sessionStorage.setItem(STORAGE_KEYS.label, newLabel)
    setRole(newRole)
    setUsername(newUsername)
    setLabel(newLabel)
  }

  function signOut() {
    Object.values(STORAGE_KEYS).forEach((k) => sessionStorage.removeItem(k))
    setRole(null)
    setUsername(null)
    setLabel(null)
  }

  const isAdmin = role === 'admin'

  return (
    <SessionContext.Provider value={{ role, username, label, isAdmin, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}
