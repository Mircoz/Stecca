'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = { id: string; nome: string; ruolo: 'direttivo' | 'operativo' }
type AuthState = { user: any; profile: Profile | null; loading: boolean }

const AuthContext = createContext<AuthState>({ user: null, profile: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, profile: null, loading: true })

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (mounted) setState({ user: null, profile: null, loading: false })
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, nome, ruolo')
        .eq('id', user.id)
        .single()
      if (mounted) setState({ user, profile: (profile as Profile) ?? null, loading: false })
    }

    load()

    const { data: listener } = supabase.auth.onAuthStateChange(() => load())
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
