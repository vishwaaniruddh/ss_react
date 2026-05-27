import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  ShoppingBag, Heart, Search, Menu, X, ChevronDown, User,
} from 'lucide-react'
import { NAV_LINKS } from '@/utils/constants'
import useStore from '@/store/useStore'
import { navbarVariants, mobileMenuVariants, staggerContainer, staggerItem } from '@/animations/variants'

/* ────────────────────────────────────────────────────────────────────────────
 * Utilities
 * ──────────────────────────────────────────────────────────────────────────── */

const idify = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/**
 * Distribute mega-menu items across columns of roughly equal *visual height*.
 *
 * Each item contributes weight 1, plus the count of its children (each child is
 * its own line). Items with children stay together — we never split a group
 * across columns. The algorithm is a greedy fill: target column count is fixed
 * (3 by default), each column fills until its weight exceeds the target weight.
 */
function distributeColumns(items, columnCount = 3) {
  if (!items.length) return []

  const weightOf = (item) => 1 + (item.children?.length || 0)
  const totalWeight = items.reduce((sum, it) => sum + weightOf(it), 0)
  const targetPerColumn = Math.ceil(totalWeight / columnCount)

  const cols = []
  let current = []
  let currentWeight = 0

  for (const item of items) {
    const w = weightOf(item)
    // Start a new column if the current one is "full" — but never leave a
    // column empty, and never produce more than `columnCount` columns.
    if (current.length > 0 && currentWeight + w > targetPerColumn && cols.length < columnCount - 1) {
      cols.push(current)
      current = []
      currentWeight = 0
    }
    current.push(item)
    currentWeight += w
  }
  if (current.length) cols.push(current)
  return cols
}

/* ────────────────────────────────────────────────────────────────────────────
 * Desktop mega-menu group — top-level link plus inline sub-categories.
 *
 * If `item.children` exists we render the sub-list directly underneath the
 * group label (no hover fly-out). This avoids overlap on dense menus and
 * keeps everything readable at a glance.
 * ──────────────────────────────────────────────────────────────────────────── */
