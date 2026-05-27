import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Trash2, ShoppingBag, ArrowRight, CalendarRange, Edit3, Shield, Truck,
} from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import ProductImage from '@/components/ui/ProductImage'
import useStore from '@/store/useStore'
import { formatPrice, formatDate, productUrl } from '@/utils/helpers'

/**
 * Calculate aggregate rental totals across cart items.
 * Sums rent (cart line price × qty) and refundable deposits separately so the
 * order summary mirrors the server's enriched cart payload.
 */
function calculateTotals(cart) {
  let rentSubtotal = 0
  let depositTotal = 0
  cart.forEach((item) => {
    const lineRent = (item.price || 0) * item.quantity
    rentSubtotal += lineRent
    const deposit = item.rental?.deposit ?? 0
    depositTotal += deposit * item.quantity
  })
  return { rentSubtotal, depositTotal }
}

export default function Cart() {
  const { cart, removeFromCart } = useStore()
  const { rentSubtotal, depositTotal } = calculateTotals(cart)
  const shipping = rentSubtotal > 50000 ? 0 : 0 // Rentals: complimentary doorstep delivery
  const total = rentSubtotal + depositTotal + shipping

  return (
    <>
      <SEO
        title="Shopping Bag"
        description="Review your reserved pieces and rental dates before checkout."
      />

      <section
        className="page-header min-h-screen"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury">
          <div className="text-center mb-12">
            <p className="label-text mb-3" style={{ color: 'var(--color-gold)' }}>
              Your Reservations
            </p>
            <SplitText
              className="heading-xl"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Shopping Bag
            </SplitText>
          </div>

          {cart.length === 0 ? (
            <div className="text-center pt-20 pb-20">
              <ShoppingBag
                size={48}
                className="ml-auto mr-auto mb-6"
                style={{ color: 'rgba(201, 169, 110, 0.3)' }}
              />
              <p
                className="heading-sm mb-3"
                style={{ color: 'var(--color-ivory)' }}
              >
                Your bag is empty
              </p>
              <p className="body-sm mb-8" style={{ color: 'var(--color-ivory-muted)' }}>
                Discover our heritage atelier and reserve a piece for your next occasion.
              </p>
              <Button to="/shop" variant="primary" id="cart-shop-cta">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
              {/* Items */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                <AnimatePresence>
                  {cart.map((item) => {
                    const url = productUrl(item)
                    const rental = item.rental || {}
                    const days = rental.days
                    const startDate = rental.startDate
                    const endDate = rental.endDate
                    const deposit = rental.deposit ?? 0
                    const lineRent = item.price * item.quantity
                    const lineDeposit = deposit * item.quantity
                    const linePayable = lineRent + lineDeposit
                    const isRental = days != null

                    return (
                      <motion.article
                        key={item.id}
                        className="rounded-2xl overflow-hidden"
                        style={{
                          background: 'var(--color-charcoal)',
                          border: '1px solid rgba(201, 169, 110, 0.1)',
                        }}
                        layout
                        exit={{ opacity: 0, x: -50 }}
                      >
                        <div className="flex flex-col sm:flex-row gap-5 p-5">
                          {/* Image */}
                          <Link
                            to={url}
                            className="block w-full sm:w-32 h-40 sm:h-40 rounded-xl overflow-hidden shrink-0"
                            style={{ background: 'var(--color-slate)' }}
                            aria-label={`View ${item.name}`}
                          >
                            <ProductImage
                              src={item.images?.[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </Link>

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex justify-between items-start gap-3">
                              <div className="min-w-0">
                                {item.code && (
                                  <p
                                    className="text-[10px] tracking-[0.18em] uppercase mb-1"
                                    style={{ color: 'var(--color-gold)' }}
                                  >
                                    {item.code}
                                  </p>
                                )}
                                <Link
                                  to={url}
                                  className="text-lg font-medium hover:text-gold transition-colors block truncate"
                                  style={{
                                    fontFamily: 'var(--font-serif)',
                                    color: 'var(--color-ivory)',
                                  }}
                                >
                                  {item.name}
                                </Link>
                                {item.collection && (
                                  <p
                                    className="text-xs mt-1"
                                    style={{ color: 'var(--color-ivory-muted)' }}
                                  >
                                    {item.collection}
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 rounded-full transition-colors hover:text-gold cursor-pointer shrink-0"
                                style={{ color: 'var(--color-ivory-muted)' }}
                                aria-label="Remove item"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Rental booking details */}
                            {isRental && (
                              <div
                                className="mt-3 rounded-xl p-3.5"
                                style={{
                                  background: 'rgba(201, 169, 110, 0.06)',
                                  border: '1px solid rgba(201, 169, 110, 0.15)',
                                }}
                              >
                                <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                                  <div
                                    className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase"
                                    style={{ color: 'var(--color-gold)' }}
                                  >
                                    <CalendarRange size={13} strokeWidth={1.6} />
                                    Rental Booking · {days} {days === 1 ? 'Day' : 'Days'}
                                  </div>
                                  <Link
                                    to={url}
                                    className="inline-flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-gold"
                                    style={{ color: 'var(--color-ivory-muted)' }}
                                  >
                                    <Edit3 size={11} strokeWidth={1.6} />
                                    Edit dates
                                  </Link>
                                </div>
                                {(startDate || endDate) && (
                                  <div
                                    className="grid grid-cols-2 gap-3 text-[12px]"
                                    style={{ color: 'var(--color-ivory)' }}
                                  >
                                    <div>
                                      <p
                                        className="text-[10px] tracking-[0.15em] uppercase mb-0.5"
                                        style={{ color: 'var(--color-ivory-muted)' }}
                                      >
                                        Pickup
                                      </p>
                                      <p>{startDate ? formatDate(startDate) : '—'}</p>
                                    </div>
                                    <div>
                                      <p
                                        className="text-[10px] tracking-[0.15em] uppercase mb-0.5"
                                        style={{ color: 'var(--color-ivory-muted)' }}
                                      >
                                        Return
                                      </p>
                                      <p>{endDate ? formatDate(endDate) : '—'}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Pricing breakdown */}
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[12.5px]">
                              <div className="flex justify-between">
                                <span style={{ color: 'var(--color-ivory-muted)' }}>
                                  Rent {item.quantity > 1 && `× ${item.quantity}`}
                                </span>
                                <span style={{ color: 'var(--color-ivory)' }}>
                                  {formatPrice(lineRent)}
                                </span>
                              </div>
                              {isRental && deposit > 0 && (
                                <div className="flex justify-between">
                                  <span style={{ color: 'var(--color-ivory-muted)' }}>
                                    Deposit {item.quantity > 1 && `× ${item.quantity}`}
                                  </span>
                                  <span style={{ color: 'var(--color-ivory)' }}>
                                    {formatPrice(lineDeposit)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Line payable */}
                            <div
                              className="flex items-center justify-between mt-3 pt-3"
                              style={{
                                borderTop: '1px dashed rgba(201, 169, 110, 0.18)',
                              }}
                            >
                              <span
                                className="text-[11px] tracking-[0.18em] uppercase"
                                style={{ color: 'var(--color-ivory-muted)' }}
                              >
                                Line Payable
                              </span>
                              <span
                                className="text-lg font-semibold"
                                style={{
                                  fontFamily: 'var(--font-serif)',
                                  color: 'var(--color-gold)',
                                }}
                              >
                                {formatPrice(linePayable)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>

                {/* Continue shopping */}
                <Link
                  to="/shop"
                  className="self-start text-xs tracking-[0.15em] uppercase transition-colors hover:text-gold pt-2"
                  style={{
                    color: 'var(--color-ivory-muted)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Summary */}
              <aside className="lg:col-span-1">
                <div className="glass-gold rounded-2xl p-7 sticky top-32">
                  <h3
                    className="heading-sm mb-6"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-ivory)',
                    }}
                  >
                    Order Summary
                  </h3>

                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between body-sm">
                      <span style={{ color: 'var(--color-ivory-muted)' }}>
                        Rent Subtotal
                      </span>
                      <span style={{ color: 'var(--color-ivory)' }}>
                        {formatPrice(rentSubtotal)}
                      </span>
                    </div>
                    {depositTotal > 0 && (
                      <div className="flex justify-between body-sm">
                        <span
                          className="inline-flex items-center gap-1"
                          style={{ color: 'var(--color-ivory-muted)' }}
                        >
                          Refundable Deposit
                        </span>
                        <span style={{ color: 'var(--color-ivory)' }}>
                          {formatPrice(depositTotal)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between body-sm">
                      <span style={{ color: 'var(--color-ivory-muted)' }}>Shipping</span>
                      <span style={{ color: 'var(--color-gold)' }}>Complimentary</span>
                    </div>

                    <div
                      className="luxury-divider"
                      style={{ opacity: 0.18, margin: '0.5rem 0' }}
                    />

                    <div className="flex justify-between items-baseline">
                      <span
                        className="text-sm font-medium tracking-[0.05em]"
                        style={{ color: 'var(--color-ivory)' }}
                      >
                        Payable Now
                      </span>
                      <span
                        className="text-2xl font-semibold"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          color: 'var(--color-gold)',
                        }}
                      >
                        {formatPrice(total)}
                      </span>
                    </div>
                    {depositTotal > 0 && (
                      <p
                        className="text-[11px]"
                        style={{ color: 'rgba(245, 240, 232, 0.5)' }}
                      >
                        Deposit refunded after safe return.
                      </p>
                    )}
                  </div>

                  <Button
                    to="/checkout"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    id="cart-checkout-cta"
                  >
                    Proceed to Checkout <ArrowRight size={14} />
                  </Button>

                  {/* Trust badges */}
                  <div className="mt-6 grid grid-cols-2 gap-3 text-[11px]">
                    <div
                      className="flex items-center gap-2 rounded-lg p-2.5"
                      style={{
                        background: 'rgba(10,10,10,0.35)',
                        border: '1px solid rgba(201,169,110,0.1)',
                        color: 'var(--color-ivory-muted)',
                      }}
                    >
                      <Shield size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                      Sanitised
                    </div>
                    <div
                      className="flex items-center gap-2 rounded-lg p-2.5"
                      style={{
                        background: 'rgba(10,10,10,0.35)',
                        border: '1px solid rgba(201,169,110,0.1)',
                        color: 'var(--color-ivory-muted)',
                      }}
                    >
                      <Truck size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                      Doorstep
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
