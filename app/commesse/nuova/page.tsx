'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NuovaCommessaPage() {
  const router = useRouter()
  const [clienti, setClienti] = useState<any[]>([])
  const [form, setForm] = useState({
    titolo: '',
    cliente_id: '',
    data_evento: '',
    importo_preventivo: '',
    note: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data } = await supabase.from('anagrafica').select('id, nome').order('nome')
      setClienti(data ?? [])
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('commesse')
      .insert({
        titolo: form.titolo,
        cliente_id: form.cliente_id || null,
        data_evento: form.data_evento || null,
        importo_preventivo: form.importo_preventivo ? Number(form.importo_preventivo) : null,
        note: form.note,
        stato: 'bozza',
        fase: 'fase_1',
      })
      .select()
      .single()
    setSaving(false)
    if (!error && data) router.push(`/commesse/${data.id}`)
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-display text-3xl font-semibold">Nuova commessa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Titolo commessa"
          value={form.titolo}
          onChange={(e) => setForm({ ...form, titolo: e.target.value })}
          className="w-full border border-line rounded-md px-3 py-2 bg-white"
        />
        <select
          value={form.cliente_id}
          onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
          className="w-full border border-line rounded-md px-3 py-2 bg-white"
        >
          <option value="">Nessun cliente collegato</option>
          {clienti.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.data_evento}
          onChange={(e) => setForm({ ...form, data_evento: e.target.value })}
          className="w-full border border-line rounded-md px-3 py-2 bg-white"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Importo preventivo (€)"
          value={form.importo_preventivo}
          onChange={(e) => setForm({ ...form, importo_preventivo: e.target.value })}
          className="w-full border border-line rounded-md px-3 py-2 bg-white"
        />
        <textarea
          placeholder="Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full border border-line rounded-md px-3 py-2 bg-white"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-ochre hover:bg-ochre-dark text-white rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Creazione…' : 'Crea commessa'}
        </button>
      </form>
    </div>
  )
}
