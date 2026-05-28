import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ height: '600px' }}
      id="hero-section"
      aria-label="Hero Banner"
    >
      {/* Hero image — fetchpriority high for LCP */}
      <img
        src="/banner/banner1.webp"
        alt="Sri Shringaar bridal jewellery collection"
        fetchpriority="high"
        decoding="sync"
        width="1055"
        height="600"
        className="absolute inset-0 w-full h-full object-cover object-right"
        style={{ zIndex: 0 }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to right, rgba(10, 10, 10, 0.82) 0%, rgba(10, 10, 10, 0.55) 40%, rgba(10, 10, 10, 0.1) 70%, transparent 100%)',
        }}
      />

      {/* Content — no animation delays to avoid blocking LCP paint */}
      <div className="relative z-10 container-luxury w-full pt-24 pb-12 lg:pt-28 lg:pb-16">
        <div className="flex flex-col gap-4 max-w-md lg:max-w-lg text-center lg:text-left">
          <h1
            className="heading-md"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
          >
            Where Tradition Meets Timeless Elegance
          </h1>

          <p
            className="body-lg max-w-sm mx-auto lg:mx-0"
            style={{ color: 'var(--color-ivory-muted)' }}
          >
            Discover handcrafted bridal jewellery and couture that celebrates the sacred beauty of Indian heritage — each piece a masterwork of devotion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2">
            <Button to="/shop" variant="primary" size="lg" id="hero-cta-shop">
              Explore Collection
            </Button>
            <Button to="/bridal" variant="secondary" size="lg" id="hero-cta-bridal">
              Bridal Atelier
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
