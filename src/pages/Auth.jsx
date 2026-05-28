import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle2, Sparkles, AlertTriangle,
} from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import { fadeInUp } from '@/animations/variants'
import useAuth from '@/store/useAuth'

const inputStyle = {
  background: 'rgba(10, 10, 10, 0.45)',
  border: '1px solid rgba(201, 169, 110, 0.18)',
  color: 'var(--color-ivory)',
  fontFamily: 'var(--font-sans)',
}

const labelClass = 'block text-[11px] tracking-[0.2em] uppercase mb-2'
const labelStyle = { color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }

function GoogleButton({ id }) {
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'

  const handleGoogleLogin = () => {
    window.location.href = `/API/v1/google-login.php?redirect=${encodeURIComponent('/' + redirect.replace(/^\//, ''))}`
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full inline-flex items-center justify-center gap-3 py-3 rounded-full text-xs tracking-[0.18em] uppercase font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
      style={{
        background: 'rgba(245, 240, 232, 0.06)',
        border: '1px solid rgba(201, 169, 110, 0.25)',
        color: 'var(--color-ivory)',
        fontFamily: 'var(--font-sans)',
      }}
      id={id}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.1 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-2H12z" />
      </svg>
      Continue with Google
    </button>
  )
}

function LoginPane({ id = 'login' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (result.success) {
      const redirect = searchParams.get('redirect')
      navigate(redirect ? `/${redirect}` : '/account', { replace: true })
    } else {
      setError(result.message || 'Login failed')
    }
  }

  return (
    <motion.form
      key="login-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col"
      id={`auth-${id}-form`}
    >
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--color-gold)' }}>
          Existing Patrons
        </p>
        <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', fontWeight: 500 }}>
          Welcome Back
        </h2>
        <p className="body-sm mt-2" style={{ color: 'var(--color-ivory-muted)' }}>
          Sign in to access your curated collections and bookings.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div className="mb-4">
        <label className={labelClass} style={labelStyle} htmlFor={`${id}-email`}>Email Address</label>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-gold)', opacity: 0.55 }} />
          <input
            id={`${id}-email`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-gold/30 focus:border-gold/50"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className={labelClass} style={labelStyle} htmlFor={`${id}-password`}>Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-gold)', opacity: 0.55 }} />
          <input
            id={`${id}-password`}
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-11 py-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-gold/30 focus:border-gold/50"
            style={inputStyle}
          />
          <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: 'var(--color-ivory-muted)' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <label className="flex items-center gap-2 text-[12px] cursor-pointer" style={{ color: 'var(--color-ivory-muted)' }}>
          <input type="checkbox" className="accent-gold" /> Remember me
        </label>
        <a href="#" className="text-[12px] hover:text-gold transition-colors" style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}>
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs tracking-[0.18em] uppercase font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-0.5 shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: 'var(--color-obsidian)', fontFamily: 'var(--font-sans)', border: 'none' }}
        id={`auth-${id}-submit`}
      >
        {isLoading ? 'Signing in...' : 'Sign In'} {!isLoading && <ArrowRight size={14} />}
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: 'rgba(201, 169, 110, 0.15)' }} />
        <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--color-ivory-muted)' }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(201, 169, 110, 0.15)' }} />
      </div>

      <GoogleButton id={`auth-${id}-google`} />
    </motion.form>
  )
}

function RegisterPane({ id = 'register' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const nameParts = form.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const result = await register({
      firstName,
      lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    })
    if (result.success) {
      const redirect = searchParams.get('redirect')
      navigate(redirect ? `/${redirect}` : '/account', { replace: true })
    } else {
      setError(result.message || 'Registration failed')
    }
  }

  return (
    <motion.form
      key="register-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="flex flex-col"
      id={`auth-${id}-form`}
    >
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--color-gold)' }}>
          New to Sri Shringarr
        </p>
        <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', fontWeight: 500 }}>
          Create Your Account
        </h2>
        <p className="body-sm mt-2" style={{ color: 'var(--color-ivory-muted)' }}>
          Join the inner circle for invitations, private viewings, and bespoke services.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div className="mb-4">
        <label className={labelClass} style={labelStyle} htmlFor={`${id}-name`}>Full Name</label>
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-gold)', opacity: 0.55 }} />
          <input id={`${id}-name`} type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-all duration-300" style={inputStyle} />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle} htmlFor={`${id}-email`}>Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-gold)', opacity: 0.55 }} />
            <input id={`${id}-email`} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-all duration-300" style={inputStyle} />
          </div>
        </div>
        <div>
          <label className={labelClass} style={labelStyle} htmlFor={`${id}-phone`}>Phone</label>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-gold)', opacity: 0.55 }} />
            <input id={`${id}-phone`} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-all duration-300" style={inputStyle} />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className={labelClass} style={labelStyle} htmlFor={`${id}-password`}>Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-gold)', opacity: 0.55 }} />
          <input id={`${id}-password`} type={showPassword ? 'text' : 'password'} required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-11 pr-11 py-3 rounded-lg text-sm outline-none transition-all duration-300" style={inputStyle} />
          <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: 'var(--color-ivory-muted)' }}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: 'rgba(245, 240, 232, 0.4)' }}>Minimum 8 characters</p>
      </div>

      <label className="flex items-start gap-2.5 mb-5 text-[12px] cursor-pointer" style={{ color: 'var(--color-ivory-muted)' }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-gold mt-0.5" />
        <span>I agree to the <a href="/terms" className="hover:underline" style={{ color: 'var(--color-gold)' }}>Terms of Service</a> and acknowledge the privacy policy.</span>
      </label>

      <button
        type="submit"
        disabled={!agreed || isLoading}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs tracking-[0.18em] uppercase font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-0.5 shadow-lg hover:shadow-gold/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: 'var(--color-obsidian)', fontFamily: 'var(--font-sans)', border: 'none' }}
        id={`auth-${id}-submit`}
      >
        {isLoading ? 'Creating...' : 'Create Account'} {!isLoading && <ArrowRight size={14} />}
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: 'rgba(201, 169, 110, 0.15)' }} />
        <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--color-ivory-muted)' }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(201, 169, 110, 0.15)' }} />
      </div>

      <GoogleButton id={`auth-${id}-google`} />
    </motion.form>
  )
}

