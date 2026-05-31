import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { useEffect } from 'react'
import SEO from '@/seo/SEO'
import Button from '@/components/ui/Button'

export default function NotFound() {
  // Set proper HTTP status code for 404
  useEffect(() => {
    // Add meta tag for server-side rendering or crawlers
    const meta = document.createElement('meta')
    meta.name = 'prerender-status-code'
    meta.content = '404'
    document.head.appendChild(meta)
    
    // Set document title for crawlers
    document.title = '404 - Page Not Found — Sri Shringaar'
    
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <>
      <SEO title="Page Not Found — Sri Shringaar" description="The page you're looking for doesn't exist." />

      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-obsidian)' }}
      >
        <div className="container-luxury text-center py-20">
          {/* Large 404 */}
          <h1
            className="text-[8rem] lg:text-[12rem] font-bold leading-none mb-4 select-none"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'transparent',
              WebkitTextStroke: '2px var(--color-gold)',
              opacity: 0.6,
            }}
          >
            404
          </h1>

          <h2
            className="heading-md mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}
          >
            Page Not Found
          </h2>

          <p
            className="body-lg max-w-md mx-auto mb-10"
            style={{ color: 'var(--color-ivory-muted)' }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let us help you find what you need.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/" variant="primary" size="lg">
              <Home size={16} /> Go Home
            </Button>
            <Button to="/shop" variant="secondary" size="lg">
              <Search size={16} /> Browse Shop
            </Button>
          </div>

          <Link
            to={-1}
            className="inline-flex items-center gap-2 mt-8 text-xs tracking-wider uppercase transition-colors hover:text-gold"
            style={{ color: 'var(--color-ivory-muted)', fontFamily: 'var(--font-sans)' }}
            onClick={(e) => { e.preventDefault(); window.history.back() }}
          >
            <ArrowLeft size={14} /> Go Back
          </Link>
        </div>
      </section>
    </>
  )
}
