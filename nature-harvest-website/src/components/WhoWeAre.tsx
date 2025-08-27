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
      <section ref={sectionRef} className="relative bg-gradient-to-br from-green-50 via-white to-green-50 pt-60 pb-20 -mt-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-300 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className={`relative z-20 transition-all duration-1000 ease-out delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}>
              {/* Small Heading */}
              <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-6">
                WHO WE ARE
              </h3>
              
              {/* Main Title */}
              <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-8 leading-tight">
                About Nature Harvest
              </h2>
              
              {/* Mission */}
              <div className={`mb-8 transition-all duration-800 ease-out delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-jost font-bold text-gray-800">Mission</h4>
                </div>
                <p className="text-lg font-jost text-gray-700 leading-relaxed">
                  Our mission is to bring joy, health, and well-being into the lives of people. We aim to create beverages that are not only nutritious and refreshing but also have a special place in the hearts of our customers.
                </p>
              </div>

              {/* Vision */}
              <div className={`mb-8 transition-all duration-800 ease-out delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-jost font-bold text-gray-800">Vision</h4>
                </div>
                <p className="text-lg font-jost text-gray-700 leading-relaxed">
                  Our vision is a world where our brand represents more than just a beverage. We envision our drinks being enjoyed around the globe, bringing people together and creating unforgettable memories.
                </p>
              </div>

              {/* Belief */}
              <div className={`mb-8 transition-all duration-800 ease-out delay-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-jost font-bold text-gray-800">Belief</h4>
                </div>
                <p className="text-lg font-jost text-gray-700 leading-relaxed">
                  We believe that every drink we make should reflect our commitment to excellence, our love of flavor, and our dedication to creating something truly special.
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
                className="object-cover transition-transform duration-700 hover:scale-105"
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