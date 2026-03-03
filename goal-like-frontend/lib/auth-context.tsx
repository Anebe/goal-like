"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { api } from "@/lib/api"
import type { ContentCreator, Contact } from "@/lib/api/types"

export interface AuthUser {
  creatorId: string
  fullName: string
  authId: string
  contacts: Contact[]
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signUp: (
    fullname: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const meRes = await api.getMe()
    if (!meRes.success) {
      setUser(null)
      return
    }
    const creatorId = meRes.data
    const creatorRes = await api.getCreator(creatorId)
    if (!creatorRes.success) {
      setUser(null)
      return
    }
    const contactsRes = await api.getCreatorContacts(creatorId)
    setUser({
      creatorId,
      fullName: creatorRes.data.fullName,
      authId: creatorRes.data.authId,
      contacts: contactsRes.success ? contactsRes.data : [],
    })
  }, [])

  useEffect(() => {
    loadUser().finally(() => setLoading(false))
  }, [loadUser])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login({ email, password })
      if (!res.success) return { success: false, message: res.message }
      await loadUser()
      return { success: true }
    },
    [loadUser]
  )

  const signUp = useCallback(
    async (fullname: string, email: string, password: string) => {
      const signUpRes = await api.signUp({ email, password, fullname })
      if (!signUpRes.success) return { success: false, message: signUpRes.message }

      // Auto-login after signup
      const loginRes = await api.login({ email, password })
      if (!loginRes.success) return { success: false, message: loginRes.message }

      await loadUser()
      return { success: true }
    },
    [loadUser]
  )

  const logout = useCallback(async () => {
    await api.logout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    await loadUser()
  }, [loadUser])

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
