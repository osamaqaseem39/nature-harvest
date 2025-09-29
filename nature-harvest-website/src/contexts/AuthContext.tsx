'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getToken, setToken, clearToken } from '@/lib/auth'
import { apiService, User } from '@/lib/api'

type LoginCredentials = { email: string; password: string }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (creds: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(getToken())
  const [loading, setLoading] = useState<boolean>(true)

  // Attempt to fetch profile if we already have a token
  useEffect(() => {
    const init = async () => {
      try {
        const existing = getToken()
        if (existing && existing.trim().length > 10) {
          // Minimal profile endpoint if available; otherwise skip
          // Server supports /api/auth/me per server codebase
          const me = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://nature-harvest-q2ra.vercel.app/api'}/auth/me`, {
            headers: { Authorization: `Bearer ${existing}` },
            cache: 'no-store',
          })
          if (me.ok) {
            const data = await me.json()
            setUser(data)
            setTokenState(existing)
          } else {
            clearToken()
            setUser(null)
            setTokenState(null)
          }
        } else {
          setUser(null)
          setTokenState(null)
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const login = useCallback(async (creds: LoginCredentials) => {
    try {
      // server: POST /api/auth/login returns { token, user }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://nature-harvest-q2ra.vercel.app/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      })
      if (!res.ok) {
        const msg = res.status === 400 ? 'Invalid credentials' : 'Login failed'
        return { success: false, error: msg }
      }
      const body: { token: string; user: User } = await res.json()
      setToken(body.token)
      setTokenState(body.token)
      setUser(body.user)
      return { success: true }
    } catch (e) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const logout = useCallback(async () => {
    clearToken()
    setTokenState(null)
    setUser(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    const tk = getToken()
    if (!tk) return
    const me = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://nature-harvest-q2ra.vercel.app/api'}/auth/me`, {
      headers: { Authorization: `Bearer ${tk}` },
      cache: 'no-store',
    })
    if (me.ok) {
      const data = await me.json()
      setUser(data)
    } else {
      clearToken()
      setTokenState(null)
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshProfile,
  }), [user, token, loading, login, logout, refreshProfile])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

