import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Star, Quote, ExternalLink, RefreshCcw, Sparkles } from 'lucide-react'
import SEO from '@/seo/SEO'
import useGoogleReviews from '@/hooks/useGoogleReviews'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { TESTIMONIALS } from '@/utils/constants'

/**
 * ClientDiary — public reviews wall.
 *
 * Strategy:
 *   - Fetches live Google reviews from our cached PHP proxy.
 *   - Renders them in a masonry-ish responsive grid with avatar, rating,
 *     time, and the review body.
 *   - Falls back to the curated TESTIMONIALS list when Google is offline,
 *     not yet configured, or returns an empty review array. The fallback
 *     is shaped so the same card component can render either source.
 */
function ratingLabel(rating) {
  if (!rating) return '—'
  return rating.toFixed(1)
}

function StarRow({ rating, size = 14 }) {
  const filled = Math.round(rating || 0)
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating || 0} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          fill={i < filled ? 'var(--color-gold)' : 'transparent'}
          style={{
            color: i < filled ? 'var(--color-gold)' : 'rgba(201, 169, 110, 0.4)',
          }}
        />
      ))}
    </div>
  )
}

function Avatar({ name, src }) {
  const initials = (name || '?')
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
      style={{
        background: 'rgba(201, 169, 110, 0.15)',
        border: '1px solid rgba(201, 169, 110, 0.3)',
        color: 'var(--color-gold)',
        fontFamily: 'var(--font-serif)',
        fontWeight: 500,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to initials if Google image fails to load.
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <span className="text-sm">{initials}</span>
      )}
    </div>
  )
}

function ReviewCard({ review, index = 0 }) {
  return (
    <motion.article
      variants={staggerItem}
      className="rounded-2xl p-6 flex flex-col h-full relative overflow-hidden"
      style={{
        background:
          index % 3 === 0
            ? 'linear-gradient(160deg, rgba(201,169,110,0.08), rgba(10,10,10,0.6))'
            : 'rgba(26,26,26,0.7)',
        border: '1px solid rgba(201, 169, 110, 0.12)',
      }}
    >
      <Quote
        size={26}
        strokeWidth={1}
        className="absolute top-5 right-5 opacity-40"
        style={{ color: 'var(--color-gold)' }}
      />

      <div className="flex items-center gap-3 mb-4">
        <Avatar name={review.author_name} src={review.profile_photo_url} />
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{
              color: 'var(--color-ivory)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {review.author_name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRow rating={review.rating} size={11} />
            {review.relative_time_description && (
              <span
                className="text-[10px] tracking-[0.05em]"
                style={{ color: 'rgba(245, 240, 232, 0.5)' }}
              >
                · {review.relative_time_description}
              </span>
            )}
          </div>
        </div>
      </div>

      <p
        className="body-sm flex-1"
        style={{
          color: 'var(--color-ivory-muted)',
          lineHeight: 1.65,
        }}
      >
        {review.text}
      </p>

      {review.translated && (
        <p
          className="mt-3 text-[10px] tracking-[0.15em] uppercase"
          style={{ color: 'rgba(201, 169, 110, 0.4)' }}
        >
          Translated
        </p>
      )}
    </motion.article>
  )
}

function HeaderSummary({ data, isLoading, fallbackCount }) {
  const rating = data?.rating
  const total = data?.total_ratings
  const showLive = !!rating && total > 0

  return (
    <motion.div
      className="flex flex-col items-center text-center mb-12"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p
        className="text-[11px] tracking-[0.3em] uppercase mb-3"
        style={{ color: 'var(--color-gold)' }}
      >
        Voices of Our Patrons
      </p>
      <h1
        className="text-4xl md:text-5xl mb-3"
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--color-ivory)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}
      >
        Client Diary
      </h1>
      <p
        className="body-sm max-w-xl mb-6"
        style={{ color: 'var(--color-ivory-muted)' }}
      >
        Heartfelt notes from the brides, mothers, and patrons who have entrusted us
        with their most precious moments.
      </p>

      <div
        className="inline-flex items-center gap-3 rounded-full pl-4 pr-5 py-2"
        style={{
          background: 'rgba(201, 169, 110, 0.08)',
          border: '1px solid rgba(201, 169, 110, 0.25)',
        }}
      >
        <Sparkles size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
        <StarRow rating={showLive ? rating : 5} size={13} />
        <span
          className="text-xs"
          style={{ color: 'var(--color-ivory)', fontFamily: 'var(--font-sans)' }}
        >
          {showLive ? (
            <>
              <strong style={{ color: 'var(--color-gold)' }}>{ratingLabel(rating)}</strong>
              <span style={{ color: 'var(--color-ivory-muted)' }}> · {total}+ Google reviews</span>
            </>
          ) : isLoading ? (
            <span style={{ color: 'var(--color-ivory-muted)' }}>Fetching reviews…</span>
          ) : (
            <span style={{ color: 'var(--color-ivory-muted)' }}>{fallbackCount} curated stories</span>
          )}
        </span>
      </div>

      {data?.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-5 text-[11px] tracking-[0.18em] uppercase transition-colors hover:text-gold"
          style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
        >
          Read all reviews on Google <ExternalLink size={11} />
        </a>
      )}
    </motion.div>
  )
}

