'use client'

import { useMobile } from '../hooks/useMobile'
import MobileHero from '../components/MobileHero'
import WhoWeAre from '../components/WhoWeAre'
import CEOMessage from '../components/CEOMessage'
import WhyChooseUs from '../components/WhyChooseUs'
import FeaturedProducts from '../components/FeaturedProducts'
import Brands from '../components/Brands'
import ContactInfo from '../components/ContactInfo'
import CTA from '../components/CTA'
import { MobileSection, MobileText, MobileButton } from '../components/MobileLayout'

export default function MobileHome() {
  const { isMobile } = useMobile()

  // If not mobile, redirect to main page
  if (typeof window !== 'undefined' && !isMobile) {
    window.location.href = '/'
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Mobile Hero Section */}
      <MobileHero />
      
      {/* Mobile Who We Are Section */}
      <MobileSection padding="large" className="bg-gradient-to-br from-green-100 via-green-50 to-green-100 -mt-10 sm:-mt-16 lg:-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="relative z-20">
              {/* Small Heading */}
              <MobileText 
                size="xs" 
                color="primary" 
                weight="semibold"
                className="uppercase tracking-widest mb-4 sm:mb-6"
              >
                WHO WE ARE
              </MobileText>
              
              {/* Main Title */}
              <MobileText 
                size={isMobile ? '3xl' : '4xl'}
                weight="bold"
                className="font-gazpacho mb-6 sm:mb-8 leading-tight"
              >
                About Nature Harvest
              </MobileText>
              
              {/* Mission */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <MobileText size={isMobile ? 'lg' : 'xl'} weight="bold">
                    Mission
                  </MobileText>
                </div>
                <MobileText size={isMobile ? 'sm' : 'base'} color="muted">
                  Our mission is to bring joy, health, and well-being into the lives of people. We aim to create beverages that are not only nutritious and refreshing but also have a special place in the hearts of our customers.
                </MobileText>
              </div>

              {/* Vision */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <MobileText size={isMobile ? 'lg' : 'xl'} weight="bold">
                    Vision
                  </MobileText>
                </div>
                <MobileText size={isMobile ? 'sm' : 'base'} color="muted">
                  Our vision is a world where our brand represents more than just a beverage. We envision our drinks being enjoyed around the globe, bringing people together and creating unforgettable memories.
                </MobileText>
              </div>

              {/* Belief */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <MobileText size={isMobile ? 'lg' : 'xl'} weight="bold">
                    Belief
                  </MobileText>
                </div>
                <MobileText size={isMobile ? 'sm' : 'base'} color="muted">
                  We believe that every drink we make should reflect our commitment to excellence, our love of flavor, and our dedication to creating something truly special.
                </MobileText>
              </div>
            </div>
            
            {/* Right Side - Main Image */}
            <div className="relative z-20">
              <img
                src="/images/featureimage.png"
                alt="Nature Harvest - Premium Beverage Manufacturing and Fresh Juice Production"
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </MobileSection>
      
      {/* Mobile Featured Products */}
      <FeaturedProducts />
      
      {/* Mobile CEO Message */}
      <CEOMessage />
      
      {/* Mobile Why Choose Us */}
      <WhyChooseUs />
      
      {/* Mobile Brands */}
      <Brands />
      
      {/* Mobile CTA */}
      <CTA />
      
      {/* Mobile Contact Info */}
      <ContactInfo />
    </div>
  )
}