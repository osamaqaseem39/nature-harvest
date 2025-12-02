'use client'

import { Heart, Star, Shield } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const WhoWeAre = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Company Information Section */}
      <section ref={sectionRef} className="relative bg-gradient-to-br from-green-100 via-green-50 to-green-100 pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-20 -mt-10 sm:-mt-16 lg:-mt-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-green-400 rounded-full"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-green-300 rounded-full"></div>
        </div>

  <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className={`relative z-20 transition-all duration-1000 ease-out delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}>
              {/* Small Heading */}
              <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-xs sm:text-sm mb-4 sm:mb-6">
                WHO WE ARE
              </h3>
              
              {/* Main Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-6 sm:mb-8 leading-tight">
                About Nature Harvest
              </h2>
              
              {/* Mission */}
              <div className={`mb-6 sm:mb-8 transition-all duration-800 ease-out delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-jost font-bold text-gray-800">Mission</h4>
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-jost text-gray-700 leading-relaxed">
                  Our mission is to bring joy, health, and well-being into the lives of people. We aim to create beverages that are not only nutritious and refreshing but also have a special place in the hearts of our customers.
                </p>
              </div>

              {/* Vision */}
              <div className={`mb-6 sm:mb-8 transition-all duration-800 ease-out delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-jost font-bold text-gray-800">Vision</h4>
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-jost text-gray-700 leading-relaxed">
                  Our vision is a world where our brand represents more than just a beverage. We envision our drinks being enjoyed around the globe, bringing people together and creating unforgettable memories.
                </p>
              </div>

              {/* Belief */}
              <div className={`mb-6 sm:mb-8 transition-all duration-800 ease-out delay-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-jost font-bold text-gray-800">Belief</h4>
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-jost text-gray-700 leading-relaxed">
                  We believe that every drink we make should reflect our commitment to excellence, our love of flavor, and our dedication to create something truly special.
                </p>
              </div>
            </div>
            
            {/* Right Side - Main Image */}
            <div className={`relative z-20 transition-all duration-1000 ease-out delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}>
              <Image
                src="/images/featureimage.png"
                alt="Nature Harvest - Premium Beverage Manufacturing and Fresh Juice Production"
                width={800}
                height={700}
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default WhoWeAre 