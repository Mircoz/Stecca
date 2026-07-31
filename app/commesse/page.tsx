'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SkeletonList } from '@/components/ui/Skeleton'
import StatusPill from '@/components/StatusPill'

export default function CommessePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('commesse')
        .select('id, titolo, stato, fase, data_evento, anagrafica(nome)')
        .order('created_at', { ascending: false })
      setItems(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-semibold">Commesse</h1>
          <p className="text-ink/60 mt-1">Centri di costo ed eventi.</p>
        </div>
        <Link
          href="/commesse/nuova"
          className="bg-ochre hover:bg-ochre-dark active:scale-95 text-white rounded-md px-4 py-2 text-sm font-medium transition-all"
        >
          + Nuova commessa
        </Link>
      </div>

      {loading ? (
        <SkeletonList rows={4} />
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white/50 overflow-hidden">
          {items.map((c, i) => (
            <Link
              key={c.id}
              href={`/commesse/${c.id}`}
              className="animate-fade-in-up flex items-center justify-between px-4 py-3 hover:bg-bg transition-colors"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <div>
                <p className="font-medium">{c.titolo}</p>
                <p className="text-xs text-ink/50">{c.anagrafica?.nome ?? 'Nessun cliente collegato'}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill value={c.stato} />
                <StatusPill value={c.fase} />
              </div>
            </Link>
          ))}
          {items.length === 0 && (
            <p className="px-4 py-8 text-sm text-ink/50 text-center">
              Nessuna commessa ancora — crea la prima con "+ Nuova commessa".
            </p>
          )}
        </div>
      )}
    </div>
  )
}
