'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import RoleGate from '@/components/RoleGate'

const STATI = ['bozza', 'preventivo_inviato', 'approvata', 'rifiutata']

export default function CommessaDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { profile } = useAuth()
  const [commessa, setCommessa] = useState<any>(null)
  const [movimenti, setMovimenti] = useState<any[]>([])
  const [nuovoMovimento, setNuovoMovimento] = useState({ tipo: 'out', importo: '', descrizione: '' })
  const [msg, setMsg] = useState<string | null>(null)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('commesse').select('*, anagrafica(nome)').eq('id', id).single()
    setCommessa(data)
    const { data: pn } = await supabase
      .from('prima_nota')
      .select('*')
      .eq('commessa_id', id)
      .order('data_movimento', { ascending: false })
    setMovimenti(pn ?? [])
  }

  useEffect(() => {
    if (id) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function updateStato(stato: string) {
    const supabase = createClient()
    await supabase.from('commesse').update({ stato }).eq('id', id)
    load()
  }

  async function updateFase(fase: string) {
    const supabase = createClient()
    const { error } = await supabase.from('commesse').update({ fase }).eq('id', id)
    if (error) setMsg(error.message)
    load()
  }

  async function addMovimento(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    await supabase.from('prima_nota').insert({
      commessa_id: id,
      tipo: nuovoMovimento.tipo,
      importo: Number(nuovoMovimento.importo),
      descrizione: nuovoMovimento.descrizione,
    })
    setNuovoMovimento({ tipo: 'out', importo: '', descrizione: '' })
    load()
  }

  if (!commessa) return <p className="text-ink/50">Caricamento…</p>

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-semibold">{commessa.titolo}</h1>
        <p className="text-ink/60 mt-1">{commessa.anagrafica?.nome ?? 'Nessun cliente collegato'}</p>
      </div>

      <div className="border border-line rounded-lg p-5 bg-white/50 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs uppercase tracking-wide text-ink/50">Stato</span>
          <select
            value={commessa.stato}
            onChange={(e) => updateStato(e.target.value)}
            className="border border-line rounded-md px-2 py-1 bg-white text-sm"
          >
            {STATI.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs uppercase tracking-wide text-ink/50">Fase</span>
          <span className="text-sm">{commessa.fase}</span>
          <RoleGate allow={['direttivo']}>
            {commessa.fase === 'fase_1' && (
              <button
                onClick={() => updateFase('fase_2')}
                className="text-xs bg-teal text-white rounded px-2 py-1 hover:opacity-90"
              >
                Chiudi fase 1 → fase 2
              </button>
            )}
            {commessa.fase === 'fase_2' && (
              <button
                onClick={() => updateFase('chiusa')}
                className="text-xs bg-teal text-white rounded px-2 py-1 hover:opacity-90"
              >
                Chiudi commessa
              </button>
            )}
          </RoleGate>
          {profile?.ruolo === 'operativo' && commessa.fase !== 'fase_1' && (
            <span className="text-xs text-ink/40">Solo un direttivo può proseguire</span>
          )}
        </div>
        {msg && <p className="text-danger text-sm">{msg}</p>}
        <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-line">
          <div>
            <p className="text-ink/50 text-xs uppercase">Preventivo</p>
            <p>{commessa.importo_preventivo ? `€ ${commessa.importo_preventivo}` : '—'}</p>
          </div>
          <div>
            <p className="text-ink/50 text-xs uppercase">Consuntivo</p>
            <p>{commessa.importo_consuntivo ? `€ ${commessa.importo_consuntivo}` : '—'}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-3">Prima nota collegata</h2>
        <form onSubmit={addMovimento} className="flex flex-wrap gap-2 mb-4">
          <select
            value={nuovoMovimento.tipo}
            onChange={(e) => setNuovoMovimento({ ...nuovoMovimento, tipo: e.target.value })}
            className="border border-line rounded-md px-2 py-1 bg-white text-sm"
          >
            <option value="in">Entrata</option>
            <option value="out">Uscita</option>
          </select>
          <input
            required
            type="number"
            step="0.01"
            placeholder="Importo"
            value={nuovoMovimento.importo}
            onChange={(e) => setNuovoMovimento({ ...nuovoMovimento, importo: e.target.value })}
            className="border border-line rounded-md px-2 py-1 bg-white text-sm w-32"
          />
          <input
            placeholder="Descrizione"
            value={nuovoMovimento.descrizione}
            onChange={(e) => setNuovoMovimento({ ...nuovoMovimento, descrizione: e.target.value })}
            className="border border-line rounded-md px-2 py-1 bg-white text-sm flex-1 min-w-[10rem]"
          />
          <button type="submit" className="bg-ochre hover:bg-ochre-dark text-white rounded-md px-3 py-1 text-sm">
            Aggiungi
          </button>
        </form>
        <div className="border border-line rounded-lg divide-y divide-line bg-white/50">
          {movimenti.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-2 text-sm">
              <span>{m.descrizione || '—'}</span>
              <span className={m.tipo === 'in' ? 'text-teal' : 'text-danger'}>
                {m.tipo === 'in' ? '+' : '-'}€ {Number(m.importo).toFixed(2)}
              </span>
            </div>
          ))}
          {movimenti.length === 0 && <p className="px-4 py-4 text-sm text-ink/50">Nessun movimento ancora.</p>}
        </div>
      </div>
    </div>
  )
}
