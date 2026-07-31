'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/lib/toast-context'
import { SkeletonList } from '@/components/ui/Skeleton'

export default function ComunicazionePage() {
  const { show } = useToast()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  async function load() {
    const supabase = createClient()
    setLoading(true)
    const { data: commesse } = await supabase
      .from('commesse')
      .select('id, titolo, data_evento')
      .neq('stato', 'rifiutata')
      .order('data_evento', { ascending: true })
    const { data: comunicazioni } = await supabase
      .from('comunicazione')
      .select('id, commessa_id, stato, nota')

    const merged = (commesse ?? []).map((c) => {
      const com = (comunicazioni ?? []).find((k) => k.commessa_id === c.id)
      return { ...c, comunicazione: com ?? null }
    })
    setRows(merged)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleStato(commessaId: string, comId: string | null, nuovoStato: 'da_fare' | 'fatto') {
    setSaving(commessaId)
    const supabase = createClient()
    if (comId) {
      await supabase.from('comunicazione').update({ stato: nuovoStato }).eq('id', comId)
    } else {
      await supabase.from('comunicazione').insert({ commessa_id: commessaId, stato: nuovoStato })
    }
    setSaving(null)
    show(nuovoStato === 'fatto' ? 'Segnato come fatto' : 'Segnato come da fare')
    load()
  }

  async function aggiornaNota(comId: string | null, commessaId: string, nota: string) {
    const supabase = createClient()
    if (comId) {
      await supabase.from('comunicazione').update({ nota }).eq('id', comId)
      show('Nota aggiornata')
    } else if (nota.trim()) {
      await supabase.from('comunicazione').insert({ commessa_id: commessaId, nota, stato: 'da_fare' })
      show('Nota salvata')
      load()
    }
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-semibold">Comunicazione</h1>
        <p className="text-ink/60 mt-1">Stato comunicazione per ogni commessa/evento.</p>
      </div>

      {loading ? (
        <SkeletonList rows={4} />
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white/50 overflow-hidden">
          {rows.map((r, i) => {
            const stato = r.comunicazione?.stato ?? 'da_fare'
            const fatto = stato === 'fatto'
            return (
              <div
                key={r.id}
                className="animate-fade-in-up px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="sm:w-56 shrink-0">
                  <p className="font-medium">{r.titolo}</p>
                  <p className="text-xs text-ink/50">{r.data_evento ?? 'Nessuna data'}</p>
                </div>
                <input
                  placeholder="Nota (es. newsletter inviata, locandina pronta…)"
                  defaultValue={r.comunicazione?.nota ?? ''}
                  onBlur={(e) => aggiornaNota(r.comunicazione?.id ?? null, r.id, e.target.value)}
                  className="border border-line rounded-md px-2 py-1 bg-white text-sm flex-1 transition-shadow focus:outline-none focus:ring-2 focus:ring-ochre"
                />
                <button
                  onClick={() => toggleStato(r.id, r.comunicazione?.id ?? null, fatto ? 'da_fare' : 'fatto')}
                  disabled={saving === r.id}
                  className={`text-xs rounded px-3 py-1.5 font-medium transition-all shrink-0 active:scale-95 disabled:opacity-50 ${
                    fatto ? 'bg-teal text-white hover:opacity-90' : 'bg-ochre text-white hover:bg-ochre-dark'
                  }`}
                >
                  {fatto ? '✓ Fatto' : 'Da fare'}
                </button>
              </div>
            )
          })}
          {rows.length === 0 && (
            <p className="px-4 py-8 text-sm text-ink/50 text-center">Nessuna commessa da comunicare.</p>
          )}
        </div>
      )}
    </div>
  )
}
