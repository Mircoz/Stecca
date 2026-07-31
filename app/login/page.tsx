'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email o password non corrette.')
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <h1 className="font-display text-3xl font-semibold mb-1">Stecca</h1>
        <p className="text-ink/60 mb-8 text-sm">Gestionale operativo — accedi</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-ink/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ochre transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-ink/70">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ochre transition-shadow"
            />
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ochre hover:bg-ochre-dark active:scale-95 text-white rounded-md py-2 font-medium transition-all disabled:opacity-50"
          >
            {loading ? 'Accesso in corso…' : 'Accedi'}
          </button>
        </form>
        <p className="text-xs text-ink/40 mt-6">
          Gli account vengono creati dai Direttivi tramite Supabase. Nessuna registrazione pubblica.
        </p>
      </div>
    </div>
  )
}
