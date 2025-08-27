import Hero from '@/components/Hero'
import WhoWeAre from '@/components/WhoWeAre'
import CEOMessage from '@/components/CEOMessage'
import WhyChooseUs from '@/components/WhyChooseUs'
import FeaturedProducts from '@/components/FeaturedProducts'
import Brands from '@/components/Brands'
import ContactInfo from '@/components/ContactInfo'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhoWeAre />
      <FeaturedProducts />
      <CEOMessage />
      <WhyChooseUs />
      <Brands />
      <CTA />
      <ContactInfo />
    </div>
  )
}
