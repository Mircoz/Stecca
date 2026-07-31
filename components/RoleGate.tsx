'use client'
import { useAuth } from '@/lib/auth-context'

export default function RoleGate({
  allow,
  children,
  fallback = null,
}: {
  allow: Array<'direttivo' | 'operativo'>
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (!profile || !allow.includes(profile.ruolo)) return <>{fallback}</>
  return <>{children}</>
}
