'use client'

import { Quote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const CEOMessage = () => {
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
    <section ref={sectionRef} className="relative bg-gradient-to-br from-green-100 via-white to-green-50 py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-300 rounded-full transform -translate-x-32 translate-y-32"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-200 rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className={`flex items-center mb-12 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
            <Quote className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-2">
              LEADERSHIP MESSAGE
            </h3>
            <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 leading-tight">
              A Message from Our CEO
            </h2>
          </div>
        </div>

        {/* Quote */}
        <div className={`relative mb-12 transition-all duration-1000 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="absolute -left-4 top-0 w-1 h-full bg-green-600 rounded-full"></div>
          <blockquote className="text-xl lg:text-2xl font-jost text-gray-700 leading-relaxed italic pl-8">
            &ldquo;As the CEO of Nature Harvest, I&apos;m excited to share our vision for the future of our organization. Our goal is to create beverages that are both healthy and delicious, while also being affordable and accessible to everyone.&rdquo;
          </blockquote>
        </div>

        {/* Message Content */}
        <div className={`space-y-6 mb-12 transition-all duration-1000 ease-out delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg font-jost text-gray-700 leading-relaxed">
            We use only the freshest ingredients and the most innovative techniques to craft our drinks. Our commitment to quality and excellence sets us apart from our competitors. We believe that everyone should have access to delicious, healthy drinks, and we are proud to provide them.
          </p>
          <p className="text-lg font-jost text-gray-700 leading-relaxed">
            Thank you for choosing Nature Harvest, and we look forward to serving you for many years to come.
          </p>
        </div>

        {/* CEO Name */}
        <div className={`transition-all duration-1000 ease-out delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg font-gazpacho font-bold text-gray-800">Hafiz Muhammad Abdul Basit</p>
          <p className="text-green-600 font-jost">CEO & Founder, Nature Harvest</p>
        </div>
      </div>
    </section>
  )
}

export default CEOMessage 