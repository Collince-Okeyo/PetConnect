import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { setAuthToken } from '../lib/api'
import * as auth from '../lib/authClient'
import type { AuthTokens, UserProfile } from '../types/auth'
import heartbeatService from '../lib/heartbeatService'

type AuthState = {
  user: UserProfile | null
  tokens: AuthTokens | null
  isLoading: boolean
}

type AuthContextValue = AuthState & {
  login: (params: { email?: string; phone?: string; password: string }) => Promise<void>
  register: (params: Record<string, unknown>) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  setAuth: (user: UserProfile | null, tokens: AuthTokens | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'pc_auth'

function readStoredAuth(): { user: UserProfile | null; tokens: AuthTokens | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, tokens: null }
    return JSON.parse(raw)
  } catch {
    return { user: null, tokens: null }
  }
}

function writeStoredAuth(user: UserProfile | null, tokens: AuthTokens | null) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, tokens }))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setAuth = useCallback((nextUser: UserProfile | null, nextTokens: AuthTokens | null) => {
    setUser(nextUser)
    setTokens(nextTokens)
    setAuthToken(nextTokens?.accessToken)
    writeStoredAuth(nextUser, nextTokens)
  }, [])

  useEffect(() => {
    const stored = readStoredAuth()
    if (stored.tokens?.accessToken) {
      setAuthToken(stored.tokens.accessToken)
    }
    setUser(stored.user)
    setTokens(stored.tokens)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (params: { email?: string; phone?: string; password: string }) => {
    const res = await auth.login(params)
    const nextUser = res.data?.user ?? null
    const nextTokens = res.data?.tokens ?? null
    setAuth(nextUser, nextTokens)
    
    // Start heartbeat service for all user roles
    heartbeatService.start()
  }, [setAuth])

  const register = useCallback(async (params: Record<string, unknown>) => {
    const res = await auth.register(params)
    const nextUser = res.data?.user ?? null
    const nextTokens = res.data?.tokens ?? null
    setAuth(nextUser, nextTokens)
  }, [setAuth])

  const refresh = useCallback(async () => {
    if (!tokens?.refreshToken) return
    const res = await auth.refreshToken({ refreshToken: tokens.refreshToken })
    const nextTokens = res.data?.tokens ?? null
    if (nextTokens) setAuth(user, nextTokens)
  }, [tokens, user, setAuth])

  const logout = useCallback(async () => {
    try {
      // Stop heartbeat service
      heartbeatService.stop()
      
      // Call logout with refreshToken if available
      if (tokens?.refreshToken) {
        await auth.logout({ refreshToken: tokens.refreshToken })
      }
    } finally {
      setAuth(null, null)
    }
  }, [tokens, setAuth])

  const value = useMemo<AuthContextValue>(() => ({ user, tokens, isLoading, login, register, logout, refresh, setAuth }), [user, tokens, isLoading, login, register, logout, refresh, setAuth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


