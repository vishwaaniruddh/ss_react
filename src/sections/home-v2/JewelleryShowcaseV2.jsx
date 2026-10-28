import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const JEWELLERY_ITEMS = [
  {
    id: 'jewel-1',
    title: 'POLKI NECKLACE SET',
    price: '₹2,500',
    slug: 'polki-necklace-set',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    fallback: '/products/necklace-1.webp',
  },
  {
    id: 'jewel-2',
    title: 'KUNDAN CHOKER SET',
    price: '₹2,200',
    slug: 'kundan-choker-set',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop',
    fallback: '/products/choker-1.webp',
  },
  {
    id: 'jewel-3',
    title: 'STATEMENT EARRINGS',
    price: '₹800',
    slug: 'statement-earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    fallback: '/products/earrings-1.webp',
  },
  {
    id: 'jewel-4',
    title: 'BRIDAL BANGLES',
    price: '₹1,000',
    slug: 'bridal-bangles',
    image: 'https://images.unsplash.com/photo-1611591475152-4779438e4911?q=80&w=800&auto=format&fit=crop',
    fallback: '/products/bangles-1.webp',
  },
]

export default function JewelleryShowcaseV2() {
  const [wishlist, setWishlist] = useState({})

  const toggleWishlist = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="w-full bg-[#0A0C0D] py-14 lg:py-20 border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Block: Heading & CTA */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-4 pr-0 lg:pr-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-[0.12em] text-[#C9A96E] uppercase leading-tight">
              LUXURY <br className="hidden lg:block" />
              JEWELLERY ON RENT
            </h2>
            <p className="text-sm text-[#FAF6F0]/75 font-sans font-light max-w-md mx-auto lg:mx-0">
              Complete your look with our exquisite jewellery. Handcrafted heritage polki, kundan, and bridal sets.
            </p>
            <div className="pt-2">
              <Link
                to="/jewellery"
                className="inline-block px-7 py-3 border border-[#C9A96E] hover:bg-[#C9A96E] text-[#C9A96E] hover:text-[#0A0A0A] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md cursor-pointer"
              >
                EXPLORE JEWELLERY
              </Link>
            </div>
          </div>

          {/* Right Block: 4 Jewellery Cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {JEWELLERY_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-[#0D0F11] border border-[rgba(201,169,110,0.18)] hover:border-[#C9A96E] transition-all duration-500 flex flex-col overflow-hidden shadow-lg"
                >
                  {/* Image */}
                  <Link to={`/product/${item.slug}`} className="relative block aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = item.fallback
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0C] via-transparent to-black/20 opacity-70 group-hover:opacity-50 transition-opacity" />
                    
                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(item.id, e)}
                      aria-label="Add to wishlist"
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#C9A96E] hover:scale-110 transition-all z-10 cursor-pointer"
                    >
                      <Heart
                        className="w-3.5 h-3.5"
                        fill={wishlist[item.id] ? '#C9A96E' : 'none'}
                        stroke="#C9A96E"
                        strokeWidth={1.75}
                      />
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="p-3 text-center bg-[#0B0D0E]/95 border-t border-[rgba(201,169,110,0.12)]">
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="text-[11px] font-medium tracking-[0.1em] text-[#FAF6F0] group-hover:text-[#C9A96E] uppercase transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-[10px] sm:text-[11px] text-[#C9A96E] tracking-[0.06em] font-light mt-1">
                      Rent from <span className="font-semibold">{item.price}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
