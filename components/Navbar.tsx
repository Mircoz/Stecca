'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/commesse', label: 'Commesse' },
  { href: '/prima-nota', label: 'Prima nota' },
  { href: '/planning', label: 'Planning' },
  { href: '/comunicazione', label: 'Comunicazione' },
  { href: '/anagrafica', label: 'Anagrafica' },
  { href: '/report', label: 'Report' },
]

export default function Navbar() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  if (!user || pathname === '/login') return null

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-line bg-bg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-8 flex-wrap">
          <span className="font-display text-lg font-semibold tracking-tight">Stecca</span>
          <nav className="flex gap-5 text-sm flex-wrap">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`hover:text-ochre-dark transition-colors ${
                  pathname === l.href ? 'text-ochre-dark font-medium' : 'text-ink/70'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-ink/60">
            {profile?.nome} · <span className="uppercase text-xs tracking-wide">{profile?.ruolo}</span>
          </span>
          <button onClick={handleLogout} className="text-ink/60 hover:text-danger transition-colors">
            Esci
          </button>
        </div>
      </div>
    </header>
  )
}
