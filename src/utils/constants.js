import { BRIDAL_CATEGORIES, JEWELLERY_CATEGORIES } from './categories'

/**
 * Navigation links
 *
 * Hierarchy:
 *   Top level → optional `children` (sub-categories)
 *               → optional `children` (sub-sub-categories, e.g. Earrings → Antique)
 *
 * Categories with their own `children` render as expandable groups inside
 * the desktop mega menu and as nested accordion sections on mobile.
 *
 * Both Bridal and Jewellery branches are derived from `categories.js` so
 * menu slugs are guaranteed to match what the route-level resolvers use —
 * single source of truth for category navigation.
 */
const jewelleryNav = JEWELLERY_CATEGORIES.map((main) => ({
  label: main.label,
  path: `/jewellery/${main.slug}`,
  ...(main.children?.length
    ? {
      children: main.children.map((sub) => ({
        label: sub.label,
        path: `/jewellery/${main.slug}/${sub.slug}`,
      })),
    }
    : {}),
}))

const bridalNav = BRIDAL_CATEGORIES.map((c) => ({
  label: c.label,
  path: `/bridal/${c.slug}`,
}))

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  {
    label: 'Bridal Wear',
    path: '/bridal',
    children: bridalNav,
  },
  {
    label: 'Jewellery',
    path: '/jewellery',
    children: jewelleryNav,
  },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

/**
 * Featured Products (mock data)
 *
 * Note: All prices below are MRP. For our rental commerce model we display
 * a daily rental rate computed from MRP via `dailyRentalRate(price)` in helpers.
 * Each product carries a small gallery — when only a single hero image exists
 * we repeat alternate-view placeholders so the thumbnail rail renders.
 */
export const PRODUCTS = [
  {
    id: 1,
    name: 'Maharani Bridal Necklace',
    description: 'An exquisite kundan necklace inspired by the royal courts of Rajasthan, featuring hand-set polki diamonds and rubies in 22-karat gold.',
    price: 285000,
    originalPrice: 320000,
    category: 'Necklaces',
    collection: 'Bridal Heritage',
    images: [
      '/products/necklace-1.jpg',
      '/products/ranihaar-1.jpg',
      '/products/choker-1.jpg',
      '/products/tikka-1.jpg',
    ],
    rating: 4.9,
    reviewCount: 127,
    inStock: true,
    isNew: true,
    tags: ['bridal', 'kundan', 'heritage'],
  },
  {
    id: 2,
    name: 'Celestial Jhumka Earrings',
    description: 'Handcrafted gold jhumkas adorned with uncut diamonds and south sea pearls. A timeless piece for the discerning bride.',
    price: 145000,
    originalPrice: null,
    category: 'Earrings',
    collection: 'Temple Collection',
    images: [
      '/products/earrings-1.jpg',
      '/products/tikka-1.jpg',
      '/products/hathphool-1.jpg',
    ],
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    isNew: false,
    tags: ['temple', 'jhumka', 'pearls'],
  },
  {
    id: 3,
    name: 'Royal Choker Set',
    description: 'A magnificent choker set encrusted with emeralds and diamonds, complemented by matching maang tikka and earrings.',
    price: 425000,
    originalPrice: 475000,
    category: 'Sets',
    collection: 'Bridal Heritage',
    images: [
      '/products/choker-1.jpg',
      '/products/necklace-1.jpg',
      '/products/earrings-1.jpg',
      '/products/tikka-1.jpg',
    ],
    rating: 5.0,
    reviewCount: 64,
    inStock: true,
    isNew: true,
    tags: ['bridal', 'choker', 'emerald'],
  },
  {
    id: 4,
    name: 'Payal Antique Bangles',
    description: 'Intricately carved antique gold bangles featuring traditional meenakari work from the artisans of Jaipur.',
    price: 98000,
    originalPrice: null,
    category: 'Bangles',
    collection: 'Heritage',
    images: [
      '/products/bangles-1.jpg',
      '/products/hathphool-1.jpg',
      '/products/ranihaar-1.jpg',
    ],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    isNew: false,
    tags: ['antique', 'meenakari', 'bangles'],
  },
  {
    id: 5,
    name: 'Saanvi Maang Tikka',
    description: 'A stunning borla-style maang tikka in 22-karat gold with natural rubies and seed pearls for the quintessential bridal look.',
    price: 78000,
    originalPrice: 85000,
    category: 'Head Jewellery',
    collection: 'Bridal Heritage',
    images: [
      '/products/tikka-1.jpg',
      '/products/necklace-1.jpg',
      '/products/earrings-1.jpg',
    ],
    rating: 4.9,
    reviewCount: 42,
    inStock: true,
    isNew: true,
    tags: ['bridal', 'tikka', 'rubies'],
  },
  {
    id: 6,
    name: 'Devika Bridal Lehenga',
    description: 'Hand-embroidered bridal lehenga in deep maroon silk with intricate zardozi work, paired with a matching dupatta.',
    price: 385000,
    originalPrice: 425000,
    category: 'Bridal Wear',
    collection: 'Bridal Couture',
    images: [
      '/products/lehenga-1.jpg',
      '/products/choker-1.jpg',
      '/products/ranihaar-1.jpg',
      '/products/hathphool-1.jpg',
    ],
    rating: 4.8,
    reviewCount: 73,
    inStock: true,
    isNew: false,
    tags: ['bridal', 'lehenga', 'couture'],
  },
  {
    id: 7,
    name: 'Rani Haar Long Necklace',
    description: 'A regal multi-layered gold rani haar with polki diamonds and emerald drops, inspired by Mughal-era magnificence.',
    price: 520000,
    originalPrice: null,
    category: 'Necklaces',
    collection: 'Royal Legacy',
    images: [
      '/products/ranihaar-1.jpg',
      '/products/necklace-1.jpg',
      '/products/choker-1.jpg',
    ],
    rating: 5.0,
    reviewCount: 38,
    inStock: true,
    isNew: true,
    tags: ['rani-haar', 'polki', 'mughal'],
  },
  {
    id: 8,
    name: 'Hathphool Hand Harness',
    description: 'Delicate kundan hathphool with cascading pearl chains, connecting rings to bracelet in a mesmerizing design.',
    price: 62000,
    originalPrice: 68000,
    category: 'Hand Jewellery',
    collection: 'Bridal Heritage',
    images: [
      '/products/hathphool-1.jpg',
      '/products/bangles-1.jpg',
      '/products/tikka-1.jpg',
    ],
    rating: 4.6,
    reviewCount: 91,
    inStock: false,
    isNew: false,
    tags: ['bridal', 'hathphool', 'kundan'],
  },
]

