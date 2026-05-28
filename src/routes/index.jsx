import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('@/pages/Home'))
const Shop = lazy(() => import('@/pages/Shop'))
const ProductDetails = lazy(() => import('@/pages/ProductDetails'))
const BridalCollections = lazy(() => import('@/pages/BridalCollections'))
const JewelleryCollections = lazy(() => import('@/pages/JewelleryCollections'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Terms = lazy(() => import('@/pages/Terms'))
const FAQ = lazy(() => import('@/pages/FAQ'))
const HowItWorks = lazy(() => import('@/pages/HowItWorks'))
const ClientDiary = lazy(() => import('@/pages/ClientDiary'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Cart = lazy(() => import('@/pages/Cart'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const Auth = lazy(() => import('@/pages/Auth'))
const Account = lazy(() => import('@/pages/Account'))
const Testimonials = lazy(() => import('@/pages/Testimonials'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Loading fallback
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-obsidian)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(201, 169, 110, 0.2)', borderTopColor: 'var(--color-gold)' }}
        />
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
        >
          Loading
        </span>
      </div>
    </div>
  )
}

function SuspenseWrapper({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><Home /></SuspenseWrapper> },
      { path: 'shop', element: <SuspenseWrapper><Shop /></SuspenseWrapper> },
      { path: 'product/:slug', element: <SuspenseWrapper><ProductDetails /></SuspenseWrapper> },
      { path: 'bridal', element: <SuspenseWrapper><BridalCollections /></SuspenseWrapper> },
      { path: 'bridal/:slug', element: <SuspenseWrapper><BridalCollections /></SuspenseWrapper> },
      { path: 'jewellery', element: <SuspenseWrapper><JewelleryCollections /></SuspenseWrapper> },
      { path: 'jewellery/:slug', element: <SuspenseWrapper><JewelleryCollections /></SuspenseWrapper> },
      { path: 'jewellery/:slug/:subSlug', element: <SuspenseWrapper><JewelleryCollections /></SuspenseWrapper> },
      { path: 'collections/:slug', element: <SuspenseWrapper><JewelleryCollections /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><About /></SuspenseWrapper> },
      { path: 'contact', element: <SuspenseWrapper><Contact /></SuspenseWrapper> },
      { path: 'terms', element: <SuspenseWrapper><Terms /></SuspenseWrapper> },
      { path: 'faq', element: <SuspenseWrapper><FAQ /></SuspenseWrapper> },
      { path: 'how-it-works', element: <SuspenseWrapper><HowItWorks /></SuspenseWrapper> },
      { path: 'client-diary', element: <SuspenseWrapper><ClientDiary /></SuspenseWrapper> },
      { path: 'testimonials', element: <SuspenseWrapper><Testimonials /></SuspenseWrapper> },
      { path: 'wishlist', element: <SuspenseWrapper><Wishlist /></SuspenseWrapper> },
      { path: 'cart', element: <SuspenseWrapper><Cart /></SuspenseWrapper> },
      { path: 'checkout', element: <SuspenseWrapper><Checkout /></SuspenseWrapper> },
      { path: 'login', element: <SuspenseWrapper><Auth /></SuspenseWrapper> },
      { path: 'register', element: <SuspenseWrapper><Auth /></SuspenseWrapper> },
      { path: 'auth', element: <SuspenseWrapper><Auth /></SuspenseWrapper> },
      { path: 'account', element: <SuspenseWrapper><Account /></SuspenseWrapper> },
      { path: '*', element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
    ],
  },
], { basename: '/' })
