'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/lib/toast-context'
import { SkeletonList } from '@/components/ui/Skeleton'

export default function PlanningPage() {
  const { show } = useToast()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [commesse, setCommesse] = useState<any[]>([])
  const [form, setForm] = useState({ commessa_id: '', data_pianificata: '', note: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    setLoading(true)
    const { data } = await supabase.from('planning').select('*, commesse(titolo)').order('data_pianificata')
    setItems(data ?? [])
    const { data: c } = await supabase.from('commesse').select('id, titolo').neq('stato', 'rifiutata')
    setCommesse(c ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.commessa_id) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('planning').insert(form)
    setSaving(false)
    if (error) {
      show(error.message, 'error')
      return
    }
    show('Evento aggiunto al planning')
    setForm({ commessa_id: '', data_pianificata: '', note: '' })
    load()
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-semibold">Planning</h1>
        <p className="text-ink/60 mt-1">Calendario eventi pianificati.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-in-up border border-line rounded-lg p-5 bg-white/50 grid sm:grid-cols-4 gap-3"
      >
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
          className="sm:col-span-4 bg-ochre hover:bg-ochre-dark active:scale-95 text-white rounded-md py-2 text-sm font-medium transition-all disabled:opacity-50"
        >
          {saving ? 'Salvataggio…' : 'Aggiungi al planning'}
        </button>
      </form>

      {loading ? (
        <SkeletonList rows={3} />
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white/50 overflow-hidden">
          {items.map((p, i) => (
            <div
              key={p.id}
              className="animate-fade-in-up flex items-center justify-between px-4 py-3 text-sm"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div>
                <p className="font-medium">{p.commesse?.titolo}</p>
                <p className="text-xs text-ink/50">{p.note}</p>
              </div>
              <span className="text-xs text-ink/50">{p.data_pianificata}</span>
            </div>
          ))}
          {items.length === 0 && (
            <p className="px-4 py-8 text-sm text-ink/50 text-center">Nessun evento pianificato.</p>
          )}
        </div>
      )}
    </div>
  )
}
