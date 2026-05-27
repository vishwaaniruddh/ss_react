import { motion } from 'framer-motion'
import { useState } from 'react'
import { CreditCard, Truck, CheckCircle, Lock } from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import useStore from '@/store/useStore'
import { formatPrice } from '@/utils/helpers'

const steps = ['Shipping', 'Payment', 'Confirmation']

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(0)
  const { cart, getCartTotal } = useStore()
  const subtotal = getCartTotal()
  const shipping = subtotal > 50000 ? 0 : 999

  const inputStyle = {
    background: 'rgba(10, 10, 10, 0.4)',
    border: '1px solid rgba(201, 169, 110, 0.15)',
    color: 'var(--color-ivory)',
    fontFamily: 'var(--font-sans)',
  }

  return (
    <>
      <SEO title="Checkout" description="Complete your order with Sri Shringaar." />

      <section className="page-header min-h-screen" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury max-w-4xl">
          <SplitText className="heading-lg text-center mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
            Checkout
          </SplitText>
          <div className="flex items-center justify-center gap-1 mb-2 text-xs" style={{ color: 'var(--color-gold)' }}>
            <Lock size={12} /> Secure Checkout
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-4 mb-12 mt-8">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                    style={{
                      background: i <= currentStep ? 'var(--color-gold)' : 'transparent',
                      color: i <= currentStep ? 'var(--color-obsidian)' : 'var(--color-ivory-muted)',
                      border: `1px solid ${i <= currentStep ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.2)'}`,
                    }}
                  >
                    {i < currentStep ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className="text-xs tracking-[0.08em] uppercase hidden sm:inline" style={{ color: i <= currentStep ? 'var(--color-gold)' : 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}>
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && <div className="w-12 h-px" style={{ background: i < currentStep ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.15)' }} />}
              </div>
            ))}
          </div>

          {/* Step content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-gold rounded-2xl p-8 lg:p-10"
          >
            {currentStep === 0 && (
              <div>
                <h3 className="heading-sm mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                  <Truck size={20} className="inline mr-2" style={{ color: 'var(--color-gold)' }} /> Shipping Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {['First Name', 'Last Name', 'Email', 'Phone', 'Address Line 1', 'Address Line 2', 'City', 'State', 'PIN Code', 'Country'].map((field) => (
                    <div key={field} className={field.includes('Address') ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs tracking-[0.1em] uppercase mb-2" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}>{field}</label>
                      <input className="w-full pl-4 pr-4 pt-3 pb-3 rounded-lg text-sm outline-none" style={inputStyle} id={`checkout-${field.toLowerCase().replace(/\s/g, '-')}`} />
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button variant="primary" size="lg" onClick={() => setCurrentStep(1)} id="checkout-continue-payment">Continue to Payment</Button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h3 className="heading-sm mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                  <CreditCard size={20} className="inline mr-2" style={{ color: 'var(--color-gold)' }} /> Payment Method
                </h3>
                <div className="space-y-5 mb-8">
                  {['Card Number', 'Cardholder Name'].map((field) => (
                    <div key={field}>
                      <label className="block text-xs tracking-[0.1em] uppercase mb-2" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}>{field}</label>
                      <input className="w-full pl-4 pr-4 pt-3 pb-3 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-5">
                    {['Expiry Date', 'CVV'].map((field) => (
                      <div key={field}>
                        <label className="block text-xs tracking-[0.1em] uppercase mb-2" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}>{field}</label>
                        <input className="w-full pl-4 pr-4 pt-3 pb-3 rounded-lg text-sm outline-none" style={inputStyle} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="luxury-divider mb-6" style={{ opacity: 0.15 }} />
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm" style={{ color: 'var(--color-ivory-muted)' }}>Total</span>
                  <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>{formatPrice(subtotal + shipping)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(0)}>Back</Button>
                  <Button variant="primary" size="lg" onClick={() => setCurrentStep(2)} id="checkout-place-order">Place Order</Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center pt-12 pb-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <CheckCircle size={64} className="ml-auto mr-auto mb-6" style={{ color: 'var(--color-gold)' }} />
                </motion.div>
                <h3 className="heading-md mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>Thank You for Your Order</h3>
                <p className="body-lg max-w-md ml-auto mr-auto mb-8" style={{ color: 'var(--color-ivory-muted)' }}>Your order has been placed successfully. We'll send you a confirmation email shortly.</p>
                <Button to="/" variant="primary" size="lg" id="checkout-continue-shopping">Continue Shopping</Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
