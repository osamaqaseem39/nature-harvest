'use client'

import { Leaf, Heart, Star, Shield } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const WhyChooseUs = () => {
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
    <section ref={sectionRef} className="relative bg-gradient-to-br from-white via-green-50 to-white py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-6">
            WHY CHOOSE US
          </h3>
          <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-8 leading-tight">
            Why Choose Nature Harvest?
          </h2>
          <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto leading-relaxed">
            When you choose Nature Harvest, you choose a company committed to your health and well-being. We craft every drink with care to ensure great taste and the nourishment your body needs.
          </p>
        </div>

        {/* 4 Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1 - Quality */}
          <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:scale-105 transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/production.jpg"
                alt="Quality Control - Factory Worker Ensuring Product Quality"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/30 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="p-6 group-hover:bg-green-50 transition-colors duration-300">
              <h4 className="text-xl font-jost font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                Quality
              </h4>
              <p className="font-jost text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                Our dedication to quality is unparalleled. We use only the highest quality ingredients in all of our products, ensuring that you receive the vitamins and minerals your body needs to thrive.
              </p>
            </div>
          </div>

          {/* Card 2 - Ingredients */}
          <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:scale-105 transition-all duration-1000 ease-out delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/fresh.jpg"
                alt="Fresh Natural Fruits - Vibrant Fruit Basket with Pineapples, Oranges, Apples, and Kiwis"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/30 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="p-6 group-hover:bg-green-50 transition-colors duration-300">
              <h4 className="text-xl font-jost font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                Ingredients
              </h4>
              <p className="font-jost text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                At Nature Harvest, we believe that fresh is always best! That&apos;s why we source only the finest, high-quality ingredients for our delicious beverages.
              </p>
            </div>
          </div>

          {/* Card 3 - Taste */}
          <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:scale-105 transition-all duration-1000 ease-out delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/taste.jpg"
                alt="Delicious Taste Experience - Woman Enjoying Refreshing Orange Juice Outdoors"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/30 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="p-6 group-hover:bg-green-50 transition-colors duration-300">
              <h4 className="text-xl font-jost font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                Taste
              </h4>
              <p className="font-jost text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                We believe the key to an unforgettable taste experience lies in the freshness of our ingredients. We take extra care to ensure our ingredients are always fresh and natural.
              </p>
            </div>
          </div>

          {/* Card 4 - Trust */}
          <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:scale-105 transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/safety.jpg"
                alt="Safety and Trust - Laboratory Technician Testing Product Safety and Quality"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/30 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="p-6 group-hover:bg-green-50 transition-colors duration-300">
              <h4 className="text-xl font-jost font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                Trust
              </h4>
              <p className="font-jost text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                We understand that trust is earned, not given. That&apos;s why we work tirelessly to maintain the highest standards of quality and safety in everything we do.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className={`text-center mt-12 transition-all duration-1000 ease-out delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button className="bg-green-600 hover:bg-green-700 text-white font-jost font-semibold uppercase tracking-wider px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Discover Our Quality
          </button>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs 