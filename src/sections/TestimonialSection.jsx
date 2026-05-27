import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { TESTIMONIALS } from '@/utils/constants'
import SplitText from '@/components/ui/SplitText'
import { Quote } from 'lucide-react'

export default function TestimonialSection() {
  return (
    <section
      className="relative pt-24 pb-24 lg:pt-32 lg:pb-32 overflow-hidden"
      style={{ background: 'var(--color-charcoal)' }}
      id="testimonials"
      aria-label="Customer Testimonials"
    >
      {/* Decorative gold accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-gold))' }}
      />

      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="label-text mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: 'var(--color-gold)' }}
          >
            Words of Devotion
          </motion.p>
          <SplitText
            className="heading-lg"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
          >
            Our Brides Speak
          </SplitText>
        </div>

        {/* Testimonials slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={32}
          slidesPerView={1}
          centeredSlides
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet custom-bullet',
            bulletActiveClass: 'custom-bullet-active',
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: '4rem' }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                className="glass-gold rounded-2xl p-8 lg:p-10 h-full flex flex-col"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Quote size={28} style={{ color: 'var(--color-gold)', opacity: 0.4 }} className="mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--color-gold)' }}>★</span>
                  ))}
                </div>

                <p
                  className="body-lg flex-1 mb-6"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
                    lineHeight: 1.8,
                    color: 'var(--color-ivory)',
                  }}
                >
                  "{testimonial.text}"
                </p>

                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                  >
                    {testimonial.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}>
                    {testimonial.location}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom pagination styles */}
      <style>{`
        .custom-bullet {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(201, 169, 110, 0.3);
          display: inline-block; margin: 0 5px; cursor: pointer;
          transition: all 0.3s ease;
        }
        .custom-bullet-active {
          background: var(--color-gold) !important;
          width: 24px; border-radius: 4px;
        }
      `}</style>
    </section>
  )
}
