import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Tag } from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import { API_BASE_URL } from '@/utils/api'
import { formatPrice, productUrl } from '@/utils/helpers'

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/order-history.php`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'success') {
          // Compare as strings since API returns id as string
          const foundOrder = data.orders.find((o) => String(o.id) === String(orderId))
          
          if (foundOrder) {
            setOrder(foundOrder)
          } else {
            setError('Order not found')
          }
        } else {
          setError(data.message || 'Failed to load order')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setError('Failed to load order')
        setLoading(false)
      })
  }, [orderId])

  if (loading) {
    return (
      <section className="pt-28 pb-20 min-h-screen" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
            <p style={{ color: 'var(--color-ivory-muted)' }}>Loading order details...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="pt-28 pb-20 min-h-screen" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
            <Package size={40} className="mx-auto mb-4" style={{ color: 'rgba(201,169,110,0.3)' }} />
            <p className="heading-sm mb-2" style={{ color: 'var(--color-ivory)' }}>
              {error || 'Order not found'}
            </p>
            <Button to="/account/orders" variant="primary" className="mt-4">Back to Orders</Button>
          </div>
        </div>
      </section>
    )
  }

  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.total, 0)

  return (
    <>
      <SEO 
        title={`Order ${order.orderNumber} — Sri Shringaar`} 
        description="View your order details and status." 
      />

      <section className="pt-28 pb-20 min-h-screen" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          {/* Back Button */}
          <Link 
            to="/account/orders"
            className="inline-flex items-center gap-2 mb-6 text-sm transition-colors cursor-pointer"
            style={{ color: 'var(--color-ivory-muted)' }}
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <SplitText className="heading-md" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                  {order.orderNumber}
                </SplitText>
                {order.createdAt && (
                  <p className="text-sm mt-2" style={{ color: 'var(--color-ivory-muted)' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              <span
                className="text-xs tracking-[0.1em] uppercase px-4 py-2 rounded-full font-semibold"
                style={{
                  background: order.status === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  color: order.status === 'paid' ? '#22c55e' : '#ef4444',
                }}
              >
                {order.status === 'paid' ? 'Confirmed' : order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="rounded-xl p-6" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <Package size={20} style={{ color: 'var(--color-gold)' }} />
                  <h2 className="heading-sm" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                    Order Items
                  </h2>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => {
                    const productLink = productUrl({ name: item.name, id: item.productId })
                    
                    return (
                    <div 
                      key={item.id} 
                      className="flex gap-4 p-4 rounded-lg" 
                      style={{ background: 'rgba(10,10,10,0.3)', border: '1px solid rgba(201,169,110,0.05)' }}
                    >
                      {/* Product Image */}
                      {item.image && (
                        <div className="flex-shrink-0">
                          <Link to={productLink}>
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-24 h-32 object-cover rounded-lg border-2 transition-opacity cursor-pointer"
                              style={{ 
                                borderColor: 'rgba(201,169,110,0.2)'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                            />
                          </Link>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-base font-medium mb-2" style={{ color: 'var(--color-ivory)' }}>
                          <Link 
                            to={productLink}
                            className="hover:underline transition-colors"
                            style={{ color: 'var(--color-gold)' }}
                          >
                            {item.name}
                          </Link>
                        </h3>
                        
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span 
                            className="px-2 py-1 rounded"
                            style={{ background: 'rgba(201,169,110,0.1)', color: 'var(--color-gold)' }}
                          >
                            SKU: {item.sku}
                          </span>
                          
                          <span
                            className="px-2 py-1 rounded"
                            style={{
                              background: (item.bookingType === 'buy' || item.bookingType === 'purchase' || !item.bookingType || item.bookingType === '') ? 'rgba(93,26,27,0.3)' : 'rgba(201,169,110,0.15)',
                              color: (item.bookingType === 'buy' || item.bookingType === 'purchase' || !item.bookingType || item.bookingType === '') ? 'var(--color-ivory)' : 'var(--color-gold)',
                            }}
                          >
                            {(item.bookingType === 'buy' || item.bookingType === 'purchase' || !item.bookingType || item.bookingType === '') ? '🛍️ Purchase' : `📅 ${item.days} Days Rental`}
                          </span>

                          <span style={{ color: 'var(--color-ivory-muted)' }}>
                            Qty: {item.qty}
                          </span>
                        </div>

                        {item.startDate && item.bookingType && item.bookingType !== 'buy' && item.bookingType !== 'purchase' && item.bookingType !== '' && (
                          <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'var(--color-ivory-muted)' }}>
                            <Calendar size={14} />
                            <span>
                              {new Date(item.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} 
                              {' — '}
                              {new Date(item.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        )}

                        <div className="mt-2 text-xs" style={{ color: 'var(--color-ivory-muted)' }}>
                          {item.qty} × {formatPrice(item.price)}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-gold)' }}>
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  )})}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-xl p-6" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} style={{ color: 'var(--color-gold)' }} />
                  <h2 className="heading-sm" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                    Shipping Address
                  </h2>
                </div>
                
                <div className="text-sm" style={{ color: 'var(--color-ivory)', lineHeight: '1.8' }}>
                  <p className="font-semibold mb-1">{order.firstName} {order.lastName}</p>
                  <p style={{ color: 'var(--color-ivory-muted)' }}>{order.address}</p>
                  {order.landmark && <p style={{ color: 'var(--color-ivory-muted)' }}>Landmark: {order.landmark}</p>}
                  <p style={{ color: 'var(--color-ivory-muted)' }}>
                    {order.city}, {order.state} - {order.pincode}
                  </p>
                  <p className="mt-2" style={{ color: 'var(--color-ivory-muted)' }}>
                    <strong style={{ color: 'var(--color-ivory)' }}>Phone:</strong> {order.phone}
                  </p>
                  <p style={{ color: 'var(--color-ivory-muted)' }}>
                    <strong style={{ color: 'var(--color-ivory)' }}>Email:</strong> {order.email}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="rounded-xl p-6" style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201,169,110,0.1)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} style={{ color: 'var(--color-gold)' }} />
                  <h2 className="heading-sm" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                    Payment Information
                  </h2>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-ivory-muted)' }}>Payment Method</span>
                    <span style={{ color: 'var(--color-ivory)' }}>Razorpay</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-ivory-muted)' }}>Transaction ID</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--color-ivory)' }}>
                      {order.razorpayPaymentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-ivory-muted)' }}>Order ID</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--color-ivory)' }}>
                      {order.razorpayOrderId}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
                    <span style={{ color: 'var(--color-ivory-muted)' }}>Status</span>
                    <span 
                      className="text-xs px-2 py-1 rounded font-semibold"
                      style={{ background: '#22c55e', color: 'white' }}
                    >
                      PAID
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-xl p-6 sticky top-24" 
                style={{ 
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  border: '2px solid rgba(201,169,110,0.2)'
                }}
              >
                <h2 
                  className="text-lg font-semibold mb-6 pb-3"
                  style={{ 
                    color: 'var(--color-gold)',
                    borderBottom: '2px solid rgba(201,169,110,0.2)',
                    fontFamily: 'var(--font-serif)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  💰 Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-ivory-muted)' }}>Items Subtotal</span>
                    <span style={{ color: 'var(--color-ivory)' }}>{formatPrice(itemsSubtotal)}</span>
                  </div>

                  {order.depositAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#fbbf24' }}>💰 Refundable Deposit</span>
                      <span style={{ color: '#fbbf24', fontWeight: '600' }}>
                        {formatPrice(order.depositAmount)}
                      </span>
                    </div>
                  )}

                  {order.shippingCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--color-ivory-muted)' }}>Shipping Charge</span>
                      <span style={{ color: 'var(--color-ivory)' }}>{formatPrice(order.shippingCharge)}</span>
                    </div>
                  )}

                  {order.couponCode && order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1.5" style={{ color: '#22c55e' }}>
                        <Tag size={12} />
                        Discount ({order.couponCode})
                      </span>
                      <span style={{ color: '#22c55e', fontWeight: '600' }}>
                        − {formatPrice(order.discountAmount)}
                      </span>
                    </div>
                  )}

                  <div 
                    className="flex justify-between items-baseline pt-4 mt-4"
                    style={{ borderTop: '2px solid rgba(201,169,110,0.2)' }}
                  >
                    <span className="text-base font-semibold" style={{ color: 'var(--color-gold)' }}>
                      Total Paid
                    </span>
                    <span 
                      className="text-2xl font-bold" 
                      style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
                    >
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* What Happens Next */}
                <div 
                  className="mt-6 p-4 rounded-lg"
                  style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}
                >
                  <h3 className="text-xs font-semibold mb-3" style={{ color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    ⏱️ What Happens Next?
                  </h3>
                  <ol className="space-y-2 text-xs" style={{ color: 'var(--color-ivory-muted)', lineHeight: '1.6' }}>
                    <li>📋 <strong style={{ color: 'var(--color-ivory)' }}>Order Processing:</strong> We prepare your items</li>
                    <li>📦 <strong style={{ color: 'var(--color-ivory)' }}>Quality Check:</strong> Ensuring perfection</li>
                    <li>🚚 <strong style={{ color: 'var(--color-ivory)' }}>Dispatch:</strong> Track your order</li>
                  </ol>
                </div>

                <div className="mt-6">
                  <Button to="/shop" variant="primary" className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
