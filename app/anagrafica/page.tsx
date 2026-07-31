'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import RoleGate from '@/components/RoleGate'

const TIPI = ['socio', 'cliente', 'fornitore', 'consulente', 'artigiano'] as const

export default function AnagraficaPage() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ tipo: 'cliente', nome: '', email: '', telefono: '', note: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('anagrafica').select('*').order('nome')
    setItems(data ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    await supabase.from('anagrafica').insert(form)
    setForm({ tipo: 'cliente', nome: '', email: '', telefono: '', note: '' })
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo contatto?')) return
    const supabase = createClient()
    await supabase.from('anagrafica').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Anagrafica</h1>
        <p className="text-ink/60 mt-1">Soci, clienti, fornitori, consulenti, artigiani.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-line rounded-lg p-5 bg-white/50 grid sm:grid-cols-2 gap-4"
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
          className="border border-line rounded-md px-3 py-2 bg-white"
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
          className="bg-ochre hover:bg-ochre-dark text-white rounded-md py-2 font-medium transition-colors sm:col-span-2 disabled:opacity-50"
        >
          {saving ? 'Salvataggio…' : 'Aggiungi contatto'}
        </button>
      </form>

      <div className="border border-line rounded-lg divide-y divide-line bg-white/50">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{item.nome}</p>
              <p className="text-xs text-ink/50">
                {item.tipo} {item.email ? `· ${item.email}` : ''} {item.telefono ? `· ${item.telefono}` : ''}
              </p>
            </div>
            <RoleGate allow={['direttivo']}>
              <button onClick={() => handleDelete(item.id)} className="text-xs text-danger hover:underline">
                Elimina
              </button>
            </RoleGate>
          </div>
        ))}
        {items.length === 0 && <p className="px-4 py-6 text-sm text-ink/50">Nessun contatto ancora.</p>}
      </div>
    </div>
  )
}
