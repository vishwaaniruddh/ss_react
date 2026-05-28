import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { COLLECTIONS } from '@/utils/constants'
import SplitText from '@/components/ui/SplitText'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { ArrowUpRight } from 'lucide-react'
import heroNecklace from '@/assets/images/hero-necklace.webp'
import collectionTemple from '@/assets/images/collection-temple.webp'
import productChoker from '@/assets/images/product-choker.webp'
import bridalHero from '@/assets/images/bridal-hero.webp'

const collectionImages = [heroNecklace, collectionTemple, productChoker, bridalHero]

export default function CollectionsGrid() {
  return (
    <section
      className="relative pt-24 pb-24 lg:pt-32 lg:pb-32"
      style={{ background: 'var(--color-obsidian)' }}
      id="collections-grid"
      aria-label="Our Collections"
    >
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
            Explore Our World
          </motion.p>
          <SplitText
            className="heading-lg"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
          >
            The Collections
          </SplitText>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
        >
          {COLLECTIONS.map((collection, index) => (
            <motion.div key={collection.id} variants={staggerItem}>
              <Link
                to={collection.path}
                className="group relative block overflow-hidden rounded-2xl aspect-[16/9]"
                id={`collection-${collection.id}`}
              >
                <img
                  src={collectionImages[index % collectionImages.length]}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-8 transition-all duration-500 group-hover:bg-black/20"
                  style={{
                    background: 'linear-gradient(transparent 30%, rgba(10, 10, 10, 0.85))',
                  }}
                >
                  <div className="flex justify-between items-end transition-transform duration-500 group-hover:-translate-y-1">
                    <div>
                      <p className="label-text mb-2" style={{ color: 'var(--color-gold)' }}>
                        {collection.productCount} Pieces
                      </p>
                      <h3
                        className="text-xl lg:text-2xl font-medium mb-1"
                        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
                      >
                        {collection.name}
                      </h3>
                      <p className="body-sm max-w-sm hidden sm:block" style={{ color: 'var(--color-ivory-muted)' }}>
                        {collection.description}
                      </p>
                    </div>

                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 border border-gold/40 text-gold group-hover:bg-gold group-hover:text-obsidian group-hover:scale-110 group-hover:border-gold"
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
