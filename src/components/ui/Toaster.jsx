import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import useStore from '@/store/useStore'

/**
 * Toaster — global notification stack.
 *
 * Reads the `toasts` array from the store and renders them in the bottom-
 * right corner of the viewport. Each toast self-dismisses after its
 * `duration` (ms) elapses; clicking the close button removes it early.
 *
 * Toast types:
 *   - 'success' → gold/green tint
 *   - 'error'   → maroon tint (used for rental validation failures)
 *   - 'info'    → ivory tint (default)
 */
export default function Toaster() {
  const toasts = useStore((s) => s.toasts)
  const removeToast = useStore((s) => s.removeToast)

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none"
      style={{ maxWidth: 'min(420px, calc(100vw - 3rem))' }}
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  // Auto-dismiss after the configured duration. Cleared if the toast is
  // removed externally (e.g. user closed it before the timer fired).
  useEffect(() => {
    if (!toast.duration) return undefined
    const t = setTimeout(onDismiss, toast.duration)
    return () => clearTimeout(t)
  }, [toast.duration, onDismiss])

  const palette = toastPalette(toast.type)
  const Icon = palette.icon

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, x: 32, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 32, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="pointer-events-auto flex items-start gap-3 rounded-xl pl-4 pr-3 pt-3 pb-3 shadow-2xl"
      style={{
        background: palette.background,
        border: `1px solid ${palette.border}`,
        backdropFilter: 'blur(12px)',
        color: palette.color,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Icon size={18} strokeWidth={1.75} style={{ color: palette.iconColor, marginTop: '2px' }} />
      <div className="flex-1 text-sm leading-relaxed">{toast.message}</div>
      <button
        type="button"
        onClick={onDismiss}
        className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 shrink-0"
        style={{ color: palette.color, opacity: 0.6 }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

function toastPalette(type) {
  switch (type) {
    case 'success':
      return {
        icon: CheckCircle2,
        iconColor: 'var(--color-gold)',
        background: 'rgba(26, 26, 26, 0.92)',
        border: 'rgba(201, 169, 110, 0.4)',
        color: 'var(--color-ivory)',
      }
    case 'error':
      return {
        icon: AlertCircle,
        iconColor: '#ff8a9c',
        background: 'rgba(46, 14, 22, 0.95)',
        border: 'rgba(220, 80, 100, 0.4)',
        color: 'var(--color-ivory)',
      }
    default:
      return {
        icon: Info,
        iconColor: 'var(--color-gold)',
        background: 'rgba(26, 26, 26, 0.92)',
        border: 'rgba(201, 169, 110, 0.25)',
        color: 'var(--color-ivory)',
      }
  }
}
