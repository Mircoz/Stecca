'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/lib/toast-context'
import { SkeletonList } from '@/components/ui/Skeleton'
import RoleGate from '@/components/RoleGate'

const TIPI = ['socio', 'cliente', 'fornitore', 'consulente', 'artigiano'] as const

export default function AnagraficaPage() {
  const { show } = useToast()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ tipo: 'cliente', nome: '', email: '', telefono: '', note: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    setLoading(true)
    const { data } = await supabase.from('anagrafica').select('*').order('nome')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('anagrafica').insert(form)
    setSaving(false)
    if (error) {
      show(error.message, 'error')
      return
    }
    show('Contatto aggiunto')
    setForm({ tipo: 'cliente', nome: '', email: '', telefono: '', note: '' })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo contatto?')) return
    const supabase = createClient()
    await supabase.from('anagrafica').delete().eq('id', id)
    show('Contatto eliminato')
    load()
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-semibold">Anagrafica</h1>
        <p className="text-ink/60 mt-1">Soci, clienti, fornitori, consulenti, artigiani.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-in-up border border-line rounded-lg p-5 bg-white/50 grid sm:grid-cols-2 gap-4"
      >
        <select
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white"
        >
          {TIPI.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          required
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-ochre"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white"
        />
        <input
          placeholder="Telefono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white"
        />
        <input
          placeholder="Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="border border-line rounded-md px-3 py-2 bg-white sm:col-span-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-ochre hover:bg-ochre-dark active:scale-95 text-white rounded-md py-2 font-medium transition-all sm:col-span-2 disabled:opacity-50"
        >
          {saving ? 'Salvataggio…' : 'Aggiungi contatto'}
        </button>
      </form>

      {loading ? (
        <SkeletonList rows={4} />
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white/50 overflow-hidden">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="animate-fade-in-up flex items-center justify-between px-4 py-3 hover:bg-bg/50 transition-colors"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div>
                <p className="font-medium">{item.nome}</p>
                <p className="text-xs text-ink/50">
                  {item.tipo} {item.email ? `· ${item.email}` : ''} {item.telefono ? `· ${item.telefono}` : ''}
                </p>
              </div>
              <RoleGate allow={['direttivo']}>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-danger hover:underline active:scale-95 transition-transform"
                >
                  Elimina
                </button>
              </RoleGate>
            </div>
          ))}
          {items.length === 0 && (
            <p className="px-4 py-8 text-sm text-ink/50 text-center">Nessun contatto ancora.</p>
          )}
        </div>
      )}
    </div>
  )
}
