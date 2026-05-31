import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  User, Package, MapPin, LogOut, ChevronRight, Calendar, Tag, Eye,
} from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import useAuth from '@/store/useAuth'
import { API_BASE_URL } from '@/utils/api'
import { formatPrice } from '@/utils/helpers'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
]

export default function Account() {
  const { user, isLoggedIn, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Determine active tab from URL
  const getActiveTabFromPath = () => {
    if (location.pathname.includes('/orders')) return 'orders'
    return 'profile'
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath())

  useEffect(() => {
    if (!isLoggedIn) navigate('/login', { replace: true })
  }, [isLoggedIn, navigate])

  useEffect(() => {
    setActiveTab(getActiveTabFromPath())
  }, [location.pathname])

  if (!isLoggedIn || !user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'orders') {
      navigate('/account/orders')
    } else {
      navigate('/account')
    }
  }

  return (
    <>
      <SEO title="My Account — Sri Shringaar" description="Manage your profile, orders and addresses." />

      <section className="pt-28 pb-20 min-h-screen" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="text-center mb-12">
            <SplitText className="heading-md" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
              My Account
            </SplitText>
            <p className="body-sm mt-2" style={{ color: 'var(--color-ivory-muted)' }}>
              Welcome back, {user.firstName}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="rounded-xl p-4" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer mb-1"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        background: active ? 'rgba(201,169,110,0.1)' : 'transparent',
                        color: active ? 'var(--color-gold)' : 'var(--color-ivory-muted)',
                      }}
                    >
                      <Icon size={16} />
                      {tab.label}
                      {active && <ChevronRight size={14} className="ml-auto" />}
                    </button>
                  )
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer mt-4"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ivory-muted)', borderTop: '1px solid rgba(201,169,110,0.1)', paddingTop: '1rem' }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && <ProfileTab user={user} updateProfile={updateProfile} />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'addresses' && <AddressesTab />}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── Profile Tab ─────────────────────────────────────────────────────── */
function ProfileTab({ user, updateProfile }) {
  const [form, setForm] = useState({
    fname: user.firstName || '',
    lname: user.lastName || '',
    mobile: user.phone || '',
    gender: user.gender || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const result = await updateProfile(form)
    setMessage(result.message || 'Profile updated')
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const inputStyle = {
    background: 'rgba(10,10,10,0.4)',
    border: '1px solid rgba(201,169,110,0.18)',
    color: 'var(--color-ivory)',
    fontFamily: 'var(--font-sans)',
  }

  return (
    <div className="rounded-xl p-6 lg:p-8" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
      <h2 className="heading-sm mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
        Personal Information
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-gold)' }}>First Name</label>
          <input value={form.fname} onChange={(e) => setForm({ ...form, fname: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-gold)' }}>Last Name</label>
          <input value={form.lname} onChange={(e) => setForm({ ...form, lname: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-gold)' }}>Email</label>
          <input value={user.email} disabled className="w-full px-4 py-3 rounded-lg text-sm opacity-60" style={inputStyle} />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-gold)' }}>Phone</label>
          <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-gold)' }}>Gender</label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2 flex items-center gap-4 mt-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Update Profile'}
          </Button>
          {message && <span className="text-sm" style={{ color: 'var(--color-gold)' }}>{message}</span>}
        </div>
      </form>
    </div>
  )
}

/* ─── Orders Tab ──────────────────────────────────────────────────────── */
function OrdersTab() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/order-history.php`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'success') setOrders(data.orders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
        <p style={{ color: 'var(--color-ivory-muted)' }}>Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
        <Package size={40} className="mx-auto mb-4" style={{ color: 'rgba(201,169,110,0.3)' }} />
        <p className="heading-sm mb-2" style={{ color: 'var(--color-ivory)' }}>No orders yet</p>
        <p className="body-sm mb-6" style={{ color: 'var(--color-ivory-muted)' }}>Start exploring our collection.</p>
        <Button to="/shop" variant="primary">Shop Now</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const isExpanded = expandedOrder === order.id
        return (
          <div key={order.id} className="rounded-xl overflow-hidden" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
            {/* Order header — clickable */}
            <div className="w-full p-5 lg:p-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs tracking-[0.15em] uppercase font-semibold" style={{ color: 'var(--color-gold)' }}>
                  {order.orderNumber}
                </p>
                {order.createdAt && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-ivory-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: order.status === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: order.status === 'paid' ? '#22c55e' : '#ef4444',
                  }}
                >
                  {order.status === 'paid' ? 'Confirmed' : order.status}
                </span>
                <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>
                  {formatPrice(order.total)}
                </span>
                <button
                  onClick={() => navigate(`/account/orders/${order.id}`)}
                  className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
                  style={{ 
                    background: 'rgba(201,169,110,0.1)', 
                    color: 'var(--color-gold)',
                    border: '1px solid rgba(201,169,110,0.2)'
                  }}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="p-2 cursor-pointer"
                  style={{ color: 'var(--color-ivory-muted)' }}
                >
                  <ChevronRight
                    size={16}
                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  />
                </button>
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="px-5 lg:px-6 pb-5 lg:pb-6" style={{ borderTop: '1px solid rgba(201,169,110,0.08)' }}>
                {/* Shipping info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--color-gold)' }}>Shipping To</p>
                    <p className="text-sm" style={{ color: 'var(--color-ivory)' }}>
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-ivory-muted)' }}>
                      {order.address}{order.city ? `, ${order.city}` : ''}{order.state ? `, ${order.state}` : ''} {order.pincode}
                    </p>
                    {order.phone && <p className="text-xs mt-0.5" style={{ color: 'var(--color-ivory-muted)' }}>Ph: {order.phone}</p>}
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--color-gold)' }}>Payment</p>
                    <p className="text-xs" style={{ color: 'var(--color-ivory-muted)' }}>
                      Transaction ID: {order.razorpayPaymentId || '—'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-ivory-muted)' }}>
                      Order ID: {order.razorpayOrderId || '—'}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <p className="text-[10px] tracking-[0.15em] uppercase mb-2 mt-2" style={{ color: 'var(--color-gold)' }}>Items</p>
                <div className="flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3 px-4 rounded-lg" style={{ background: 'rgba(10,10,10,0.3)' }}>
                      {/* Product Image */}
                      {item.image && (
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-20 object-cover rounded border"
                            style={{ borderColor: 'rgba(201,169,110,0.2)' }}
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--color-ivory)' }}>{item.name}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-ivory-muted)' }}>
                            SKU: {item.sku}
                          </span>
                          <span
                            className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{
                              background: (item.bookingType === 'buy' || item.bookingType === 'purchase' || !item.bookingType || item.bookingType === '') ? 'rgba(93,26,27,0.3)' : 'rgba(201,169,110,0.15)',
                              color: (item.bookingType === 'buy' || item.bookingType === 'purchase' || !item.bookingType || item.bookingType === '') ? 'var(--color-ivory)' : 'var(--color-gold)',
                            }}
                          >
                            {(item.bookingType === 'buy' || item.bookingType === 'purchase' || !item.bookingType || item.bookingType === '') ? 'Purchase' : `Rent · ${item.days} days`}
                          </span>
                          {item.startDate && (
                            <span className="text-[10px]" style={{ color: 'var(--color-ivory-muted)' }}>
                              {new Date(item.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(item.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                          <span className="text-[10px]" style={{ color: 'var(--color-ivory-muted)' }}>
                            Qty: {item.qty}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold ml-4 flex-shrink-0" style={{ color: 'var(--color-ivory)' }}>
                        {formatPrice(item.total)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order breakdown */}
                <div className="mt-4 pt-3 space-y-2" style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-ivory-muted)' }}>Items Subtotal</span>
                    <span style={{ color: 'var(--color-ivory)' }}>
                      {formatPrice(order.items.reduce((sum, item) => sum + item.total, 0))}
                    </span>
                  </div>
                  
                  {order.depositAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--color-ivory-muted)' }}>Refundable Deposit</span>
                      <span style={{ color: 'var(--color-ivory)' }}>
                        {formatPrice(order.depositAmount)}
                      </span>
                    </div>
                  )}
                  
                  {order.shippingCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--color-ivory-muted)' }}>Shipping Charge</span>
                      <span style={{ color: 'var(--color-ivory)' }}>
                        {formatPrice(order.shippingCharge)}
                      </span>
                    </div>
                  )}
                  
                  {order.couponCode && order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1.5" style={{ color: '#22c55e' }}>
                        <Tag size={12} />
                        Coupon ({order.couponCode})
                      </span>
                      <span style={{ color: '#22c55e' }}>
                        − {formatPrice(order.discountAmount)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-baseline pt-2" style={{ borderTop: '1px solid rgba(201,169,110,0.08)' }}>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ivory)' }}>Total Paid</span>
                    <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Addresses Tab ───────────────────────────────────────────────────── */
function AddressesTab() {
  return (
    <div className="rounded-xl p-6 lg:p-8" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
      <h2 className="heading-sm mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
        Saved Addresses
      </h2>
      <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>
        Addresses are saved automatically when you place an order. You can manage them from the checkout page.
      </p>
    </div>
  )
}
