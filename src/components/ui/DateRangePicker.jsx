import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, formatDate, toDateInputValue } from '@/utils/helpers'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isBefore(a, b) {
  return startOfDay(a).getTime() < startOfDay(b).getTime()
}

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  // Leading blanks
  for (let i = 0; i < startWeekday; i += 1) cells.push(null)
  // Actual days
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d))
  // Trailing blanks to complete the grid (always 6 rows × 7 cols)
  while (cells.length % 7 !== 0) cells.push(null)
  while (cells.length < 42) cells.push(null)
  return cells
}

/**
 * DateRangePicker — controlled component.
 *
 * Props:
 *   value:    { start: Date | null, end: Date | null }
 *   onChange: (next) => void
 *   minDate:  Date — earliest selectable day (default: today)
 *   maxDate:  Date — latest selectable day (default: +6 months)
 *   lockedDuration: number | null — if set, picking start auto-fills end = start + lockedDuration - 1
 *   isDateDisabled: (date) => boolean — extra predicate for blocking specific
 *     days (e.g. booked rentals). Disabled days are unselectable and visually
 *     muted; ranges that span a disabled day are flagged via `validateRange`.
 *   validateRange: ({ start, end }) => string | null — return an error
 *     message when the chosen range is invalid (e.g. spans a booked day,
 *     fails min/max length checks). Returning null/undefined keeps the
 *     range selected. Errors clear the in-progress range and surface to
 *     the caller via `onInvalid`.
 *   onInvalid: (message) => void — fires when validateRange rejects the
 *     range. Use this to show a toast or inline error.
 */
