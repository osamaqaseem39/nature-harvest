'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { apiService, Brand } from '../lib/api'
import { config } from '../lib/config'

const Brands = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const response = await apiService.getBrands()
        // Filter only active brands
        const activeBrands = response.data.filter(brand => brand.status === 'Active')
        setBrands(activeBrands)
      } catch (err) {
        console.error('Error fetching brands:', err)
        setError('Failed to load brands')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-green-200 rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-4">
            OUR PREMIUM BRANDS
          </h3>
          <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-8 leading-tight">
            Our Brand Portfolio
          </h2>
          <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our trusted brand partners and the diverse range of premium beverages we offer. Each brand represents our commitment to quality, innovation, and customer satisfaction.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`text-center py-12 transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading brands...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`text-center py-12 transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Brands Grid */}
        {!loading && !error && brands.length > 0 && (
          <>
            {/* First Row */}
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12 transition-all duration-1000 ease-out delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {brands.slice(0, Math.ceil(brands.length / 2)).map((brand, index) => (
                <div key={brand._id} className="flex justify-center">
                  <div className="flex items-center justify-center p-4 transition-all duration-500 transform hover:scale-110 group">
                    <div className="relative">
                      <Image
                        src={brand.logoUrl || brand.imageUrl || config.images.defaultBrandImage}
                        alt={`${brand.name} logo`}
                        width={160}
                        height={120}
                        className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = config.images.defaultBrandImage;
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row */}
            {brands.length > Math.ceil(brands.length / 2) && (
              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12 transition-all duration-1000 ease-out delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {brands.slice(Math.ceil(brands.length / 2)).map((brand, index) => (
                  <div key={brand._id} className="flex justify-center">
                    <div className="flex items-center justify-center p-4 transition-all duration-500 transform hover:scale-110 group">
                      <div className="relative">
                        <Image
                          src={brand.logoUrl || brand.imageUrl || config.images.defaultBrandImage}
                          alt={`${brand.name} logo`}
                          width={160}
                          height={120}
                          className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = config.images.defaultBrandImage;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* No Brands State */}
        {!loading && !error && brands.length === 0 && (
          <div className={`text-center py-12 transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-gray-600">No brands available at the moment.</p>
          </div>
        )}

        {/* Call to Action Button */}
        <div className={`text-center transition-all duration-1000 ease-out delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <a 
            href="/products" 
            className="inline-flex bg-green-400 hover:bg-green-500 text-white font-jost font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-xl transform hover:scale-110 text-lg uppercase tracking-wide"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}

export default Brands 