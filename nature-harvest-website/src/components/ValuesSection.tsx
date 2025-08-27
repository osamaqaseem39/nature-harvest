'use client'

import { Leaf, Heart, Shield, Star, Users, Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const ValuesSection = () => {
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

  const values = [
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We are committed to environmental responsibility, using eco-friendly practices and sustainable sourcing methods to minimize our ecological footprint.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Heart,
      title: "Quality",
      description: "Every product we create meets the highest standards of excellence, ensuring that our customers receive only the best ingredients and flavors.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with complete transparency and honesty, building trust through our actions and maintaining the highest ethical standards in all we do.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Star,
      title: "Innovation",
      description: "We continuously push boundaries to create unique and exciting products, embracing new technologies and creative solutions to meet evolving customer needs.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in giving back to the communities we serve, supporting local initiatives and fostering meaningful relationships with our stakeholders.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Globe,
      title: "Local Impact",
      description: "Our focus is on serving Pakistani communities with quality products while supporting local farmers and suppliers, contributing to Pakistan's beverage industry growth.",
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-200 rounded-full opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-6">
            OUR VALUES
          </h3>
          <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-8 leading-tight">
            What Drives Us Forward
          </h2>
          <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These core values guide every decision we make, every product we create, and every relationship we build. 
            They are the foundation of our success and the promise we make to our customers.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={value.title}
              className={`group transition-all duration-1000 ease-out delay-${400 + index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h4 className="text-2xl font-gazpacho font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  {value.title}
                </h4>
                <p className="text-gray-600 font-jost leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Commitment Statement */}
        <div className={`mt-20 transition-all duration-1000 ease-out delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl lg:text-4xl font-gazpacho font-bold mb-6">
              Our Commitment to You
            </h3>
            <p className="text-xl font-jost leading-relaxed max-w-4xl mx-auto mb-8">
              We pledge to uphold these values in everything we do, from the ingredients we source to the products we deliver. 
              Your trust is our most valuable asset, and we work tirelessly to earn and maintain it every day.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-gazpacho font-bold mb-2">100%</div>
                <div className="text-green-100 font-jost">Natural Ingredients</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-gazpacho font-bold mb-2">24/7</div>
                <div className="text-green-100 font-jost">Quality Control</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-gazpacho font-bold mb-2">0%</div>
                <div className="text-green-100 font-jost">Compromise</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValuesSection 