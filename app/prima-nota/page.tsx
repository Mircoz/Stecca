'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const CATEGORIE = ['utenze', 'manutenzione', 'personale', 'consulenti', 'forniture', 'altro']

export default function PrimaNotaPage() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ tipo: 'out', importo: '', categoria: 'altro', descrizione: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('prima_nota')
      .select('*, commesse(titolo)')
      .order('data_movimento', { ascending: false })
    setItems(data ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    await supabase.from('prima_nota').insert({
      tipo: form.tipo,
      importo: Number(form.importo),
      categoria: form.categoria,
      descrizione: form.descrizione,
      commessa_id: null,
    })
    setForm({ tipo: 'out', importo: '', categoria: 'altro', descrizione: '' })
    setSaving(false)
    load()
  }

  const saldo = items.reduce((acc, m) => acc + (m.tipo === 'in' ? Number(m.importo) : -Number(m.importo)), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Prima nota</h1>
        <p className="text-ink/60 mt-1">
          Registro entrate/uscite — saldo attuale: <span className="font-medium text-ink">€ {saldo.toFixed(2)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-line rounded-lg p-5 bg-white/50 grid sm:grid-cols-4 gap-3">
        <select
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          className="border border-line rounded-md px-2 py-2 bg-white text-sm"
        >
          <option value="in">Entrata</option>
          <option value="out">Uscita</option>
        </select>
        <input
          required
          type="number"
          step="0.01"
          placeholder="Importo"
          value={form.importo}
          onChange={(e) => setForm({ ...form, importo: e.target.value })}
          className="border border-line rounded-md px-2 py-2 bg-white text-sm"
        />
        <select
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          className="border border-line rounded-md px-2 py-2 bg-white text-sm"
        >
          {CATEGORIE.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          placeholder="Descrizione"
          value={form.descrizione}
          onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
          className="border border-line rounded-md px-2 py-2 bg-white text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-4 bg-ochre hover:bg-ochre-dark text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
        >
          {saving ? 'Salvataggio…' : 'Registra movimento generale'}
        </button>
      </form>
      <p className="text-xs text-ink/40 -mt-4">
        Per movimenti legati a una commessa specifica, usa la scheda della commessa.
      </p>

      <div className="border border-line rounded-lg divide-y divide-line bg-white/50">
        {items.map((m) => (
          <div key={m.id} className="flex items-center justify-between px-4 py-2 text-sm">
            <div>
              <span>{m.descrizione || '—'}</span>
              <span className="text-ink/40 ml-2 text-xs">
                {m.commesse?.titolo ? `· ${m.commesse.titolo}` : m.categoria ? `· ${m.categoria}` : ''}
              </span>
            </div>
            <span className={m.tipo === 'in' ? 'text-teal' : 'text-danger'}>
              {m.tipo === 'in' ? '+' : '-'}€ {Number(m.importo).toFixed(2)}
            </span>
          </div>
        ))}
        {items.length === 0 && <p className="px-4 py-6 text-sm text-ink/50">Nessun movimento ancora.</p>}
      </div>
    </div>
  )
}
