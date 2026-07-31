'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/lib/toast-context'
import { SkeletonList } from '@/components/ui/Skeleton'
import StatusPill from '@/components/StatusPill'

export default function UtentiPage() {
  const { profile, loading: authLoading } = useAuth()
  const { show } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nome: '', email: '', password: '', ruolo: 'operativo' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.functions.invoke('admin-users', { method: 'GET' })
      if (error || data?.error) {
        show(data?.error ?? error?.message ?? 'Errore nel caricamento utenti', 'error')
        return
      }
      setUsers(data?.users ?? [])
    } catch (e) {
      show(e instanceof Error ? e.message : 'Errore di rete nel caricamento', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile?.ruolo === 'direttivo') load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.functions.invoke('admin-users', {
        method: 'POST',
        body: form,
      })
      if (error || data?.error) {
        show(data?.error ?? error?.message ?? 'Errore nella creazione', 'error')
        return
      }
      show('Utente creato')
      setForm({ nome: '', email: '', password: '', ruolo: 'operativo' })
      load()
    } catch (e) {
      show(e instanceof Error ? e.message : 'Errore di rete nella creazione', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function changeRuolo(id: string, ruolo: string) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.functions.invoke('admin-users', {
        method: 'PATCH',
        body: { id, ruolo },
      })
      if (error || data?.error) {
        show(data?.error ?? error?.message ?? 'Errore', 'error')
        return
      }
      show('Ruolo aggiornato')
      load()
    } catch (e) {
      show(e instanceof Error ? e.message : 'Errore di rete', 'error')
    }
  }

  if (authLoading) return null

  if (profile?.ruolo !== 'direttivo') {
    return <p className="text-ink/50 animate-fade-in-up">Questa sezione è visibile solo ai Direttivi.</p>
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-semibold">Utenti</h1>
        <p className="text-ink/60 mt-1">Crea nuovi accessi e gestisci i ruoli.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-in-up border border-line rounded-lg p-5 bg-white/50 grid sm:grid-cols-2 gap-4"
      >
        <input
          required
          placeholder="Nome e cognome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-ochre"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white"
        />
        <input
          required
          type="password"
          minLength={8}
          placeholder="Password provvisoria (min 8 caratteri)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white"
        />
        <select
          value={form.ruolo}
          onChange={(e) => setForm({ ...form, ruolo: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white"
        >
          <option value="operativo">Operativo</option>
          <option value="direttivo">Direttivo</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 bg-ochre hover:bg-ochre-dark active:scale-95 text-white rounded-md py-2 font-medium transition-all disabled:opacity-50"
        >
          {saving ? 'Creazione…' : 'Crea utente'}
        </button>
      </form>
      <p className="text-xs text-ink/40 -mt-4">
        Comunica tu stesso la password provvisoria alla persona: non viene inviata alcuna email automatica.
      </p>

      {loading ? (
        <SkeletonList rows={3} />
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white/50 overflow-hidden">
          {users.map((u, i) => (
            <div
              key={u.id}
              className="animate-fade-in-up flex items-center justify-between px-4 py-3 text-sm"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div>
                <p className="font-medium">{u.nome}</p>
                <p className="text-xs text-ink/50">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill value={u.ruolo} />
                <select
                  value={u.ruolo}
                  onChange={(e) => changeRuolo(u.id, e.target.value)}
                  className="border border-line rounded-md px-2 py-1 bg-white text-xs"
                >
                  <option value="operativo">Operativo</option>
                  <option value="direttivo">Direttivo</option>
                </select>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="px-4 py-8 text-sm text-ink/50 text-center">Nessun utente.</p>
          )}
        </div>
      )}
    </div>
  )
}
