import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import SplitText from '@/components/ui/SplitText'
import useInstagramFeed from '@/hooks/useInstagramFeed'

const InstagramIcon = ({ size = 14 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

function PostCard({ post, index }) {
  // If we have a real thumbnail, render it as a static tile linking to the
  // permalink. Embeds break too easily, and a clean tile that always loads
  // looks far better than three "post not found" iframes.
  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-2xl block"
      style={{
        aspectRatio: '1 / 1',
        background:
          'linear-gradient(135deg, var(--color-charcoal), rgba(201,169,110,0.08))',
        border: '1px solid rgba(201, 169, 110, 0.15)',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt={post.caption || 'Instagram post'}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // CDN-signed Instagram thumbnails expire — hide the broken image
            // so the gradient placeholder shows through with the icon below.
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : null}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.85))',
          opacity: post.thumbnail ? 0 : 1,
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{
            background: 'rgba(201, 169, 110, 0.18)',
            border: '1px solid rgba(201, 169, 110, 0.4)',
            color: 'var(--color-gold)',
          }}
        >
          <InstagramIcon size={22} />
        </div>
        {!post.thumbnail && (
          <span
            className="text-[11px] tracking-[0.18em] uppercase"
            style={{ color: 'var(--color-ivory-muted)' }}
          >
            View on Instagram
          </span>
        )}
      </div>

      {/* Persistent caption hover */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.9))',
        }}
      >
        <p
          className="text-[12px] line-clamp-3 mb-2"
          style={{ color: 'var(--color-ivory)', lineHeight: 1.5 }}
        >
          {post.caption || 'View post'}
        </p>
        <span
          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'var(--color-gold)' }}
        >
          <InstagramIcon size={11} /> Open
        </span>
      </div>

      {/* Always-visible Instagram pill in the corner */}
      <div
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center pointer-events-none"
        style={{
          background: 'rgba(10,10,10,0.55)',
          backdropFilter: 'blur(6px)',
          color: 'var(--color-gold)',
          border: '1px solid rgba(201, 169, 110, 0.3)',
        }}
      >
        <InstagramIcon size={12} />
      </div>
    </motion.a>
  )
}

function PostSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl"
      style={{
        aspectRatio: '1 / 1',
        background: 'rgba(201, 169, 110, 0.06)',
        border: '1px solid rgba(201, 169, 110, 0.1)',
      }}
    />
  )
}

export default function VideoSection() {
  const { posts, profileUrl, isLoading, error } = useInstagramFeed()

  // Cap at 6 tiles for a clean 3-up grid. If the feed has fewer, the grid
  // collapses gracefully thanks to CSS auto-fill.
  const displayPosts = posts.slice(0, 6)

  return (
    <section
      className="relative pt-20 pb-20 lg:pt-24 lg:pb-24 overflow-hidden"
      style={{ background: 'var(--color-obsidian)' }}
      id="video-section"
      aria-label="Reels from our atelier"
    >
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div>
            <motion.p
              className="label-text mb-3 inline-flex items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: 'var(--color-gold)' }}
            >
              <InstagramIcon size={14} />
              @flyrobe_srishringarr
            </motion.p>
            <SplitText
              className="heading-lg"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
            >
              From Our Atelier
            </SplitText>
            <motion.p
              className="body-sm mt-3 max-w-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: 'var(--color-ivory-muted)' }}
            >
              Recent looks straight from the studio — bridal couture, designer lehengas, and statement
              jewellery, all available on rent.
            </motion.p>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 pl-5 pr-5 pt-2.5 pb-2.5 rounded-full text-[11px] tracking-[0.22em] uppercase font-semibold transition-all duration-500 cursor-pointer hover:-translate-y-0.5"
            style={{
              fontFamily: 'var(--font-sans)',
              background: 'transparent',
              color: 'var(--color-ivory)',
              border: '1px solid rgba(201, 169, 110, 0.4)',
            }}
            id="instagram-follow-cta"
          >
            Follow on Instagram <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : displayPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayPosts.map((post, i) => (
              <PostCard key={post.shortcode} post={post} index={i} />
            ))}
          </div>
        ) : (
          <FollowFallback profileUrl={profileUrl} hasError={Boolean(error)} />
        )}
      </div>
    </section>
  )
}

/**
 * Last-resort tile when no posts can be fetched. Big "Follow us" panel that
 * still feels intentional — looks like a curated CTA, not a broken state.
 */
function FollowFallback({ profileUrl, hasError }) {
  return (
    <motion.a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-2xl block flex items-center justify-center"
      style={{
        aspectRatio: '21 / 9',
        background:
          'linear-gradient(135deg, var(--color-charcoal), rgba(201,169,110,0.12))',
        border: '1px solid rgba(201, 169, 110, 0.2)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center max-w-md p-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: 'rgba(201, 169, 110, 0.15)',
            border: '1px solid rgba(201, 169, 110, 0.4)',
            color: 'var(--color-gold)',
          }}
        >
          <InstagramIcon size={26} />
        </div>
        <h3
          className="text-xl mb-3"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
        >
          Follow @flyrobe_srishringarr
        </h3>
        <p className="body-sm mb-5" style={{ color: 'var(--color-ivory-muted)' }}>
          {hasError
            ? 'Catch our latest reels and looks live on Instagram.'
            : 'Discover bridal couture, designer lehengas, and jewellery as soon as they arrive in the studio.'}
        </p>
        <span
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-semibold"
          style={{ color: 'var(--color-gold)' }}
        >
          Visit Profile <ArrowUpRight size={13} />
        </span>
      </div>
    </motion.a>
  )
}
