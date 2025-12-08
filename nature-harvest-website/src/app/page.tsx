import Hero from '@/components/Hero'
import WhoWeAre from '@/components/WhoWeAre'
import CEOMessage from '@/components/CEOMessage'
import ContactInfo from '@/components/ContactInfo'
import CTA from '@/components/CTA'
import Link from 'next/link'
import { ShoppingBag, Sparkles, ChevronRight } from 'lucide-react'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhoWeAre />
      <CEOMessage />
      
      {/* Products and Brands CTAs */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#f2eecc' }}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-40 h-40 bg-green-300 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-green-200 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Products CTA */}
            <Link 
              href="/products"
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/10 group-hover:to-green-600/10 transition-all duration-500"></div>
              
              <div className="relative p-8 lg:p-10">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:scale-110 transition-all duration-300">
                  <ShoppingBag className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  Explore Our Products
                </h3>
                
                <p className="text-gray-600 font-jost leading-relaxed mb-6">
                  Discover our complete range of <span className="text-green-600 font-semibold">premium juice</span>, <span className="text-green-600 font-semibold">flavored milk</span>, and <span className="text-green-600 font-semibold">tea whiteners</span>. From refreshing juices and pure waters to delicious flavored milk and quality tea whiteners, find the perfect taste for every moment.
                </p>
                
                <div className="inline-flex items-center text-green-600 font-jost font-semibold group-hover:text-green-700 transition-colors duration-300">
                  <span>View Products</span>
                  <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>

            {/* Brands CTA */}
            <Link 
              href="/brands"
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/10 group-hover:to-green-600/10 transition-all duration-500"></div>
              
              <div className="relative p-8 lg:p-10">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:scale-110 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  Discover Our Brands
                </h3>
                
                <p className="text-gray-600 font-jost leading-relaxed mb-6">
                  Learn about our premium beverage brands. Each brand represents our commitment to excellence, quality, and innovation.
                </p>
                
                <div className="inline-flex items-center text-green-600 font-jost font-semibold group-hover:text-green-700 transition-colors duration-300">
                  <span>View Brands</span>
                  <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </div>
        </div>
      </section>

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
