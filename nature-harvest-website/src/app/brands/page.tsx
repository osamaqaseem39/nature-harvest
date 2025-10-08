'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { apiService, Brand } from '../../lib/api'
import { config } from '../../lib/config'

const STICKY_HEADER_HEIGHT = 88 // px, adjust if your header is taller/shorter

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading brands...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pt-20">
      {/* Page Header */}
      <div className="pt-24 pb-16 text-center bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-gazpacho font-bold text-gray-800 mb-6 leading-tight">
            Our Brands
          </h1>
          <p className="text-xl font-jost text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our premium beverage brands, each crafted with care and commitment to quality. 
            From refreshing juices to pure waters, explore the story behind every sip.
          </p>
        </div>
      </div>

      {/* Brands Stack */}
      <div className="relative flex flex-col items-center pt-16 pb-24 bg-gradient-to-br from-green-50 via-white to-green-50" style={{ scrollBehavior: 'smooth' }}>
        {brands.map((brand, idx) => {
          const variant = idx % 2 === 0 ? "left" : "right"
          
          return (
            <section
              key={brand._id}
              className={`flex flex-col md:flex-row w-full max-w-[95vw] md:w-[900px] lg:w-[1200px] xl:w-[1600px] rounded-3xl overflow-hidden min-h-[400px] bg-white shadow-lg animate-fade-in-up${idx !== brands.length - 1 ? ' mb-12' : ''} self-center`}
              style={{
                position: "sticky",
                top: `${STICKY_HEADER_HEIGHT + (idx * 20)}px`, // Each card is slightly higher than the previous
                zIndex: idx + 1, // First card at the bottom, last card on top
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                transition: 'top 0.5s cubic-bezier(0.4,0,0.2,1)',
                animationDelay: `${idx * 200}ms`,
              }}
            >
              {/* Variant: image left or right */}
              {variant === "left" ? (
                <>
                  <div className="w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center bg-white relative overflow-hidden">
                    <Image
                      src={brand.logoUrl || brand.imageUrl || config.images.defaultBrandImage}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-contain p-8 transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = config.images.defaultBrandImage;
                      }}
                    />
                  </div>
                  {/* Separator */}
                  <div className="hidden md:block w-px bg-green-200 mx-4"></div>
                  <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-gazpacho font-bold mb-4 text-gray-800">{brand.name}</h2>
                    <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                      {brand.description || `Experience the premium quality and exceptional taste of ${brand.name}. Our commitment to excellence ensures every product meets the highest standards of freshness and flavor.`}
                    </p>
                    <Link 
                      href={`/products?type=brand&id=${brand._id}&name=${encodeURIComponent(brand.name)}`}
                      className="inline-flex items-center px-6 py-3 rounded-full bg-green-600 text-white font-jost font-semibold hover:bg-green-700 transition-colors duration-300 w-fit"
                    >
                      View Products
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-gazpacho font-bold mb-4 text-gray-800">{brand.name}</h2>
                    <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                      {brand.description || `Discover the unique character and premium quality of ${brand.name}. Every product is crafted with care, ensuring an exceptional experience that exceeds expectations.`}
                    </p>
                    <Link 
                      href={`/products?type=brand&id=${brand._id}&name=${encodeURIComponent(brand.name)}`}
                      className="inline-flex items-center px-6 py-3 rounded-full bg-green-600 text-white font-jost font-semibold hover:bg-green-700 transition-colors duration-300 w-fit"
                    >
                      View Products
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  {/* Separator */}
                  <div className="hidden md:block w-px bg-green-200 mx-4"></div>
                  <div className="w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center bg-white relative overflow-hidden">
                    <Image
                      src={brand.logoUrl || brand.imageUrl || config.images.defaultBrandImage}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-contain p-8 transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = config.images.defaultBrandImage;
                      }}
                    />
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-gazpacho font-bold text-gray-800 mb-4">
            Ready to Explore Our Products?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Explore our complete range of premium beverages and discover exceptional quality.
          </p>
          <Link 
            href="/products" 
            className="inline-flex bg-green-600 hover:bg-green-700 text-white font-jost font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-xl transform hover:scale-105 text-lg uppercase tracking-wide"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BrandsPage 