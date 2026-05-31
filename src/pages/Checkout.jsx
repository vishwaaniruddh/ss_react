import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Truck, CheckCircle, Lock, XCircle, AlertTriangle, ShoppingBag } from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import useStore from '@/store/useStore'
import useAuth from '@/store/useAuth'
import { formatPrice } from '@/utils/helpers'
import { API_BASE_URL } from '@/utils/api'

const RAZORPAY_KEY = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'rzp_test_4gwWqpQ2mlWxfH'
  : 'rzp_live_DW1px0XkHJ4tAv'

// Lazy-load Razorpay script only when checkout page is visited
function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, getCartTotal, clearCart, coupon, removeCoupon } = useStore()
  const { isLoggedIn, user } = useAuth()
  const [step, setStep] = useState('shipping') // shipping | processing | success | failed
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState(null)

  // Shipping charge state
  const [shippingCharge, setShippingCharge] = useState(0)
  const [loadingShipping, setLoadingShipping] = useState(false)

  // State/City dropdowns
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(false)

  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    stateId: '',
    stateName: '',
    cityId: '',
    cityName: '',
    pincode: '',
  })

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?redirect=checkout', { replace: true })
    }
  }, [isLoggedIn, navigate])

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && step === 'shipping') {
      navigate('/cart', { replace: true })
    }
  }, [cart, step, navigate])

  // Prefill from user profile
  useEffect(() => {
    if (user) {
      setShipping((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }))
    }
  }, [user])

  // Fetch states on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/locations.php?action=get_states`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setStates(data)
      })
      .catch(() => {})
  }, [])

  // Fetch cities when state changes
  useEffect(() => {
    if (!shipping.stateId) {
      setCities([])
      return
    }
    setLoadingCities(true)
    fetch(`${API_BASE_URL}/locations.php?action=get_cities&state_id=${shipping.stateId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCities(data)
        setLoadingCities(false)
      })
      .catch(() => setLoadingCities(false))
  }, [shipping.stateId])

  if (!isLoggedIn) return null

  const subtotal = getCartTotal()
  const depositTotal = cart.reduce((acc, item) => acc + (item.rental?.deposit || 0) * item.quantity, 0)
  const discount = coupon?.discount || 0
  const total = Math.max(0, subtotal + depositTotal + shippingCharge - discount)

  // Fetch shipping charges when cart total changes
  useEffect(() => {
    const fetchShippingCharge = async () => {
      const cartTotal = subtotal + depositTotal
      
      if (cartTotal <= 0) {
        setShippingCharge(0)
        return
      }

      setLoadingShipping(true)
      try {
        const res = await fetch(`${API_BASE_URL}/calculate-shipping.php?cart_total=${cartTotal}`, {
          method: 'GET',
          credentials: 'include',
        })
        const data = await res.json()
        
        if (data.success) {
          setShippingCharge(data.data.shipping_charge || 0)
        } else {
          setShippingCharge(0)
        }
      } catch (error) {
        console.error('Failed to fetch shipping charge:', error)
        setShippingCharge(0)
      } finally {
        setLoadingShipping(false)
      }
    }

    fetchShippingCharge()
  }, [subtotal, depositTotal])

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value })
  }

  const handleStateChange = (e) => {
    const selectedId = e.target.value
    const selectedState = states.find((s) => String(s.id) === selectedId)
    setShipping({
      ...shipping,
      stateId: selectedId,
      stateName: selectedState?.name || '',
      cityId: '',
      cityName: '',
    })
  }

  const handleCityChange = (e) => {
    const selectedId = e.target.value
    const selectedCity = cities.find((c) => String(c.id) === selectedId)
    setShipping({
      ...shipping,
      cityId: selectedId,
      cityName: selectedCity?.name || '',
    })
  }

  const validateShipping = () => {
    const required = [
      ['firstName', 'first name'],
      ['lastName', 'last name'],
      ['email', 'email'],
      ['phone', 'phone'],
      ['address', 'address'],
      ['stateId', 'state'],
      ['cityId', 'city'],
      ['pincode', 'pincode'],
    ]
    for (const [field, label] of required) {
      if (!shipping[field]?.trim()) {
        setError(`Please select/fill ${label}`)
        return false
      }
    }
    if (!/^\d{6}$/.test(shipping.pincode)) {
      setError('Please enter a valid 6-digit pincode')
      return false
    }
    setError('')
    return true
  }

  const handlePayment = async () => {
    if (!validateShipping()) return

    setStep('processing')
    setError('')

    try {
      // Load Razorpay SDK if not already loaded
      await loadRazorpay()

      const orderRes = await fetch(`${API_BASE_URL}/create-razorpay-order.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      })
      const orderData = await orderRes.json()

      if (orderData.error || !orderData.id) {
        setError(orderData.error || 'Failed to create order. Please try again.')
        setStep('shipping')
        return
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Sri Shringarr',
        description: `Order for ${cart.length} item(s)`,
        order_id: orderData.id,
        prefill: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: { color: '#C9A96E' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/verify-payment.php`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payment: response,
                order: orderData,
                shipping: {
                  firstName: shipping.firstName,
                  lastName: shipping.lastName,
                  email: shipping.email,
                  phone: shipping.phone,
                  address: shipping.address,
                  landmark: shipping.landmark,
                  city: shipping.cityName,
                  state: shipping.stateName,
                  pincode: shipping.pincode,
                },
                cartItems: cart.map((item) => ({
                  id: item.id,
                  name: item.name,
                  code: item.code,
                  type: item.type,
                  price: item.price,
                  quantity: item.quantity,
                  orderType: item.orderType || 'rent',
                  rental: item.rental ? {
                    days: item.rental.days,
                    startDate: item.rental.startDate,
                    endDate: item.rental.endDate,
                    deposit: item.rental.deposit,
                  } : null,
                })),
                couponCode: coupon?.code || null,
                shippingCharge: shippingCharge,
                discountAmount: discount,
              }),
            })
            const verifyData = await verifyRes.json()

            if (verifyData.status === 'success') {
              setOrderId(verifyData.order_id)
              setStep('success')
              clearCart()
              removeCoupon()
            } else {
              setError(verifyData.message || 'Payment verification failed')
              setStep('failed')
            }
          } catch {
            setError('Payment verification failed. Please contact support.')
            setStep('failed')
          }
        },
        modal: {
          ondismiss: () => {
            setStep('shipping')
            setError('Payment was cancelled.')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        setError(resp.error?.description || 'Payment failed. Please try again.')
        setStep('failed')
      })
      rzp.open()
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('shipping')
    }
  }

  const inputStyle = {
    background: 'rgba(10, 10, 10, 0.4)',
    border: '1px solid rgba(201, 169, 110, 0.15)',
    color: 'var(--color-ivory)',
    fontFamily: 'var(--font-sans)',
  }

  return (
    <>
      <SEO title="Checkout — Sri Shringaar" description="Complete your order securely." />

      <section className="pt-28 pb-20 min-h-screen" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury max-w-5xl">
          <div className="text-center mb-10">
            <SplitText className="heading-lg" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
              Checkout
            </SplitText>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs" style={{ color: 'var(--color-gold)' }}>
              <Lock size={12} /> Secure Checkout powered by Razorpay
            </div>
          </div>

          {/* Shipping Step */}
          {step === 'shipping' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left — Form */}
              <div className="lg:col-span-2 rounded-2xl p-6 lg:p-8" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
                <h3 className="heading-sm mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                  <Truck size={18} style={{ color: 'var(--color-gold)' }} /> Shipping Details
                </h3>

                {error && (
                  <div className="mb-5 p-3 rounded-lg flex items-center gap-2 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                    <AlertTriangle size={14} /> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>First Name *</label>
                    <input name="firstName" value={shipping.firstName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>Last Name *</label>
                    <input name="lastName" value={shipping.lastName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>Email *</label>
                    <input name="email" type="email" value={shipping.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>Phone *</label>
                    <input name="phone" type="tel" value={shipping.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>Address *</label>
                    <input name="address" value={shipping.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} placeholder="House/Flat No., Street, Area" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>Landmark</label>
                    <input name="landmark" value={shipping.landmark} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} placeholder="Near..." />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>State *</label>
                    <select value={shipping.stateId} onChange={handleStateChange} className="w-full px-4 py-3 rounded-lg text-sm outline-none cursor-pointer" style={inputStyle}>
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id} style={{ background: 'var(--color-charcoal)' }}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>City *</label>
                    <select value={shipping.cityId} onChange={handleCityChange} disabled={!shipping.stateId || loadingCities} className="w-full px-4 py-3 rounded-lg text-sm outline-none cursor-pointer disabled:opacity-50" style={inputStyle}>
                      <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id} style={{ background: 'var(--color-charcoal)' }}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--color-gold)' }}>Pincode *</label>
                    <input name="pincode" value={shipping.pincode} onChange={handleInputChange} maxLength={6} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} placeholder="6-digit pincode" />
                  </div>
                </div>
              </div>

              {/* Right — Order Summary */}
              <aside className="lg:col-span-1">
                <div className="rounded-2xl p-6 sticky top-28" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
                  <h3 className="heading-sm mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                    Order Summary
                  </h3>

                  {/* Cart items mini list */}
                  <div className="flex flex-col gap-3 mb-5 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--color-slate)' }}>
                          {item.images?.[0] && <img src={item.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate" style={{ color: 'var(--color-ivory)' }}>{item.name}</p>
                          <span className="text-[9px] uppercase tracking-wider" style={{ color: item.orderType === 'purchase' ? 'var(--color-ivory-muted)' : 'var(--color-gold)' }}>
                            {item.orderType === 'purchase' ? 'Purchase' : `Rent · ${item.rental?.days || 3}d`}
                          </span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'var(--color-ivory)' }}>
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="luxury-divider mb-4" style={{ opacity: 0.15 }} />

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-ivory-muted)' }}>Subtotal</span>
                      <span style={{ color: 'var(--color-ivory)' }}>{formatPrice(subtotal)}</span>
                    </div>
                    {depositTotal > 0 && (
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--color-ivory-muted)' }}>Deposit (refundable)</span>
                        <span style={{ color: 'var(--color-ivory)' }}>{formatPrice(depositTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-ivory-muted)' }}>Shipping</span>
                      {loadingShipping ? (
                        <span style={{ color: 'var(--color-ivory-muted)' }}>Calculating...</span>
                      ) : (
                        <span style={{ color: 'var(--color-ivory)' }}>{formatPrice(shippingCharge)}</span>
                      )}
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span style={{ color: '#22c55e' }}>Discount ({coupon?.code})</span>
                        <span style={{ color: '#22c55e' }}>− {formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="luxury-divider my-4" style={{ opacity: 0.15 }} />

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ivory)' }}>Total</span>
                    <span className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>
                      {formatPrice(total)}
                    </span>
                  </div>

                  <Button variant="primary" size="lg" className="w-full" onClick={handlePayment} id="checkout-pay-now">
                    <CreditCard size={16} /> Pay Now
                  </Button>

                  <Link to="/cart" className="block text-center mt-4 text-xs tracking-wider uppercase" style={{ color: 'var(--color-ivory-muted)' }}>
                    ← Back to Cart
                  </Link>
                </div>
              </aside>
            </motion.div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border-2 animate-spin mx-auto mb-6" style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: 'var(--color-gold)' }} />
              <p style={{ color: 'var(--color-ivory)' }}>Processing your payment...</p>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <CheckCircle size={64} className="mx-auto mb-6" style={{ color: '#22c55e' }} />
              <h3 className="heading-md mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                Order Confirmed!
              </h3>
              <p className="body-lg mb-2" style={{ color: 'var(--color-ivory-muted)' }}>
                Your order #{orderId ? `SR-${orderId + 5000}` : ''} has been placed successfully.
              </p>
              <p className="text-sm mb-8" style={{ color: 'var(--color-ivory-muted)' }}>
                A confirmation email has been sent to {shipping.email}
              </p>
              <div className="flex gap-4 justify-center">
                <Button to="/account" variant="secondary">View Orders</Button>
                <Button to="/shop" variant="primary">Continue Shopping</Button>
              </div>
            </motion.div>
          )}

          {/* Failed */}
          {step === 'failed' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <XCircle size={64} className="mx-auto mb-6" style={{ color: '#ef4444' }} />
              <h3 className="heading-md mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                Payment Failed
              </h3>
              <p className="body-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--color-ivory-muted)' }}>
                {error || 'Something went wrong with your payment. Please try again.'}
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={() => { setStep('shipping'); setError(''); }}>
                  Try Again
                </Button>
                <Button to="/cart" variant="secondary">Back to Cart</Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
