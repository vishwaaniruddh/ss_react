import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/pagination'
import testimonials from '@/data/testimonials.json'
import SplitText from '@/components/ui/SplitText'
import { ArrowRight } from 'lucide-react'

export default function TestimonialSection() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: 'var(--color-obsidian)' }}
      id="testimonials"
      aria-label="Customer Testimonials"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-gold) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top decorative line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }}
      />

      <div className="container-luxury relative">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            className="label-text mb-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ color: 'var(--color-gold)' }}
          >
            Client Love
          </motion.p>
          <SplitText
            className="heading-lg"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
          >
            Hear From Our Brides
          </SplitText>
          <motion.div
            className="w-12 h-px mx-auto mt-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ background: 'var(--color-gold)' }}
          />
        </div>

        {/* Testimonials slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet testimonial-bullet',
            bulletActiveClass: 'testimonial-bullet-active',
          }}
          breakpoints={{
            640: { slidesPerView: 1.5, centeredSlides: true },
            1024: { slidesPerView: 2.5, centeredSlides: true },
            1440: { slidesPerView: 3, centeredSlides: false, spaceBetween: 32 },
          }}
          style={{ paddingBottom: '3.5rem' }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                className="relative rounded-xl p-7 lg:p-8 h-full flex flex-col min-h-[280px]"
                style={{
                  background: 'linear-gradient(145deg, rgba(42, 42, 42, 0.6), rgba(26, 26, 26, 0.8))',
                  border: '1px solid rgba(201, 169, 110, 0.12)',
                  backdropFilter: 'blur(8px)',
                }}
                whileHover={{ y: -4, borderColor: 'rgba(201, 169, 110, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote mark */}
                <span
                  className="absolute top-5 right-6 text-5xl leading-none select-none"
                  style={{ fontFamily: 'Georgia, serif', color: 'rgba(201, 169, 110, 0.1)' }}
                  aria-hidden="true"
                >
                  &rdquo;
                </span>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gold)">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Feedback text */}
                <p
                  className="flex-1 mb-6"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 300,
                    fontSize: '0.925rem',
                    lineHeight: 1.75,
                    color: 'rgba(245, 240, 232, 0.85)',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {testimonial.client_feedbacks}
                </p>

                {/* Client info */}
                <div
                  className="flex items-center gap-3 pt-5"
                  style={{ borderTop: '1px solid rgba(201, 169, 110, 0.1)' }}
                >
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))',
                    }}
                  >
                    <img
                      src={testimonial.profile_pic}
                      alt={testimonial.client_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `<span style="color: var(--color-obsidian); font-weight: 600; font-size: 0.8rem; font-family: var(--font-sans);">${testimonial.client_name.charAt(0)}</span>`
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      color: 'var(--color-ivory)',
                    }}
                  >
                    {testimonial.client_name}
                  </span>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:gap-3"
            style={{
              color: 'var(--color-gold)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            View All Reviews
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Custom pagination styles */}
      <style>{`
        .testimonial-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(201, 169, 110, 0.25);
          display: inline-block;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .testimonial-bullet-active {
          background: var(--color-gold) !important;
          width: 20px;
          border-radius: 3px;
        }
      `}</style>
    </section>
  )
}
