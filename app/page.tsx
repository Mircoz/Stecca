'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const { profile } = useAuth()
  const [commesseAperte, setCommesseAperte] = useState<any[]>([])
  const [saldo, setSaldo] = useState<number | null>(null)
  const [prossimiEventi, setProssimiEventi] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: commesse } = await supabase
        .from('commesse')
        .select('id, titolo, stato, fase, data_evento')
        .neq('stato', 'rifiutata')
        .neq('fase', 'chiusa')
        .order('data_evento', { ascending: true })
        .limit(6)
      setCommesseAperte(commesse ?? [])

      const { data: movimenti } = await supabase.from('prima_nota').select('tipo, importo')
      if (movimenti) {
        const totale = movimenti.reduce(
          (acc, m) => acc + (m.tipo === 'in' ? Number(m.importo) : -Number(m.importo)),
          0
        )
        setSaldo(totale)
      }

      const { data: eventi } = await supabase
        .from('planning')
        .select('id, data_pianificata, note, commesse(titolo)')
        .gte('data_pianificata', new Date().toISOString().slice(0, 10))
        .order('data_pianificata', { ascending: true })
        .limit(5)
      setProssimiEventi(eventi ?? [])
    }
    load()
  }, [])

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold">
          Ciao{profile ? `, ${profile.nome.split(' ')[0]}` : ''}
        </h1>
        <p className="text-ink/60 mt-1">Panoramica delle attività della Stecca.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="border border-line rounded-lg p-5 bg-white/50">
          <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Saldo prima nota</p>
          <p className="font-display text-2xl">{saldo === null ? '—' : `€ ${saldo.toFixed(2)}`}</p>
        </div>
        <div className="border border-line rounded-lg p-5 bg-white/50">
          <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Commesse aperte</p>
          <p className="font-display text-2xl">{commesseAperte.length}</p>
        </div>
        <div className="border border-line rounded-lg p-5 bg-white/50">
          <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Prossimi eventi</p>
          <p className="font-display text-2xl">{prossimiEventi.length}</p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-3">Commesse aperte</h2>
        {commesseAperte.length === 0 ? (
          <p className="text-ink/50 text-sm">Nessuna commessa aperta al momento.</p>
        ) : (
          <div className="border border-line rounded-lg divide-y divide-line bg-white/50">
            {commesseAperte.map((c) => (
              <Link
                key={c.id}
                href={`/commesse/${c.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-bg transition-colors"
              >
                <span>{c.titolo}</span>
                <span className="text-xs uppercase tracking-wide text-ink/50">
                  {c.stato} · {c.fase}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
