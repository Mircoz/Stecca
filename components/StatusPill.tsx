const COLORS: Record<string, string> = {
  bozza: 'bg-ink/10 text-ink/60',
  preventivo_inviato: 'bg-ochre/15 text-ochre-dark',
  approvata: 'bg-teal/15 text-teal',
  rifiutata: 'bg-danger/10 text-danger',
  fase_1: 'bg-ochre/15 text-ochre-dark',
  fase_2: 'bg-teal/15 text-teal',
  chiusa: 'bg-ink/10 text-ink/50',
  da_fare: 'bg-ochre/15 text-ochre-dark',
  fatto: 'bg-teal/15 text-teal',
  operativo: 'bg-ink/10 text-ink/60',
  direttivo: 'bg-teal/15 text-teal',
}

const LABELS: Record<string, string> = {
  bozza: 'Bozza',
  preventivo_inviato: 'Preventivo inviato',
  approvata: 'Approvata',
  rifiutata: 'Rifiutata',
  fase_1: 'Fase 1',
  fase_2: 'Fase 2',
  chiusa: 'Chiusa',
  da_fare: 'Da fare',
  fatto: 'Fatto',
  operativo: 'Operativo',
  direttivo: 'Direttivo',
}

export default function StatusPill({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
        COLORS[value] ?? 'bg-ink/10 text-ink/60'
      }`}
    >
      {LABELS[value] ?? value}
    </span>
  )
}
