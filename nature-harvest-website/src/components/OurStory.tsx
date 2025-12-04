'use client'

import { Calendar, MapPin, Target, Award, Globe, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// OurStory component for displaying company timeline and history
const OurStory = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
      year: "2020",
      title: "The Beginning",
      description: "Nature Harvest was founded with a simple vision: to create healthy, delicious beverages that bring joy to people's lives.",
      icon: Calendar
    },
    {
      year: "2021",
      title: "First Major Success",
      description: "Our flagship juice line and <span class=\"text-green-600 font-semibold\">dairy products</span> launched successfully internationally, gaining recognition for their exceptional taste and quality standards.",
      icon: Target
    },
    {
      year: "2022",
      title: "Rapid Growth",
      description: "Expanded operations across major international cities and established strong partnerships with local retailers and distributors.",
      icon: MapPin
    },
    {
      year: "2023",
      title: "Innovation Leader",
      description: "Expanding our product range to include premium <span class=\"text-green-600 font-semibold\">flavored milk</span> and <span class=\"text-green-600 font-semibold\">tea whiteners</span>, continuing to innovate with cutting-edge technology while maintaining our commitment to natural, healthy ingredients for international consumers.",
      icon: Award
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Reached new markets worldwide, strengthening our global presence while maintaining sustainable practices and building stronger connections with communities internationally.",
      icon: Globe
    },
    {
      year: "2025",
      title: "Sustainable Future",
      description: "Leading the industry in sustainable practices and innovative product development, setting new standards for healthy beverages and <span class=\"text-green-600 font-semibold\">dairy products</span> that benefit people and the planet worldwide.",
      icon: TrendingUp
    }
  ]

  return (
    <section ref={sectionRef} className="relative pt-32 pb-24 overflow-hidden" style={{ backgroundColor: '#f2eecc' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
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
            From humble beginnings to becoming a respected beverage and <span className="text-green-600 font-semibold">dairy company</span>, our journey has been driven by passion, innovation, and an unwavering commitment to quality for international consumers. We proudly offer premium juices, <span className="text-green-600 font-semibold">flavored milk</span>, and <span className="text-green-600 font-semibold">tea whiteners</span>.
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
                  Nature Harvest began as a small business with a big dream. Our founders, Hafiz Muhammad Abdul Basit and Muhammad Omar Khan, 
                  envisioned a world where healthy beverages and <span className="text-green-600 font-semibold">dairy products</span> could be both delicious and accessible to everyone internationally.
                </p>
                <p className="text-lg font-jost text-gray-700 leading-relaxed">
                  What started in a small facility has grown into a respected beverage and <span className="text-green-600 font-semibold">dairy company</span>, offering premium juices, <span className="text-green-600 font-semibold">flavored milk</span>, and <span className="text-green-600 font-semibold">tea whiteners</span>. Our core values remain unchanged: 
                  quality, innovation, and a deep respect for nature and our international customers.
                </p>
              </div>

              <div>
                <h4 className="text-2xl font-gazpacho font-bold text-gray-800 mb-4">
                  Innovation at Our Core
                </h4>
                <p className="text-lg font-jost text-gray-700 leading-relaxed">
                  We've consistently pushed the boundaries of what's possible in beverage and <span className="text-green-600 font-semibold">dairy manufacturing</span> internationally, 
                  from developing unique flavor combinations in our juices and <span className="text-green-600 font-semibold">flavored milk</span> to creating premium <span className="text-green-600 font-semibold">tea whiteners</span> and implementing sustainable production methods. 
                  Our research and development team works tirelessly to create products that exceed international consumer expectations.
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
                      <p className="text-gray-600 font-jost leading-relaxed" dangerouslySetInnerHTML={{ __html: item.description }} />
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
            <Link 
              href="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-jost font-semibold uppercase tracking-wider px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore Our Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory 