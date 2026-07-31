'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PlanningPage() {
  const [items, setItems] = useState<any[]>([])
  const [commesse, setCommesse] = useState<any[]>([])
  const [form, setForm] = useState({ commessa_id: '', data_pianificata: '', note: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('planning').select('*, commesse(titolo)').order('data_pianificata')
    setItems(data ?? [])
    const { data: c } = await supabase.from('commesse').select('id, titolo').neq('stato', 'rifiutata')
    setCommesse(c ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.commessa_id) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('planning').insert(form)
    setForm({ commessa_id: '', data_pianificata: '', note: '' })
    setSaving(false)
    load()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Planning</h1>
        <p className="text-ink/60 mt-1">Calendario eventi pianificati.</p>
      </div>

      <form onSubmit={handleSubmit} className="border border-line rounded-lg p-5 bg-white/50 grid sm:grid-cols-4 gap-3">
        <select
          value={form.commessa_id}
          onChange={(e) => setForm({ ...form, commessa_id: e.target.value })}
          className="border border-line rounded-md px-2 py-2 bg-white text-sm sm:col-span-2"
        >
          <option value="">Seleziona commessa…</option>
          {commesse.map((c) => (
            <option key={c.id} value={c.id}>
              {c.titolo}
            </option>
          ))}
        </select>
        <input
          type="date"
          required
          value={form.data_pianificata}
          onChange={(e) => setForm({ ...form, data_pianificata: e.target.value })}
          className="border border-line rounded-md px-2 py-2 bg-white text-sm"
        />
        <input
          placeholder="Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="border border-line rounded-md px-2 py-2 bg-white text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-4 bg-ochre hover:bg-ochre-dark text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
        >
          {saving ? 'Salvataggio…' : 'Aggiungi al planning'}
        </button>
      </form>

      <div className="border border-line rounded-lg divide-y divide-line bg-white/50">
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{p.commesse?.titolo}</p>
              <p className="text-xs text-ink/50">{p.note}</p>
            </div>
            <span className="text-xs text-ink/50">{p.data_pianificata}</span>
          </div>
        ))}
        {items.length === 0 && <p className="px-4 py-6 text-sm text-ink/50">Nessun evento pianificato.</p>}
      </div>
    </div>
  )
}
