'use client'

import { Calendar, MapPin, Target, Award } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// OurStory component for displaying company timeline and history
const OurStory = () => {
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

  const timeline = [
    {
      year: "2022",
      title: "The Beginning",
      description: "Nature Harvest was founded in Pakistan with a simple vision: to create healthy, delicious beverages that bring joy to people's lives.",
      icon: Calendar
    },
    {
      year: "2023",
      title: "First Major Success",
      description: "Our flagship juice line launched successfully across Pakistan, gaining recognition for its exceptional taste and quality standards.",
      icon: Target
    },
    {
      year: "2024",
      title: "Rapid Growth",
      description: "Expanded operations across major Pakistani cities and established strong partnerships with local retailers and distributors.",
      icon: MapPin
    },
    {
      year: "2025",
      title: "Innovation Leader",
      description: "Continuing to innovate with cutting-edge technology while maintaining our commitment to natural, healthy ingredients for Pakistani consumers.",
      icon: Award
    }
  ]

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-white via-green-50 to-white py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-6">
            OUR JOURNEY
          </h3>
          <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-8 leading-tight">
            The Story of Nature Harvest
          </h2>
          <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From humble beginnings in Pakistan to becoming a respected beverage company, our journey has been driven by passion, innovation, and an unwavering commitment to quality for Pakistani consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Story Content */}
          <div className={`transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <div className="space-y-8">
              <div>
                <h4 className="text-2xl font-gazpacho font-bold text-gray-800 mb-4">
                  A Vision Born from Passion
                </h4>
                <p className="text-lg font-jost text-gray-700 leading-relaxed mb-6">
                  Nature Harvest began as a small family business with a big dream. Our founder, Hafiz Muhammad Abdul Basit, 
                  envisioned a world where healthy beverages could be both delicious and accessible to everyone in Pakistan.
                </p>
                <p className="text-lg font-jost text-gray-700 leading-relaxed">
                  What started in a small facility in Pakistan has grown into a respected beverage company, but our core values remain unchanged: 
                  quality, innovation, and a deep respect for nature and our Pakistani customers.
                </p>
              </div>

              <div>
                <h4 className="text-2xl font-gazpacho font-bold text-gray-800 mb-4">
                  Innovation at Our Core
                </h4>
                <p className="text-lg font-jost text-gray-700 leading-relaxed">
                  We've consistently pushed the boundaries of what's possible in beverage manufacturing in Pakistan, 
                  from developing unique flavor combinations to implementing sustainable production methods. 
                  Our research and development team works tirelessly to create products that exceed Pakistani consumer expectations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Timeline */}
          <div className={`transition-all duration-1000 ease-out delay-600 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200"></div>
              
              {/* Timeline Items */}
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={item.year} className="relative flex items-start">
                    {/* Timeline Dot */}
                    <div className="absolute left-4 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
                    
                    {/* Content */}
                    <div className="ml-12 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <item.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <span className="text-sm font-jost font-bold text-green-600">{item.year}</span>
                          <h5 className="text-lg font-gazpacho font-bold text-gray-800">{item.title}</h5>
                        </div>
                      </div>
                      <p className="text-gray-600 font-jost leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 ease-out delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <h4 className="text-2xl font-gazpacho font-bold text-gray-800 mb-4">
              Join Our Journey
            </h4>
            <p className="text-gray-700 font-jost leading-relaxed mb-6">
              As we continue to grow and innovate, we invite you to be part of our story. 
              Every product we create is a testament to our commitment to excellence and our love for what we do.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-jost font-semibold uppercase tracking-wider px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Explore Our Products
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory 