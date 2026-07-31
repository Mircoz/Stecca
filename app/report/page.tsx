'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'

export default function ReportPage() {
  const { profile, loading } = useAuth()
  const [commesseChiuse, setCommesseChiuse] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data } = await supabase
        .from('commesse')
        .select('id, titolo, importo_preventivo, importo_consuntivo, data_evento')
        .eq('fase', 'chiusa')
        .order('data_evento', { ascending: false })
      setCommesseChiuse(data ?? [])
    }
    load()
  }, [])

  if (loading) return null

  if (profile?.ruolo !== 'direttivo') {
    return <p className="text-ink/50">Questa sezione è visibile solo ai Direttivi.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Report</h1>
        <p className="text-ink/60 mt-1">Sintesi indicatori sulle commesse chiuse.</p>
      </div>

      <div className="border border-line rounded-lg divide-y divide-line bg-white/50">
        {commesseChiuse.map((c) => {
          const scostamento =
            c.importo_consuntivo != null && c.importo_preventivo != null
              ? Number(c.importo_consuntivo) - Number(c.importo_preventivo)
              : null
          return (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{c.titolo}</p>
                <p className="text-xs text-ink/50">{c.data_evento}</p>
              </div>
              <div className="text-right">
                <p>Preventivo € {c.importo_preventivo ?? '—'}</p>
                <p className="text-xs text-ink/50">
                  Consuntivo € {c.importo_consuntivo ?? '—'}
                  {scostamento !== null && (
                    <span className={scostamento > 0 ? ' text-danger' : ' text-teal'}>
                      {' '}
                      ({scostamento > 0 ? '+' : ''}
                      {scostamento.toFixed(2)})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )
        })}
        {commesseChiuse.length === 0 && (
          <p className="px-4 py-6 text-sm text-ink/50">Nessuna commessa chiusa ancora.</p>
        )}
      </div>
    </div>
  )
}
