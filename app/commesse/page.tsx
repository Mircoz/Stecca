'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function CommessePage() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data } = await supabase
        .from('commesse')
        .select('id, titolo, stato, fase, data_evento, anagrafica(nome)')
        .order('created_at', { ascending: false })
      setItems(data ?? [])
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Commesse</h1>
          <p className="text-ink/60 mt-1">Centri di costo ed eventi.</p>
        </div>
        <Link
          href="/commesse/nuova"
          className="bg-ochre hover:bg-ochre-dark text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          + Nuova commessa
        </Link>
      </div>

      <div className="border border-line rounded-lg divide-y divide-line bg-white/50">
        {items.map((c) => (
          <Link
            key={c.id}
            href={`/commesse/${c.id}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-bg transition-colors"
          >
            <div>
              <p className="font-medium">{c.titolo}</p>
              <p className="text-xs text-ink/50">{c.anagrafica?.nome ?? 'Nessun cliente collegato'}</p>
            </div>
            <span className="text-xs uppercase tracking-wide text-ink/50">
              {c.stato} · {c.fase}
            </span>
          </Link>
        ))}
        {items.length === 0 && <p className="px-4 py-6 text-sm text-ink/50">Nessuna commessa ancora.</p>}
      </div>
    </div>
  )
}
