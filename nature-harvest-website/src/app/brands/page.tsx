'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Sparkles } from 'lucide-react'
import { apiService, Brand } from '../../lib/api'
import { config } from '../../lib/config'

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-jost">Loading brands...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-white">
        <div className="text-center">
          <p className="text-red-600 text-lg font-jost">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-jost"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Hero Header Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-green-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm">
                OUR BRANDS
              </h3>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-gazpacho font-bold text-gray-800 mb-6 leading-tight">
              Discover Our Premium Collection
            </h1>
            <p className="text-lg sm:text-xl font-jost text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Each brand represents our commitment to excellence, quality, and innovation. 
              Explore the unique stories and exceptional products that define Nature Harvest.
            </p>
          </div>
        </div>
      </section>

      {/* Brands Grid Section */}
      <section ref={sectionRef} className="relative pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {brands.map((brand, index) => (
              <div
                key={brand._id}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/10 group-hover:to-green-600/10 transition-all duration-500 z-10"></div>
                
                {/* Brand Logo Section */}
                <div className="relative h-64 bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-300 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                  </div>
                  <div className="relative z-20 w-full h-full flex items-center justify-center">
                    <Image
                      src={brand.logoUrl || brand.imageUrl || config.images.defaultBrandImage}
                      alt={`${brand.name} logo`}
                      width={300}
                      height={200}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = config.images.defaultBrandImage;
                      }}
                    />
                  </div>
                </div>

                {/* Brand Content Section */}
                <div className="relative z-20 p-8 bg-white">
                  <div className="mb-4">
                    <h2 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                      {brand.name}
                    </h2>
                    <div className="w-16 h-1 bg-green-600 rounded-full transform group-hover:w-24 transition-all duration-300"></div>
                  </div>
                  
                  <p className="text-gray-600 font-jost leading-relaxed mb-6 line-clamp-3">
                    {brand.description || `Experience the premium quality and exceptional taste of ${brand.name}. Our commitment to excellence ensures every product meets the highest standards.`}
                  </p>

                  <Link 
                    href={`/products?type=brand&id=${brand._id}&name=${encodeURIComponent(brand.name)}`}
                    className="inline-flex items-center group/link text-green-600 font-jost font-semibold hover:text-green-700 transition-colors duration-300"
                  >
                    <span>Explore Products</span>
                    <ChevronRight className="ml-2 w-5 h-5 transform group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-gazpacho font-bold text-white mb-6">
              Ready to Explore Our Complete Collection?
            </h2>
            <p className="text-lg sm:text-xl font-jost text-green-100 mb-8 max-w-2xl mx-auto">
              Browse through our entire range of premium beverages and discover the perfect taste for every moment.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center bg-white text-green-600 font-jost font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-2xl transform hover:scale-105 text-lg uppercase tracking-wide group"
            >
              <span>View All Products</span>
              <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BrandsPage