const benefits = [
  'Early access to new heritage collections',
  'Private viewings and bespoke consultations',
  'Concierge support for rentals & sizing',
  'Saved wishlists and order history',
]

export default function Auth() {
  // Mobile uses a tab toggle; desktop shows both panes side by side.
  const [mobileMode, setMobileMode] = useState('login')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { checkSession, isLoggedIn } = useAuth()

  // Handle Google OAuth callback — user returns with ?login=google_success
  useEffect(() => {
    if (searchParams.get('login') === 'google_success') {
      checkSession().then(() => {
        const redirect = searchParams.get('redirect') || '/account'
        navigate(redirect, { replace: true })
      })
    }
  }, [searchParams, checkSession, navigate])

  // If already logged in, redirect to account
  useEffect(() => {
    if (isLoggedIn) {
      const redirect = searchParams.get('redirect')
      navigate(redirect ? `/${redirect}` : '/account', { replace: true })
    }
  }, [isLoggedIn, navigate, searchParams])

  return (
    <>
      <SEO
        title="Sign In or Register"
        description="Access your Sri Shringarr account, or create one to receive private invitations and concierge service."
      />

      <section
        className="page-header min-h-screen flex items-center"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury w-full">
          {/* Heading */}
          <div className="text-center mb-10 lg:mb-14">
            <motion.span
              className="text-xs font-semibold tracking-[0.3em] uppercase block mb-3"
              style={{ color: 'var(--color-gold)' }}
              {...fadeInUp}
            >
              The Inner Circle
            </motion.span>
            <SplitText
              className="heading-xl"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Welcome to Sri Shringarr
            </SplitText>
            <motion.p
              className="body-sm mt-3 max-w-md mx-auto"
              style={{ color: 'var(--color-ivory-muted)' }}
              {...fadeInUp}
            >
              Curated luxury for momentous occasions.
            </motion.p>
          </div>

          {/* Wide split card */}
          <motion.div
            className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(15,15,15,0.95) 100%)',
              border: '1px solid rgba(201, 169, 110, 0.18)',
              boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Subtle gold halos */}
            <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

            {/* Mobile tabs */}
            <div className="lg:hidden flex p-1 m-6 mb-0 rounded-full" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,169,110,0.18)' }}>
              {['login', 'register'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMobileMode(tab)}
                  className="flex-1 py-2.5 rounded-full text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-300"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    background:
                      mobileMode === tab
                        ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                        : 'transparent',
                    color: mobileMode === tab ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
                  }}
                  id={`auth-tab-${tab}`}
                >
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 relative">
              {/* LEFT — Login */}
              <div
                className={`p-8 md:p-10 lg:p-12 ${
                  mobileMode === 'login' ? 'block' : 'hidden'
                } lg:block`}
                style={{
                  borderRight: '1px solid rgba(201, 169, 110, 0.12)',
                }}
              >
                <LoginPane />
              </div>

              {/* Center divider ornament (desktop only) */}
              <div
                className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center gap-2 pointer-events-none"
                aria-hidden="true"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--color-obsidian)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                  }}
                >
                  <Sparkles size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
              </div>

              {/* RIGHT — Register (with subtle highlight panel) */}
              <div
                className={`p-8 md:p-10 lg:p-12 ${
                  mobileMode === 'register' ? 'block' : 'hidden'
                } lg:block relative`}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(201,169,110,0.06), rgba(201,169,110,0.02))',
                }}
              >
                <RegisterPane />
              </div>
            </div>

            {/* Bottom benefits strip */}
            <div
              className="hidden md:flex items-center justify-center gap-8 px-10 py-5 flex-wrap"
              style={{
                background: 'rgba(0,0,0,0.3)',
                borderTop: '1px solid rgba(201, 169, 110, 0.12)',
              }}
            >
              {benefits.map((b) => (
                <div
                  key={b}
                  className="inline-flex items-center gap-2 text-[12px]"
                  style={{ color: 'var(--color-ivory-muted)' }}
                >
                  <CheckCircle2 size={13} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                  {b}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile cross-link footer */}
          <motion.p
            className="lg:hidden text-center mt-8 text-[13px]"
            style={{ color: 'var(--color-ivory-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {mobileMode === 'login' ? (
              <>
                New here?{' '}
                <button
                  onClick={() => setMobileMode('register')}
                  className="hover:underline cursor-pointer"
                  style={{ color: 'var(--color-gold)' }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already with us?{' '}
                <button
                  onClick={() => setMobileMode('login')}
                  className="hover:underline cursor-pointer"
                  style={{ color: 'var(--color-gold)' }}
                >
                  Sign in
                </button>
              </>
            )}
          </motion.p>
        </div>
      </section>
    </>
  )
}
