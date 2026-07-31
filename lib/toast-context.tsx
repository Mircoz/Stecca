'use client'
import { createContext, useCallback, useContext, useState } from 'react'

type ToastItem = { id: number; message: string; type: 'success' | 'error' }
type ToastContextType = { show: (message: string, type?: 'success' | 'error') => void }

const ToastContext = createContext<ToastContextType>({ show: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-toast-in pointer-events-auto rounded-lg px-4 py-2.5 text-sm text-white shadow-lg ${
              t.type === 'success' ? 'bg-teal' : 'bg-danger'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
