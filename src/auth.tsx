// ---------- src/auth.tsx ----------
import React, { createContext, useContext, useEffect, useState } from 'react'
import { mockApi } from './api/mock'
import type { JWT } from './types'

interface AuthContextType {
  user: JWT | null
  login: (u: string, p: string) => Promise<void>
  register: (u: string, p: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<JWT | null>(null)

  useEffect(() => { setUser(mockApi.currentUser()) }, [])

  async function login(username: string, password: string) {
    const jwt = await mockApi.login(username, password)
    setUser(jwt)
  }
  async function register(username: string, password: string) {
    const jwt = await mockApi.register(username, password)
    setUser(jwt)
  }
  async function logout() { await mockApi.logout(); setUser(null) }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}