function MegaMenuGroup({ item, onNavigate }) {
  const hasChildren = !!item.children?.length

  return (
    <div className="flex flex-col">
      <Link
        to={item.path}
        onClick={onNavigate}
        className="block pt-1.5 pb-1.5 text-sm transition-colors duration-200"
        style={{
          fontFamily: 'var(--font-sans)',
          color: hasChildren ? 'var(--color-ivory)' : 'var(--color-ivory-muted)',
          fontWeight: hasChildren ? 500 : 400,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = hasChildren ? 'var(--color-ivory)' : 'var(--color-ivory-muted)'
        }}
        id={`nav-submenu-${idify(item.label)}`}
      >
        {item.label}
      </Link>

      {hasChildren && (
        <ul className="flex flex-col list-none mt-0.5 mb-2">
          {item.children.map((child) => (
            <li key={child.label}>
              <Link
                to={child.path}
                onClick={onNavigate}
                className="block pt-1 pb-1 text-xs transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-ivory-muted)',
                  paddingLeft: '0.75rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-muted)')}
                id={`nav-submenu-${idify(item.label)}-${idify(child.label)}`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * Mobile accordion node — collapsible at every level.
 * ──────────────────────────────────────────────────────────────────────────── */
function MobileNavItem({ link, depth = 0, currentPath, onNavigate }) {
  const [open, setOpen] = useState(false)
  const hasChildren = !!link.children?.length

  if (!hasChildren) {
    return (
      <Link
        to={link.path}
        onClick={onNavigate}
        className="block transition-colors duration-300"
        style={{
          fontFamily: depth === 0 ? 'var(--font-serif)' : 'var(--font-sans)',
          fontSize: depth === 0 ? '1.5rem' : depth === 1 ? '0.95rem' : '0.85rem',
          fontWeight: depth === 0 ? 500 : 400,
          letterSpacing: depth === 0 ? '0.04em' : '0.05em',
          color: currentPath === link.path ? 'var(--color-gold)' : 'var(--color-ivory)',
          paddingTop: depth === 0 ? '0.5rem' : '0.4rem',
          paddingBottom: depth === 0 ? '0.5rem' : '0.4rem',
          paddingLeft: `${depth * 0.75}rem`,
        }}
        id={`mobile-nav-${idify(link.label)}`}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Link
          to={link.path}
          onClick={onNavigate}
          className="flex-1 transition-colors duration-300"
          style={{
            fontFamily: depth === 0 ? 'var(--font-serif)' : 'var(--font-sans)',
            fontSize: depth === 0 ? '1.5rem' : depth === 1 ? '0.95rem' : '0.85rem',
            fontWeight: depth === 0 ? 500 : 500,
            letterSpacing: depth === 0 ? '0.04em' : '0.05em',
            color: currentPath === link.path ? 'var(--color-gold)' : 'var(--color-ivory)',
            paddingTop: depth === 0 ? '0.5rem' : '0.4rem',
            paddingBottom: depth === 0 ? '0.5rem' : '0.4rem',
            paddingLeft: `${depth * 0.75}rem`,
          }}
        >
          {link.label}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            color: open ? 'var(--color-gold)' : 'var(--color-ivory-muted)',
            background: open ? 'rgba(201, 169, 110, 0.08)' : 'transparent',
            transition: 'all 0.2s ease',
          }}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${link.label} menu`}
          aria-expanded={open}
        >
          <ChevronDown
            size={16}
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div
              className="flex flex-col gap-0.5 pt-1 pb-2"
              style={{
                marginLeft: `${(depth + 1) * 0.5}rem`,
                borderLeft: '1px solid rgba(201, 169, 110, 0.15)',
                paddingLeft: '0.75rem',
              }}
            >
              {link.children.map((child) => (
                <MobileNavItem
                  key={child.label}
                  link={child}
                  depth={depth + 1}
                  currentPath={currentPath}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * Navbar
 * ──────────────────────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(null)
  const { scrollY } = useScroll()
  const location = useLocation()
  const { isMenuOpen, toggleMenu, closeMenu, cartCount, wishlistCount, toggleSearch } = useStore()
  const navRef = useRef(null)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50)
  })

  // Close menu on route change
  useEffect(() => {
    closeMenu()
    setMegaMenuOpen(null)
  }, [location, closeMenu])

  const handleMegaMenuEnter = useCallback((label) => {
    setMegaMenuOpen(label)
  }, [])

  const handleMegaMenuLeave = useCallback(() => {
    setMegaMenuOpen(null)
  }, [])

  return (
    <>
      <motion.header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        variants={navbarVariants}
        animate={scrolled ? 'scrolled' : 'top'}
        initial="top"
        style={{
          borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px -8px rgba(0, 0, 0, 0.08)' : 'none',
        }}
      >
        {/* Main nav */}
        <nav className="flex items-center justify-between pl-6 pr-6 lg:pl-12 lg:pr-12 pt-2 pb-2">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center relative z-10 group"
            id="nav-logo"
            aria-label="Sri Shringarr — Home"
          >
            <img
              src="/logo.png"
              alt="Sri Shringarr"
              className="h-12 lg:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const hasChildren = !!link.children?.length
              const columns = hasChildren ? distributeColumns(link.children, link.children.length > 4 ? 3 : 1) : []
              const isOpen = megaMenuOpen === link.label

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && handleMegaMenuEnter(link.label)}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <Link
                    to={link.path}
                    className="relative pt-2 pb-2 text-sm tracking-[0.08em] uppercase transition-colors duration-300 flex items-center gap-1 group"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      color: location.pathname === link.path ? 'var(--color-gold-dark, #a3833f)' : '#3a3a3a',
                    }}
                    id={`nav-link-${idify(link.label)}`}
                  >
                    <span className="group-hover:text-gold transition-colors duration-300">
                      {link.label}
                    </span>
                    {hasChildren && (
                      <ChevronDown
                        size={14}
                        className="transition-transform duration-300"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    )}
                    {/* Active indicator */}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-px w-full origin-left"
                      style={{ background: 'var(--color-gold)' }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: location.pathname === link.path ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>

                  {/* Mega menu dropdown */}
                  <AnimatePresence>
                    {hasChildren && isOpen && (
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <div
                          className="rounded-xl pt-6 pb-6 pl-8 pr-8"
                          style={{
                            background: 'var(--color-charcoal)',
                            border: '1px solid rgba(201, 169, 110, 0.18)',
                            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
                            minWidth: columns.length > 1 ? `${columns.length * 200}px` : '240px',
                          }}
                        >
                          <p
                            className="label-text mb-5"
                            style={{ color: 'var(--color-ivory-muted)' }}
                          >
                            {link.label}
                          </p>
                          <div
                            className="grid gap-x-10 gap-y-1"
                            style={{
                              gridTemplateColumns: `repeat(${columns.length}, minmax(180px, 1fr))`,
                            }}
                          >
                            {columns.map((col, ci) => (
                              <div key={ci} className="flex flex-col">
                                {col.map((child) => (
                                  <MegaMenuGroup
                                    key={child.label}
                                    item={child}
                                    onNavigate={() => setMegaMenuOpen(null)}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 lg:gap-5">
            <button
              onClick={toggleSearch}
              className="cursor-pointer transition-colors duration-300 hover:text-gold"
              style={{ color: '#3a3a3a' }}
              aria-label="Search"
              id="nav-search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link
              to="/auth"
              className="hidden lg:block transition-colors duration-300 hover:text-gold"
              style={{ color: '#3a3a3a' }}
              aria-label="Account"
              id="nav-account"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            <Link
              to="/wishlist"
              className="hidden lg:block transition-colors duration-300 hover:text-gold relative"
              style={{ color: '#3a3a3a' }}
              aria-label="Wishlist"
              id="nav-wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-semibold"
                  style={{ background: 'var(--color-gold)', color: 'var(--color-obsidian)' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative transition-colors duration-300 hover:text-gold"
              style={{ color: '#3a3a3a' }}
              aria-label="Shopping Cart"
              id="nav-cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-semibold"
                  style={{ background: 'var(--color-gold)', color: 'var(--color-obsidian)' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden cursor-pointer transition-colors duration-300"
              style={{ color: '#3a3a3a' }}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              id="nav-menu-toggle"
            >
              {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile full-screen menu */}
      <motion.div
        className="fixed inset-0 z-40 lg:hidden flex flex-col pl-8 pr-8 pt-24 pb-8 overflow-y-auto"
        style={{ background: 'var(--color-obsidian)' }}
        variants={mobileMenuVariants}
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        aria-hidden={!isMenuOpen}
      >
        <motion.nav
          className="flex flex-col gap-2"
          variants={staggerContainer}
          initial="initial"
          animate={isMenuOpen ? 'animate' : 'initial'}
        >
          {NAV_LINKS.map((link) => (
            <motion.div key={link.label} variants={staggerItem}>
              <MobileNavItem
                link={link}
                currentPath={location.pathname}
                onNavigate={closeMenu}
              />
            </motion.div>
          ))}

          {/* Mobile action links */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-gold/10">
            <Link to="/auth" onClick={closeMenu} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-gold)' }}>
              <User size={18} strokeWidth={1.5} /> Account
            </Link>
            <Link to="/wishlist" onClick={closeMenu} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-gold)' }}>
              <Heart size={18} strokeWidth={1.5} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <Link to="/cart" onClick={closeMenu} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-gold)' }}>
              <ShoppingBag size={18} strokeWidth={1.5} /> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </motion.div>
        </motion.nav>
      </motion.div>
    </>
  )
}
