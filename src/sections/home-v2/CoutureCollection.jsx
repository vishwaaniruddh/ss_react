import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const COUTURE_ITEMS = [
  {
    id: 'couture-1',
    title: 'BLUSH PEACH LEHENGA',
    price: '₹6,500',
    slug: 'blush-peach-lehenga',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=800&auto=format&fit=crop',
    fallback: '/banner/banner1.webp',
  },
  {
    id: 'couture-2',
    title: 'PEACH EMBROIDERED GOWN',
    price: '₹5,500',
    slug: 'peach-embroidered-gown',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
    fallback: '/products/lehenga-1.webp',
  },
  {
    id: 'couture-3',
    title: 'CHAMPAGNE CRYSTAL GOWN',
    price: '₹6,000',
    slug: 'champagne-crystal-gown',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
    fallback: '/banner/banner1.webp',
  },
  {
    id: 'couture-4',
    title: 'STEEL BLUE GOWN',
    price: '₹5,500',
    slug: 'steel-blue-gown',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    fallback: '/products/lehenga-1.webp',
  },
  {
    id: 'couture-5',
    title: 'FUCHSIA BRIDAL LEHENGA',
    price: '₹8,500',
    slug: 'fuchsia-bridal-lehenga',
    image: 'https://images.unsplash.com/photo-1610030469668-9655ec157a95?q=80&w=800&auto=format&fit=crop',
    fallback: '/banner/banner1.webp',
  },
]

export default function CoutureCollection() {
  const [wishlist, setWishlist] = useState({})

  const toggleWishlist = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="w-full bg-[#08090A] py-14 lg:py-20 border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-[0.15em] text-[#C9A96E] uppercase">
            COUTURE COLLECTION
          </h2>
          <p className="text-sm sm:text-base text-[#FAF6F0]/75 font-sans font-light">
            Curated designer outfits for every celebration.
          </p>
          <div className="pt-2">
            <Link
              to="/shop?category=couture"
              className="inline-block px-6 py-2 border border-[#C9A96E] hover:bg-[#C9A96E] text-[#C9A96E] hover:text-[#0A0A0A] text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300"
            >
              VIEW ALL OUTFITS
            </Link>
          </div>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {COUTURE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#0D0F11] border border-[rgba(201,169,110,0.18)] hover:border-[#C9A96E] transition-all duration-500 flex flex-col overflow-hidden shadow-lg"
            >
              {/* Image Container */}
              <Link to={`/product/${item.slug}`} className="relative block aspect-[3/4.5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                  onError={(e) => {
                    e.target.src = item.fallback
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0C] via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(item.id, e)}
                  aria-label="Add to wishlist"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#C9A96E] hover:scale-110 transition-all z-10 cursor-pointer"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={wishlist[item.id] ? '#C9A96E' : 'none'}
                    stroke="#C9A96E"
                    strokeWidth={1.75}
                  />
                </button>
              </Link>

              {/* Bottom Card Content */}
              <div className="p-3.5 text-center bg-[#0B0D0E]/95 border-t border-[rgba(201,169,110,0.12)]">
                <Link to={`/product/${item.slug}`}>
                  <h3 className="text-[12px] font-medium tracking-[0.12em] text-[#FAF6F0] group-hover:text-[#C9A96E] uppercase transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-[11px] text-[#C9A96E] tracking-[0.08em] font-light mt-1">
                  Rent from <span className="font-semibold">{item.price}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
