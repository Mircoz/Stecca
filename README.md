# Gestionale Stecca degli Artigiani

App interna per la gestione di commesse/eventi, anagrafica, prima nota e planning.

Stack: Next.js (App Router) + Supabase (Postgres, Auth, RLS) + Vercel.

## Sviluppo locale

```bash
npm install
npm run dev
```

Le variabili d'ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) sono già in `.env.production`
per il deploy; per lo sviluppo locale copiale in un file `.env.local`.

## Struttura

- `app/` — pagine (dashboard, login, anagrafica, commesse, prima nota, planning, report)
- `components/` — Navbar, RoleGate (visibilità in base al ruolo)
- `lib/supabase/` — client Supabase (browser)
- `lib/auth-context.tsx` — contesto React con utente e ruolo correnti
- `middleware.ts` — protezione delle rotte, redirect a `/login`

## Ruoli

Due ruoli applicativi (tabella `profiles`, colonna `ruolo`): `direttivo` e `operativo`.
I permessi sono applicati sia in UI (RoleGate) sia — soprattutto — a livello di database
tramite Row Level Security su Supabase. Vedi `Architettura_Tecnologica_HLD_LLD_Gestionale.md`
nel documento di progetto per i dettagli.

## Creare un nuovo utente

Dal pannello Supabase (Authentication → Users) crea l'utente con email/password.
Il trigger `on_auth_user_created` crea automaticamente il profilo con ruolo `operativo`.
Per promuoverlo a `direttivo`, aggiorna manualmente la riga in `profiles` da Supabase Studio.