/**
 * Default rental duration options (in days).
 */
export const RENTAL_DURATIONS = [3, 4, 5, 6, 7]

/**
 * Collections data
 */
export const COLLECTIONS = [
  {
    id: 'bridal-heritage',
    name: 'Bridal Heritage',
    description: 'Timeless bridal jewellery crafted with centuries-old techniques, celebrating the sacred bond of marriage.',
    productCount: 48,
  },
  {
    id: 'temple-collection',
    name: 'Temple Collection',
    description: 'Inspired by the divine artistry of South Indian temple architecture, each piece is a devotion in gold.',
    productCount: 32,
  },
  {
    id: 'royal-legacy',
    name: 'Royal Legacy',
    description: 'Jewellery that echoes the grandeur of Indian royalty — Mughal precision meets Rajput splendor.',
    productCount: 24,
  },
  {
    id: 'bridal-couture',
    name: 'Bridal Couture',
    description: 'Handwoven bridal apparels adorned with the finest embroidery, for the bride who commands attention.',
    productCount: 18,
  },
]

/**
 * Testimonials
 *
 * NOTE: These are brand-aligned placeholder reviews. Google's review platform
 * gates verbatim review text behind their JS widget so we couldn't scrape it
 * directly. Replace each entry below with the real Google review (text,
 * reviewer name, and city/date) when you have access to copy them over —
 * keep the same shape so the carousel needs no further changes.
 */
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aanya Mehta',
    location: 'Mumbai · Bride',
    text: 'I rented my entire bridal look — lehenga, choker, hath phool, everything. The fit was custom and the pieces arrived in pristine condition a day before. The studio team made the process effortless.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Riya Desai',
    location: 'Pune · Reception',
    text: 'A stunning gown that I wore for one night without the guilt of a wardrobe full of unworn couture. The deposit refund came through within days. Truly the smartest way to do bridal in 2024.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Snehal Patil',
    location: 'Mumbai · Sangeet',
    text: 'The kundan set I rented was heirloom-grade — better than what I had seen in showrooms at three times the price. Every stone was set with such precision. Genuinely felt like royalty.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Nidhi Agarwal',
    location: 'Bengaluru · Engagement',
    text: 'Don\'t Repeat It, Rent It — they live up to the tagline. Pan-India shipping was reliable, the trial-at-home option was a lifesaver, and the team genuinely cared that everything looked perfect on me.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Tanya Kapoor',
    location: 'Mumbai · Wedding',
    text: 'Their Vile Parle studio is a hidden gem. The team helps you mix and match jewellery with the outfit so everything ties together. I left feeling like I had my own personal stylist.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Pooja Shah',
    location: 'Surat · Mother of the Bride',
    text: 'I was sceptical about renting at first, but the quality won me over. The pieces look new, fit beautifully, and the rental window was generous enough for our three-day wedding. Highly recommend.',
    rating: 5,
  },
]

/**
 * Brand milestones for craftsmanship timeline
 */
export const MILESTONES = [
  {
    year: '1952',
    title: 'The Beginning',
    description: 'Founded in the heart of Jaipur by master goldsmith Shri Ramesh Kumar, with a vision to preserve India\'s jewellery heritage.',
  },
  {
    year: '1978',
    title: 'Royal Patronage',
    description: 'Commissioned by the Jaipur royal family to create ceremonial jewellery, establishing our reputation for extraordinary craftsmanship.',
  },
  {
    year: '1995',
    title: 'Heritage Expansion',
    description: 'Expanded into bridal couture, blending traditional textile artistry with our hallmark attention to detail.',
  },
  {
    year: '2010',
    title: 'Modern Legacy',
    description: 'Launched contemporary collections while preserving ancient techniques — kundan, meenakari, and temple jewellery traditions.',
  },
  {
    year: '2024',
    title: 'Digital Atelier',
    description: 'Bringing our heritage to the world through an immersive digital experience, connecting global brides with Indian artistry.',
  },
]

/**
 * Marquee text items
 */
export const MARQUEE_ITEMS = [
  'Handcrafted Heritage',
  '✦',
  '22 Karat Gold',
  '✦',
  'Bridal Excellence',
  '✦',
  'Timeless Artistry',
  '✦',
  'Royal Craftsmanship',
  '✦',
  'Sacred Traditions',
  '✦',
]
