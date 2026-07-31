import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { ToastProvider } from '@/lib/toast-context'
import Navbar from '@/components/Navbar'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['500', '600'],
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Stecca — Gestionale',
  description: 'Gestionale operativo della Stecca degli Artigiani',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${fraunces.variable} ${inter.variable} font-sans`}>
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
