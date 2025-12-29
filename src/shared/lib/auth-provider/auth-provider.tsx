'use client'

import { User } from '@/entities/user'
import { createContext, ReactNode, useContext, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMe } from '@/shared/api'

type AuthContext = {
  user: User | null
  isLoading: boolean
  isError: boolean
}

const Auth = createContext<AuthContext | null>(null)
export const AuthContext = Auth

export const useAuth = () => {
  const ctx = useContext(Auth)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get('accessToken')

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token)

      // Очищаем URL через router.replace
      router.replace(window.location.pathname)
    }
  }, [token, router])

  const { data: user, isLoading, isError } = useMe()

  return <Auth.Provider value={{ user: user || null, isLoading, isError }}>{children}</Auth.Provider>
}
