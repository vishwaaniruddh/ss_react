import { Helmet } from 'react-helmet-async'

const SITE_ORIGIN = 'https://srishringaar.com'

export default function SEO({
  title = 'Sri Shringaar',
  description = 'Discover exquisite handcrafted Indian bridal jewellery and heritage apparels. Timeless elegance for your most precious moments.',
  keywords = 'Indian jewellery, bridal jewellery, wedding jewellery, gold jewellery, bridal lehenga, heritage craftsmanship',
  image = '/og-image.jpg',
  url = '',
  canonical = '',
  type = 'website',
  schema = null,
}) {
  const siteName = 'Sri Shringaar'
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`

  // Resolve canonical URL: explicit prop wins, else fall back to og:url, else current pathname.
  const resolvedCanonical = canonical
    || url
    || (typeof window !== 'undefined' ? `${SITE_ORIGIN}${window.location.pathname}` : '')

  const ogImage = image?.startsWith('http') ? image : `${SITE_ORIGIN}${image}`

  // Schema.org JSON-LD can be a single object or an array
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : []

  const hasDaysParam = typeof window !== 'undefined' && window.location.search.includes('days=');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {hasDaysParam ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {resolvedCanonical && <meta property="og:url" content={resolvedCanonical} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org JSON-LD */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  )
}
