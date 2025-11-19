import Hero from '@/components/Hero'
import WhoWeAre from '@/components/WhoWeAre'
import CEOMessage from '@/components/CEOMessage'
import WhyChooseUs from '@/components/WhyChooseUs'
import FeaturedProducts from '@/components/FeaturedProducts'
import Brands from '@/components/Brands'
import ContactInfo from '@/components/ContactInfo'
import CTA from '@/components/CTA'
import { Suspense } from 'react'

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
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading contact info...</p>
          </div>
        </div>
      }>
        <ContactInfo />
      </Suspense>
    </div>
  )
}
