'use client'

import { Users, Award, Globe, Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// CompanyStats component for displaying company achievements
const CompanyStats = () => {
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

  const stats = [
    {
      icon: Users,
      number: "25+",
      label: "Team Members",
      description: "Dedicated Pakistani professionals committed to excellence"
    },
    {
      icon: Award,
      number: "3+",
      label: "Years Experience",
      description: "Rapid growth and expertise in beverage manufacturing"
    },
    {
      icon: Globe,
      number: "5+",
      label: "Cities Served",
      description: "Growing presence across major Pakistani cities"
    },
    {
      icon: Heart,
      number: "50K+",
      label: "Happy Customers",
      description: "Satisfied customers across Pakistan"
    }
  ]

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-green-600 via-green-500 to-green-700 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full transform -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 translate-y-32"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-100 uppercase tracking-widest font-jost font-semibold text-sm mb-6">
            OUR ACHIEVEMENTS
          </h3>
          <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-white mb-8 leading-tight">
            Numbers That Define Us
          </h2>
          <p className="text-lg font-jost text-green-100 max-w-3xl mx-auto leading-relaxed">
            These numbers represent our commitment to excellence, our global reach, and the trust millions of customers place in Nature Harvest every day.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`text-center transition-all duration-1000 ease-out delay-${400 + index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-gazpacho font-bold text-white mb-3">
                  {stat.number}
                </div>
                <h4 className="text-xl font-jost font-bold text-white mb-2">
                  {stat.label}
                </h4>
                <p className="text-green-100 font-jost text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className={`text-center mt-16 transition-all duration-1000 ease-out delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h4 className="text-2xl font-gazpacho font-bold text-white mb-4">
              Pakistani Quality Standards
            </h4>
            <p className="text-green-100 font-jost leading-relaxed">
              Nature Harvest meets and exceeds Pakistani food safety standards including PSQCA certification. 
              Our facilities follow international best practices while maintaining the authentic taste and quality that Pakistani consumers love.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompanyStats 