import { motion } from 'framer-motion'
import SEO from '@/seo/SEO'
import SplitText from '@/components/ui/SplitText'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations/variants'
import craftsmanship from '@/assets/images/craftsmanship.webp'
import bridalHero from '@/assets/images/bridal-hero.webp'

const ACCESSORIES = [
  'Jewellery Set', 'Bridal Jewellery', 'Earring', 'Nath', 'Maang Tikka',
  'Borla', 'Damini', 'Passa', 'Chotis', 'Kamarpatta',
  'Bajubandh', 'Veni', 'Hair Piece', 'HathPhool', 'Payal',
]

const OUTFITS = [
  'Lehenga Choli', 'Bridal Lehengas', 'Evening Gowns', 'Indo Western', 'Pre Wedding / Trail Gowns',
]

export default function About() {
  return (
    <>
      <SEO title="About Us" description="Sri Shringarr — Mumbai's premier fashion rental studio for stunning jewellery, bridal accessories, and designer outfits available on hire at a fraction of the cost." />

      {/* Hero */}
      <section className="page-header" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p className="label-text mb-4" style={{ color: 'var(--color-gold)' }} {...fadeInUp}>Welcome to Sri Shringarr</motion.p>
              <SplitText className="heading-xl mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
                A World of Mesmerising Jewellery & Outfits
              </SplitText>
              <motion.p className="body-lg mb-6" style={{ color: 'var(--color-ivory-muted)' }} {...fadeInUp}>
                Have you ever thought that you could wear stunning outfits and jewels without burning a hole in your purse? Ever wished to look striking for every occasion and never repeat the same look? At Sri Shringarr, that dream becomes reality.
              </motion.p>
              <motion.p className="body-lg" style={{ color: 'var(--color-ivory-muted)' }} {...fadeInUp}>
                Experience the joy and luxury of flaunting a new look on every occasion — wearing stylish garments and accessories at a fraction of the cost. Welcome to your one-stop destination for gorgeous clothes and accessories available for hire.
              </motion.p>
            </div>
            <motion.div className="relative overflow-hidden rounded-2xl aspect-[4/5]" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <img src={craftsmanship} alt="Sri Shringarr fashion studio" className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="pt-20 pb-20" style={{ background: 'var(--color-charcoal)' }}>
        <div className="container-luxury">
          <SplitText className="heading-lg text-center mb-16" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
            Our Philosophy
          </SplitText>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {[
              { title: 'Adorning Femininity', text: 'We believe in celebrating the feminine spirit. Our pieces are engraved with state-of-the-art quality and awesome designs for that perfect look.' },
              { title: 'Unmatched Collection', text: 'The largest collection anyone can find under one roof — Bridal sets, Kundan, American Diamond, Antique and Vilandi sets, head to toe accessories.' },
              { title: 'Customisation', text: 'Our USP lies in customisation. Sri Shringarr Fashion Studio in Mumbai offers tailoring to perfection, because well-fitted clothes are always in fashion.' },
            ].map((value) => (
              <motion.div key={value.title} variants={staggerItem} className="glass-gold rounded-2xl p-8 text-center">
                <h3 className="heading-sm mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>{value.title}</h3>
                <p className="body-sm" style={{ color: 'var(--color-ivory-muted)' }}>{value.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Full width image divider */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src={bridalHero} alt="Sri Shringarr bridal collection" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent, rgba(10,10,10,0.6))' }} />
      </section>

      {/* Accessories */}
      <section className="pt-20 pb-12" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <SplitText className="heading-lg text-center mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
            Accessorise Yourself
          </SplitText>
          <motion.p className="body-lg text-center mb-12" style={{ color: 'var(--color-ivory-muted)', maxWidth: '700px', margin: '0 auto' }} {...fadeInUp}>
            As jewellery is an accessory bought in tune with matching apparel, our collections follow colour and design trends from the apparel sector. We offer a plethora of breathtaking jewellery so you can deck yourself out to your heart's desire.
          </motion.p>
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {ACCESSORIES.map((item) => (
              <motion.div key={item} variants={staggerItem} className="glass-gold rounded-xl p-4 text-center" style={{ cursor: 'default' }}>
                <p className="body-sm" style={{ color: 'var(--color-ivory)', fontWeight: 500 }}>{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Outfits */}
      <section className="pt-12 pb-20" style={{ background: 'var(--color-obsidian)' }}>
        <div className="container-luxury">
          <SplitText className="heading-lg text-center mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
            Exclusive Outfit Range
          </SplitText>
          <motion.p className="body-lg text-center mb-12" style={{ color: 'var(--color-ivory-muted)', maxWidth: '700px', margin: '0 auto' }} {...fadeInUp}>
            Our label is a seamless confluence of inspiration, ethnicity and femininity. Each ensemble is designed to come alive on the wearer and compliment her feminine core, playing around with different elements to give rise to beautifully detailed and exquisitely cut fashion wear.
          </motion.p>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {OUTFITS.map((item) => (
              <motion.div key={item} variants={staggerItem} className="glass-gold rounded-xl p-6 text-center">
                <p className="body-md" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bridal / CTA */}
      <section className="pt-20 pb-20" style={{ background: 'var(--color-charcoal)' }}>
        <div className="container-luxury text-center">
          <SplitText className="heading-lg mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>
            Your Dream Wedding Trousseau
          </SplitText>
          <motion.p className="body-lg mb-6" style={{ color: 'var(--color-ivory-muted)', maxWidth: '750px', margin: '0 auto' }} {...fadeInUp}>
            The easiest part of weddings is to take the vows. The hardest part is to look ravishing while taking them! That's where Sri Shringarr steps in. We are dedicated to making you look your best and your wedding trousseau an absolute dream.
          </motion.p>
          <motion.p className="body-lg mb-10" style={{ color: 'var(--color-ivory-muted)', maxWidth: '750px', margin: '0 auto' }} {...fadeInUp}>
            We promise to offer exclusive pieces that you will cherish for the rest of your life.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" {...fadeInUp}>
            <a href="tel:09324243011" className="btn-primary" style={{ textDecoration: 'none' }}>
              Call: 093242 43011
            </a>
            <a href="tel:7400413163" className="btn-outline" style={{ textDecoration: 'none' }}>
              Call: 74004 13163
            </a>
            <a href="mailto:rajanipodar@gmail.com" className="btn-outline" style={{ textDecoration: 'none' }}>
              Email Us
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}