export default function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  lockedDuration = null,
  label = 'Rental Dates',
  isDateDisabled,
  validateRange,
  onInvalid,
}) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const min = minDate ? startOfDay(minDate) : today
  const max = maxDate ? startOfDay(maxDate) : addDays(today, 180)

  const [open, setOpen] = useState(false)
  const [hoverDate, setHoverDate] = useState(null)
  const [viewYear, setViewYear] = useState((value?.start || min).getFullYear())
  const [viewMonth, setViewMonth] = useState((value?.start || min).getMonth())
  const containerRef = useRef(null)

  // Re-anchor calendar view when value.start changes externally
  useEffect(() => {
    if (value?.start) {
      setViewYear(value.start.getFullYear())
      setViewMonth(value.start.getMonth())
    }
  }, [value?.start])

  // Close on outside click & ESC
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const goPrevMonth = () => {
    const d = new Date(viewYear, viewMonth - 1, 1)
    if (d.getFullYear() < min.getFullYear() || (d.getFullYear() === min.getFullYear() && d.getMonth() < min.getMonth())) return
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }
  const goNextMonth = () => {
    const d = new Date(viewYear, viewMonth + 1, 1)
    if (d.getFullYear() > max.getFullYear() || (d.getFullYear() === max.getFullYear() && d.getMonth() > max.getMonth())) return
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const handleSelect = (date) => {
    if (!date) return
    if (isBefore(date, min) || isBefore(max, date)) return
    if (isDateDisabled?.(date)) return

    // Helper: run optional validation on a candidate range. Returns true when
    // the range was accepted, false when rejected (and the picker is reset).
    const commit = (next) => {
      const err = validateRange?.(next)
      if (err) {
        onInvalid?.(err)
        // Reset to a clean slate so the user can start over without confusion.
        onChange?.({ start: null, end: null })
        return false
      }
      onChange?.(next)
      return true
    }

    // Locked duration mode (preset pills): the end is computed from the start.
    if (lockedDuration) {
      const newEnd = addDays(date, lockedDuration - 1)
      const accepted = commit({ start: startOfDay(date), end: startOfDay(newEnd) })
      if (accepted) setOpen(false)
      return
    }

    if (!value?.start || (value?.start && value?.end)) {
      // Start fresh range
      onChange?.({ start: startOfDay(date), end: null })
    } else if (isBefore(date, value.start)) {
      // Picked an earlier date than start → restart range from that date
      onChange?.({ start: startOfDay(date), end: null })
    } else {
      // Complete the range
      const accepted = commit({ start: value.start, end: startOfDay(date) })
      if (accepted) setOpen(false)
    }
  }

  const inRange = (date) => {
    if (!date || !value?.start) return false
    const end = value?.end || hoverDate
    if (!end) return false
    return startOfDay(date) > startOfDay(value.start) && startOfDay(date) < startOfDay(end)
  }

  const summary = (() => {
    if (value?.start && value?.end) {
      return `${formatDate(value.start)} → ${formatDate(value.end)}`
    }
    if (value?.start) {
      return `${formatDate(value.start)} — pick return date`
    }
    return 'Select rental dates'
  })()

  return (
    <div className="relative" ref={containerRef}>
      <label
        className="block label-text mb-2"
        style={{ color: 'var(--color-ivory-muted)' }}
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-xl pl-4 pr-4 pt-3 pb-3 transition-all duration-300 cursor-pointer"
        style={{
          fontFamily: 'var(--font-sans)',
          background: 'rgba(26, 26, 26, 0.6)',
          border: `1px solid ${open ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.2)'}`,
          color: value?.start ? 'var(--color-ivory)' : 'var(--color-ivory-muted)',
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 text-sm">
          <Calendar size={16} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
          {summary}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute z-50 mt-2 left-0 right-0 rounded-2xl p-4 shadow-lg"
            style={{
              background: 'var(--color-charcoal)',
              border: '1px solid rgba(201, 169, 110, 0.18)',
              maxWidth: '400px',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            role="dialog"
            aria-label="Choose rental dates"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goPrevMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
                style={{ color: 'var(--color-ivory-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201, 169, 110, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span
                className="text-sm font-medium tracking-wide"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', fontSize: '1rem' }}
              >
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={goNextMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
                style={{ color: 'var(--color-ivory-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201, 169, 110, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((w) => (
                <div
                  key={w}
                  className="text-center text-[0.6rem] tracking-[0.15em] uppercase pt-2 pb-2"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory-muted)' }}
                >
                  {w}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {grid.map((d, i) => {
                if (!d) return <div key={`b-${i}`} />
                const beforeMin = isBefore(d, min)
                const afterMax = isBefore(max, d)
                const externallyBlocked = !beforeMin && !afterMax && (isDateDisabled?.(d) || false)
                const disabled = beforeMin || afterMax || externallyBlocked
                const isStart = isSameDay(d, value?.start)
                const isEnd = isSameDay(d, value?.end)
                const isSelected = isStart || isEnd
                const isInRange = inRange(d)
                const isToday = isSameDay(d, today)

                return (
                  <button
                    key={toDateInputValue(d)}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelect(d)}
                    onMouseEnter={() => !disabled && setHoverDate(d)}
                    onMouseLeave={() => setHoverDate(null)}
                    className="relative h-9 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      color: disabled
                        ? 'rgba(245, 240, 232, 0.2)'
                        : isSelected
                        ? 'var(--color-obsidian)'
                        : 'var(--color-ivory)',
                      background: isSelected
                        ? 'var(--color-gold)'
                        : isInRange
                        ? 'rgba(201, 169, 110, 0.15)'
                        : externallyBlocked
                        ? 'rgba(128, 0, 32, 0.12)'
                        : 'transparent',
                      border: isToday && !isSelected
                        ? '1px solid rgba(201, 169, 110, 0.4)'
                        : externallyBlocked
                        ? '1px solid rgba(128, 0, 32, 0.25)'
                        : '1px solid transparent',
                      textDecoration: externallyBlocked ? 'line-through' : 'none',
                    }}
                    onMouseOver={(e) => {
                      if (!disabled && !isSelected && !isInRange) {
                        e.currentTarget.style.background = 'rgba(201, 169, 110, 0.08)'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!disabled && !isSelected && !isInRange) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                    aria-label={
                      externallyBlocked
                        ? `${formatDate(d)} (unavailable)`
                        : formatDate(d)
                    }
                    aria-selected={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    aria-disabled={disabled}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>

            {/* Footer summary */}
            <div
              className="mt-4 pt-4 flex items-center justify-between text-xs"
              style={{
                borderTop: '1px solid rgba(201, 169, 110, 0.1)',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-ivory-muted)',
              }}
            >
              <span>{summary}</span>
              {(value?.start || value?.end) && (
                <button
                  type="button"
                  onClick={() => onChange?.({ start: null, end: null })}
                  className="cursor-pointer transition-colors duration-200 hover:text-gold tracking-[0.1em] uppercase"
                  style={{ color: 'var(--color-ivory-muted)' }}
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
