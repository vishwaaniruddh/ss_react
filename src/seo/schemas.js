/**
 * Schema.org structured data generators for SEO
 */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sri Shringaar',
    description: 'Luxury Indian Bridal Jewellery & Heritage Apparels',
    url: 'https://srishringaar.com',
    logo: 'https://srishringaar.com/logo.png',
    sameAs: [
      'https://instagram.com/srishringaar',
      'https://facebook.com/srishringaar',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  }
}

const SITE_ORIGIN = 'https://srishringaar.com'

function absoluteUrl(path) {
  if (!path) return undefined
  return path.startsWith('http') ? path : `${SITE_ORIGIN}${path}`
}

export function productSchema(product, { canonicalUrl } = {}) {
  const images = (product.images || []).map(absoluteUrl)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images.length > 1 ? images : images[0],
    sku: `SS-${product.id}`,
    mpn: `SS-${product.id}`,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Sri Shringaar',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      price: product.price,
      priceCurrency: 'INR',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Sri Shringaar',
      },
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }
      : undefined,
  }
}

export function collectionSchema(collection) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: collection.url,
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}
