import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import useStore from '@/store/useStore'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const { isLoading, setLoading } = useStore()

  useEffect(() => {
    // Only show loading once per session
    const hasLoaded = sessionStorage.getItem('srishringaar_loaded')
    if (hasLoaded) {
      setLoading(false)
      return
    }

    // Simulate loading progress — fast
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setLoading(false)
            sessionStorage.setItem('srishringaar_loaded', '1')
          }, 400)
          return 100
        }
        return prev + Math.random() * 25
      })
    }, 80)

    // Safety timeout — 2.5s max
    const timeout = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('srishringaar_loaded', '1')
    }, 2500)

    // Remove the HTML loading screen
    const htmlLoader = document.getElementById('initial-loader')
    if (htmlLoader) {
      htmlLoader.style.opacity = '0'
      htmlLoader.style.transition = 'opacity 0.5s'
      setTimeout(() => htmlLoader.remove(), 500)
    }

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [setLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'var(--color-obsidian)' }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
          }}
        >
          {/* Logo */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.span
              className="text-3xl lg:text-4xl font-semibold tracking-[0.15em] mb-2"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
              animate={{
                backgroundPosition: ['0% center', '200% center'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              SRI SHRINGAAR
            </motion.span>
            <span
              className="text-[0.6rem] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory-muted)' }}
            >
              Heritage Jewellery
            </span>
          </motion.div>

          {/* Progress bar */}
          <div className="mt-12 w-32 h-px relative" style={{ background: 'rgba(201, 169, 110, 0.15)' }}>
            <motion.div
              className="absolute top-0 left-0 h-full"
              style={{ background: 'var(--color-gold)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3, ease: 'linear' }}
            />
          </div>

          {/* Progress text */}
          <motion.span
            className="mt-4 text-[0.6rem] tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(201, 169, 110, 0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
