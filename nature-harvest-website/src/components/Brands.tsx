'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { apiService, Brand } from '../lib/api'
import { config } from '../lib/config'

const Brands = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Fallback brands when API is not available
  const fallbackBrands: Brand[] = [
    {
      _id: 'brand-1',
      name: 'FreshLay',
      description: 'Premium fresh beverages',
      imageUrl: '/images/brands/freshlay-logo.png',
      logoUrl: '/images/brands/freshlay-logo.png',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'brand-2',
      name: 'Nature Harvest',
      description: 'Natural and organic products',
      imageUrl: '/images/brands/nature-harvest-logo.png',
      logoUrl: '/images/brands/nature-harvest-logo.png',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'brand-3',
      name: 'Pure Life',
      description: 'Pure and healthy beverages',
      imageUrl: '/images/brands/pure-life-logo.png',
      logoUrl: '/images/brands/pure-life-logo.png',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

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
        setError(null) // Clear any previous errors
        const response = await apiService.getBrands()
        // Filter only active brands
        const activeBrands = response.data.filter(brand => brand.status === 'Active')
        console.log('Fetched brands:', activeBrands) // Debug log
        // Use API data if available, otherwise use fallback brands
        setBrands(activeBrands.length > 0 ? activeBrands : fallbackBrands)
      } catch (err) {
        console.error('Error fetching brands:', err)
        // On error, use fallback brands instead of showing error
        setBrands(fallbackBrands)
        setError(null) // Don't show error to users, just use fallback
        
        // Optional: Set a non-blocking error state for debugging
        if (config.development.debugMode) {
          console.warn('Brands: Using fallback data due to API error:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-green-50 via-green-100 to-green-50 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 sm:top-20 left-1/4 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-green-200 rounded-full"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-1/4 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-green-100 rounded-full"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
            OUR PREMIUM BRANDS
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-6 sm:mb-8 leading-tight px-4">
            Our Brand Portfolio
          </h2>
          <p className="text-sm sm:text-base lg:text-lg font-jost text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Discover our trusted brand partners and the diverse range of premium beverages we offer. Each brand represents our commitment to quality, innovation, and customer satisfaction.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`text-center py-8 sm:py-12 transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading brands...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`text-center py-8 sm:py-12 transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {/* Brands Grid */}
        {!loading && !error && brands.length > 0 && (
          <div className="flex flex-col items-center">
            {/* Brands Container */}
            {/* First Row */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-8 mb-6 sm:mb-8 lg:mb-12 transition-all duration-1000 ease-out delay-400 justify-items-center ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {brands.slice(0, Math.ceil(brands.length / 2)).map((brand, index) => (
                <div key={brand._id} className="flex justify-center">
                  <Link 
                    href={`/products?type=brand&id=${brand._id}&name=${encodeURIComponent(brand.name)}`}
                    className="flex items-center justify-center p-2 sm:p-3 lg:p-4 transition-all duration-500 transform hover:scale-110 group cursor-pointer"
                  >
                    <div className="relative">
                      <Image
                        src={brand.logoUrl || brand.imageUrl || `/images/brands/${brand.name.replace(/\s+/g, '')} Logo PET.jpg`}
                        alt={`${brand.name} logo`}
                        width={160}
                        height={120}
                        className="w-16 h-12 sm:w-20 sm:h-16 lg:w-40 lg:h-30 object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.log(`Image failed for ${brand.name}:`, target.src) // Debug log
                          // Try to use local brand image as fallback
                          const localBrandImage = `/images/brands/${brand.name.replace(/\s+/g, '')} Logo PET.jpg`;
                          console.log(`Trying fallback:`, localBrandImage) // Debug log
                          if (target.src !== localBrandImage) {
                            target.src = localBrandImage;
                          } else {
                            // If local image also fails, use a generic placeholder
                            target.src = '/images/logo.png';
                          }
                        }}
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Second Row */}
            {brands.length > Math.ceil(brands.length / 2) && (
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-8 mb-6 sm:mb-8 lg:mb-12 transition-all duration-1000 ease-out delay-600 justify-items-center ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {brands.slice(Math.ceil(brands.length / 2)).map((brand, index) => (
                  <div key={brand._id} className="flex justify-center">
                    <Link 
                      href={`/products?type=brand&id=${brand._id}&name=${encodeURIComponent(brand.name)}`}
                      className="flex items-center justify-center p-2 sm:p-3 lg:p-4 transition-all duration-500 transform hover:scale-110 group cursor-pointer"
                    >
                      <div className="relative">
                        <Image
                          src={brand.logoUrl || brand.imageUrl || `/images/brands/${brand.name.replace(/\s+/g, '')} Logo PET.jpg`}
                          alt={`${brand.name} logo`}
                          width={160}
                          height={120}
                          className="w-16 h-12 sm:w-20 sm:h-16 lg:w-40 lg:h-30 object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.log(`Image failed for ${brand.name}:`, target.src) // Debug log
                            // Try to use local brand image as fallback
                            const localBrandImage = `/images/brands/${brand.name.replace(/\s+/g, '')} Logo PET.jpg`;
                            console.log(`Trying fallback:`, localBrandImage) // Debug log
                            if (target.src !== localBrandImage) {
                              target.src = localBrandImage;
                            } else {
                              // If local image also fails, use a generic placeholder
                              target.src = '/images/logo.png';
                            }
                          }}
                        />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Brands State */}
        {!loading && !error && brands.length === 0 && (
          <div className={`text-center py-8 sm:py-12 transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-gray-600 text-sm sm:text-base">No brands available at the moment.</p>
          </div>
        )}

        {/* Call to Action Button */}
        <div className={`text-center transition-all duration-1000 ease-out delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Link 
            href="/products" 
            className="inline-flex bg-green-600 hover:bg-green-700 text-white font-jost font-semibold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all duration-300 hover:shadow-xl transform hover:scale-110 text-base sm:text-lg uppercase tracking-wide"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Brands 