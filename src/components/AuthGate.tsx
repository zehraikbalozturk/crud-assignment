// ---------- src/components/AuthGate.tsx ----------
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth'

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  return <>{children}</>
}