export default function ClientDiary() {
  const { reviews: liveReviews, data, isLoading, error, refetch } = useGoogleReviews()

  // Convert curated TESTIMONIALS into the same shape as live reviews so the
  // card component renders either source identically.
  const fallbackReviews = useMemo(
    () =>
      TESTIMONIALS.map((t) => ({
        author_name: t.name,
        profile_photo_url: null,
        rating: t.rating,
        relative_time_description: t.location,
        time: 0,
        text: t.text,
        language: 'en',
      })),
    [],
  )

  const reviews = liveReviews.length > 0 ? liveReviews : fallbackReviews
  const isFallback = liveReviews.length === 0

  return (
    <>
      <SEO
        title="Client Diary"
        description="Stories and reviews from the brides, families, and patrons of Sri Shringarr Fashion Studio."
      />

      <section
        className="pt-24 lg:pt-28 pb-20"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury">
          <HeaderSummary
            data={data}
            isLoading={isLoading}
            fallbackCount={fallbackReviews.length}
          />

          {isLoading && reviews.length === 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              aria-busy="true"
              aria-live="polite"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <ReviewSkeleton key={i} />
              ))}
            </div>
          )}

          {error && reviews.length === 0 && (
            <div className="text-center pt-12 pb-12">
              <p className="heading-sm mb-3" style={{ color: 'var(--color-ivory)' }}>
                Couldn't load reviews
              </p>
              <p className="body-sm mb-6" style={{ color: 'var(--color-ivory-muted)' }}>
                {error.message}
              </p>
              <button
                type="button"
                onClick={refetch}
                className="inline-flex items-center gap-2 pl-5 pr-5 py-2 rounded-full text-xs tracking-[0.18em] uppercase cursor-pointer transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-sans)',
                  background: 'var(--color-gold)',
                  color: 'var(--color-obsidian)',
                }}
              >
                <RefreshCcw size={12} /> Retry
              </button>
            </div>
          )}

          {reviews.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {reviews.map((review, i) => (
                <ReviewCard
                  key={`${review.author_name}-${review.time}-${i}`}
                  review={review}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {isFallback && reviews.length > 0 && !isLoading && (
            <p
              className="text-center mt-12 text-[10px] tracking-[0.25em] uppercase"
              style={{ color: 'rgba(245, 240, 232, 0.35)' }}
            >
              ✦ Curated stories from our atelier ✦
            </p>
          )}
        </div>
      </section>
    </>
  )
}

function ReviewSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl p-6 flex flex-col gap-3"
      style={{
        background: 'rgba(26,26,26,0.7)',
        border: '1px solid rgba(201, 169, 110, 0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full"
          style={{ background: 'rgba(201, 169, 110, 0.08)' }}
        />
        <div className="flex-1">
          <div
            className="h-3 rounded w-1/2 mb-2"
            style={{ background: 'rgba(201, 169, 110, 0.08)' }}
          />
          <div
            className="h-2 rounded w-1/3"
            style={{ background: 'rgba(201, 169, 110, 0.06)' }}
          />
        </div>
      </div>
      <div className="h-2 rounded w-full" style={{ background: 'rgba(201, 169, 110, 0.06)' }} />
      <div className="h-2 rounded w-11/12" style={{ background: 'rgba(201, 169, 110, 0.06)' }} />
      <div className="h-2 rounded w-9/12" style={{ background: 'rgba(201, 169, 110, 0.06)' }} />
      <div className="h-2 rounded w-10/12" style={{ background: 'rgba(201, 169, 110, 0.06)' }} />
    </div>
  )
}
