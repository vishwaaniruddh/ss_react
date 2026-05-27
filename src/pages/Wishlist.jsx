import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Trash2, CalendarRange, ArrowRight } from 'lucide-react'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import ProductImage from '@/components/ui/ProductImage'
import useStore from '@/store/useStore'
import { formatPrice, productUrl } from '@/utils/helpers'
import { staggerContainer, staggerItem } from '@/animations/variants'

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useStore()

  return (
    <>
      <SEO
        title="Wishlist"
        description="Your curated collection of pieces saved for upcoming occasions."
      />

      <section
        className="page-header min-h-screen"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury">
          <div className="text-center mb-12">
            <p className="label-text mb-3" style={{ color: 'var(--color-gold)' }}>
              The Atelier
            </p>
            <SplitText
              className="heading-xl mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              Your Wishlist
            </SplitText>
            <p className="body-lg" style={{ color: 'var(--color-ivory-muted)' }}>
              {wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'} saved
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center pt-20 pb-20">
              <Heart
                size={48}
                className="ml-auto mr-auto mb-6"
                style={{ color: 'rgba(201, 169, 110, 0.3)' }}
              />
              <p
                className="heading-sm mb-3"
                style={{ color: 'var(--color-ivory)' }}
              >
                Your wishlist is empty
              </p>
              <p className="body-sm mb-8" style={{ color: 'var(--color-ivory-muted)' }}>
                Save the pieces you love. We'll keep them waiting for your moment.
              </p>
              <Button to="/shop" variant="primary" id="wishlist-shop-cta">
                Explore Collection
              </Button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence>
                {wishlist.map((product) => {
                  const url = productUrl(product)
                  const displayPrice =
                    product.rentPrice ?? product.price ?? product.mrp ?? 0
                  return (
                    <motion.div
                      key={product.id}
                      variants={staggerItem}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <div
                        className="group relative overflow-hidden rounded-xl flex flex-col h-full"
                        style={{
                          background: 'var(--color-charcoal)',
                          border: '1px solid rgba(201, 169, 110, 0.08)',
                        }}
                      >
                        <Link
                          to={url}
                          className="block aspect-[3/4] relative overflow-hidden"
                          aria-label={`View ${product.name}`}
                        >
                          <ProductImage
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          {/* Remove button — top-right, persistent */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleWishlist(product)
                            }}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105"
                            style={{
                              background: 'rgba(10, 10, 10, 0.55)',
                              backdropFilter: 'blur(8px)',
                              color: 'var(--color-ivory)',
                              border: '1px solid rgba(201, 169, 110, 0.25)',
                            }}
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </Link>

                        <div className="p-5 flex-1 flex flex-col">
                          {product.collection && (
                            <p
                              className="label-text mb-1"
                              style={{ fontSize: '0.6rem' }}
                            >
                              {product.collection}
                            </p>
                          )}
                          <Link
                            to={url}
                            className="text-base font-medium mb-2 hover:text-gold transition-colors"
                            style={{
                              fontFamily: 'var(--font-serif)',
                              color: 'var(--color-ivory)',
                            }}
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-baseline gap-2 mb-5">
                            <span
                              className="text-base font-semibold"
                              style={{
                                fontFamily: 'var(--font-serif)',
                                color: 'var(--color-gold)',
                              }}
                            >
                              {formatPrice(displayPrice)}
                            </span>
                            <span
                              className="text-[11px] tracking-[0.05em]"
                              style={{ color: 'var(--color-ivory-muted)' }}
                            >
                              / 3 days
                            </span>
                          </div>

                          <div className="mt-auto">
                            <Link
                              to={url}
                              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-0.5 shadow-md hover:shadow-gold/20"
                              style={{
                                background:
                                  'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                color: 'var(--color-obsidian)',
                                fontFamily: 'var(--font-sans)',
                              }}
                              id={`wishlist-book-${product.id}`}
                            >
                              <CalendarRange size={14} strokeWidth={1.7} />
                              Select Dates
                              <ArrowRight size={13} strokeWidth={1.7} />
                            </Link>
                            <p
                              className="text-[10px] tracking-[0.1em] uppercase text-center mt-2"
                              style={{ color: 'rgba(245, 240, 232, 0.4)' }}
                            >
                              Choose rental dates on the product page
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
