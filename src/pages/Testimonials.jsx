import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import testimonials from '@/data/testimonials.json'
import { Quote, X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Testimonials() {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <>
      <SEO
        title="Client Testimonials — Sri Shringaar"
        description="Read what our happy clients have to say about their experience with Sri Shringaar. Real reviews from real brides and customers."
      />

      {/* Hero */}
      <section
        className="relative pt-32 pb-16 lg:pt-40 lg:pb-20"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury text-center">
          <motion.p
            className="label-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ color: 'var(--color-gold)' }}
          >
            Real Stories, Real Smiles
          </motion.p>
          <SplitText
            className="heading-xl mb-6"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
          >
            What Our Clients Say
          </SplitText>
          <motion.p
            className="body-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ color: 'rgba(245, 241, 234, 0.7)' }}
          >
            Every piece we create carries a story. Here are some of the beautiful moments
            shared by our cherished clients.
          </motion.p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section
        className="py-16 lg:py-24"
        style={{ background: 'var(--color-charcoal)' }}
      >
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="glass-gold rounded-2xl p-8 flex flex-col cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedTestimonial(testimonial)}
              >
                <Quote size={24} style={{ color: 'var(--color-gold)', opacity: 0.4 }} className="mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--color-gold)' }}>★</span>
                  ))}
                </div>

                {/* Feedback */}
                <p
                  className="flex-1 mb-6"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                    lineHeight: 1.8,
                    color: 'var(--color-ivory)',
                    display: '-webkit-box',
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  &ldquo;{testimonial.client_feedbacks}&rdquo;
                </p>

                {/* Client info */}
                <div className="flex items-center gap-3 mt-auto pt-4" style={{ borderTop: '1px solid rgba(201, 169, 110, 0.15)' }}>
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: '2px solid var(--color-gold)' }}
                  >
                    <img
                      src={testimonial.profile_pic}
                      alt={testimonial.client_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center" style="background: var(--color-gold); color: var(--color-charcoal); font-weight: 600; font-size: 1rem;">${testimonial.client_name.charAt(0)}</div>`
                      }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                    >
                      {testimonial.client_name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
                    >
                      Verified Client
                    </p>
                  </div>
                </div>

                {/* Photos indicator */}
                {testimonial.client_photos_with_products?.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {testimonial.client_photos_with_products.slice(0, 3).map((photo, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-lg overflow-hidden opacity-70"
                        style={{ border: '1px solid rgba(201, 169, 110, 0.3)' }}
                      >
                        <img
                          src={photo}
                          alt={`${testimonial.client_name} photo ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.parentElement.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                    {testimonial.client_photos_with_products.length > 3 && (
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xs"
                        style={{ background: 'rgba(201, 169, 110, 0.1)', color: 'var(--color-gold)' }}
                      >
                        +{testimonial.client_photos_with_products.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(0, 0, 0, 0.85)' }}
              onClick={() => setSelectedTestimonial(null)}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-8 lg:p-10"
              style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(201, 169, 110, 0.2)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                style={{ color: 'var(--color-ivory)', background: 'rgba(201, 169, 110, 0.1)' }}
                aria-label="Close testimonial"
              >
                <X size={20} />
              </button>

              {/* Client info */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                  style={{ border: '2px solid var(--color-gold)' }}
                >
                  <img
                    src={selectedTestimonial.profile_pic}
                    alt={selectedTestimonial.client_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center" style="background: var(--color-gold); color: var(--color-charcoal); font-weight: 700; font-size: 1.25rem;">${selectedTestimonial.client_name.charAt(0)}</div>`
                    }}
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-medium"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                  >
                    {selectedTestimonial.client_name}
                  </h3>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: 'var(--color-gold)', fontSize: '0.875rem' }}>★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full feedback */}
              <p
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  color: 'var(--color-ivory)',
                }}
              >
                &ldquo;{selectedTestimonial.client_feedbacks}&rdquo;
              </p>

              {/* Client photos */}
              {selectedTestimonial.client_photos_with_products?.length > 0 && (
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-3"
                    style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
                  >
                    Client Photos
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedTestimonial.client_photos_with_products.map((photo, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ border: '1px solid rgba(201, 169, 110, 0.2)' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setLightboxImage(photo)
                        }}
                      >
                        <img
                          src={photo}
                          alt={`${selectedTestimonial.client_name} with product ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.parentElement.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for photos */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <div className="absolute inset-0 bg-black/95" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full z-10"
              style={{ color: 'var(--color-ivory)', background: 'rgba(255,255,255,0.1)' }}
              aria-label="Close image"
            >
              <X size={24} />
            </button>
            <motion.img
              src={lightboxImage}
              alt="Client photo"
              className="relative max-w-full max-h-[85vh] object-contain rounded-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
