'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Sparkles, Milk, Coffee, Heart, Droplet } from 'lucide-react'
import { apiService, Brand } from '../../lib/api'
import { config } from '../../lib/config'

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Fallback brands to display when API has no data
  const fallbackBrands: Brand[] = [
    {
      _id: 'fallback-1',
      name: 'FreshLay',
      description: 'Premium juice brand offering a wide range of natural fruit juices. FreshLay brings you the authentic taste of fresh fruits in every sip.',
      logoUrl: '/images/brands/FreshLay Logo PET.jpg',
      imageUrl: '/images/brands/FreshLay Logo PET.jpg',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'fallback-2',
      name: 'Funtastic',
      description: 'Fun and flavorful juices that bring joy to every moment. Funtastic offers exciting taste experiences for the whole family.',
      logoUrl: '/images/brands/Funtastic Logo PET.jpg',
      imageUrl: '/images/brands/Funtastic Logo PET.jpg',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'fallback-3',
      name: 'AquaLife',
      description: 'Pure, refreshing water sourced from natural springs. AquaLife ensures you stay hydrated with the finest quality water.',
      logoUrl: '/images/brands/AquaLife Water Logo PET.jpg',
      imageUrl: '/images/brands/AquaLife Water Logo PET.jpg',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  useEffect(() => {
    // Set visible immediately for hero section
    setIsVisible(true)
    
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
        setError(null)
        const response = await apiService.getBrands()
        
        console.log('Brands API Response:', response)
        console.log('Brands Data:', response?.data)
        
        // Check if response has data
        if (!response || !response.data) {
          console.warn('No brands data in response, using fallback')
          setBrands(fallbackBrands)
          setLoading(false)
          return
        }
        
        // Filter only active brands
        const activeBrands = Array.isArray(response.data) 
          ? response.data.filter(brand => brand.status === 'Active') 
          : []
        
        console.log('Active brands:', activeBrands)
        console.log('Active brands count:', activeBrands.length)
        
        // Use API data if available, otherwise use fallback brands
        if (activeBrands.length > 0) {
          console.log('Setting brands from API:', activeBrands)
          setBrands(activeBrands)
        } else {
          console.log('No active brands found, using fallback')
          setBrands(fallbackBrands)
        }
      } catch (err) {
        console.error('Error fetching brands:', err)
        // On error, use fallback brands instead of showing error
        setBrands(fallbackBrands)
        setError(null) // Don't show error to users, just use fallback
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50">
      {/* Hero Header Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-green-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-green-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="opacity-100 translate-y-0">
            <div className="mb-6">
              <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm">
                OUR BRANDS
              </h3>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-gazpacho font-bold text-gray-800 mb-6 leading-tight">
              Discover Our Premium Collection
            </h1>
            <p className="text-lg sm:text-xl font-jost text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Each brand represents our commitment to excellence, quality, and innovation. 
              Explore the unique stories and exceptional products—from premium juices to <span className="text-green-600 font-semibold">flavored milk</span> and <span className="text-green-600 font-semibold">tea whiteners</span>—that define Nature Harvest.
            </p>
          </div>
        </div>
      </section>

      {/* Brands Grid Section */}
      <section ref={sectionRef} className="relative pb-24 bg-gradient-to-br from-green-50 via-green-100 to-green-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {brands.length === 0 && !loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <Sparkles className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-gazpacho font-bold text-gray-800 mb-4">No Brands Available</h3>
              <p className="text-gray-600 font-jost">Check back soon for our exciting brand collection!</p>
            </div>
          ) : brands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {brands.map((brand, index) => (
              <Link
                key={brand._id}
                href={`/products?type=brand&id=${brand._id}&name=${encodeURIComponent(brand.name)}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 opacity-100 translate-y-0 cursor-pointer block"
                style={{
                  transitionDelay: `${index * 50}ms`
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
                      src={brand.imageUrl || brand.logoUrl || config.images.defaultBrandImage}
                      alt={`${brand.name} logo`}
                      width={300}
                      height={200}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.log('Image error for brand:', brand.name, 'trying fallback')
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

                  <div className="inline-flex items-center group/link text-green-600 font-jost font-semibold transition-colors duration-300">
                    <span>Explore Products</span>
                    <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Dairy Products Showcase Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-green-100 to-green-50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-4">
              Our Complete <span className="text-green-600">Product Range</span>
            </h2>
            <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto">
              Nature Harvest offers a complete range of premium juices. From refreshing <span className="text-green-600 font-semibold">premium juices</span> to delicious <span className="text-green-600 font-semibold">flavored milk</span> and quality <span className="text-green-600 font-semibold">tea whiteners</span>, all crafted with the same commitment to quality and natural goodness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
            {/* Premium Juices Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-green-100">
              <div className="flex items-start mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <Droplet className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-2">
                    Premium <span className="text-green-600">Juices</span>
                  </h3>
                  <div className="w-16 h-1 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-600 font-jost leading-relaxed mb-6 text-lg">
                Experience the authentic taste of nature's finest fruits in every sip. Our premium juices are made from fresh, hand-picked fruits, bringing you pure flavors and essential nutrients. Refreshing, natural, and delicious.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-gazpacho font-bold text-green-600 mb-1">Fresh</div>
                  <div className="text-sm font-jost text-gray-600">Fruits</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-gazpacho font-bold text-green-600 mb-1">100%</div>
                  <div className="text-sm font-jost text-gray-600">Natural</div>
                </div>
              </div>
              <div className="flex items-center text-green-600 font-jost font-semibold">
                <Heart className="w-5 h-5 mr-2 fill-green-600" />
                <span>Nature's finest flavors</span>
              </div>
            </div>
            {/* Flavored Milk Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-green-100">
              <div className="flex items-start mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <Milk className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-2">
                    Premium <span className="text-green-600">Flavored Milk</span>
                  </h3>
                  <div className="w-16 h-1 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-600 font-jost leading-relaxed mb-6 text-lg">
                Indulge in our rich and creamy flavored milk varieties. Made with premium dairy and natural flavors, our flavored milk brings you the perfect balance of nutrition and taste. Perfect for all ages, from kids to adults.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-gazpacho font-bold text-green-600 mb-1">100%</div>
                  <div className="text-sm font-jost text-gray-600">Natural</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-gazpacho font-bold text-green-600 mb-1">Rich</div>
                  <div className="text-sm font-jost text-gray-600">Creamy</div>
                </div>
              </div>
              <div className="flex items-center text-green-600 font-jost font-semibold">
                <Heart className="w-5 h-5 mr-2 fill-green-600" />
                <span>Loved by families worldwide</span>
              </div>
            </div>

            {/* Tea Whitener Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-green-100">
              <div className="flex items-start mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <Coffee className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-2">
                    Quality <span className="text-green-600">Tea Whiteners</span>
                  </h3>
                  <div className="w-16 h-1 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-600 font-jost leading-relaxed mb-6 text-lg">
                Enhance your tea experience with our premium tea whiteners. Specially formulated to create the perfect cup of tea, our tea whiteners blend seamlessly while maintaining the authentic taste you love. Quality you can trust in every sip.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-gazpacho font-bold text-green-600 mb-1">Premium</div>
                  <div className="text-sm font-jost text-gray-600">Quality</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-gazpacho font-bold text-green-600 mb-1">Perfect</div>
                  <div className="text-sm font-jost text-gray-600">Blend</div>
                </div>
              </div>
              <div className="flex items-center text-green-600 font-jost font-semibold">
                <Heart className="w-5 h-5 mr-2 fill-green-600" />
                <span>Trusted by tea lovers</span>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 lg:p-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-gazpacho font-bold mb-4">
                Why Choose Our Products?
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-gazpacho font-bold mb-2">Premium Ingredients</h4>
                <p className="text-green-100 font-jost text-sm">
                  Made with the finest fruits, dairy, and natural flavors
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-gazpacho font-bold mb-2">Fresh Daily</h4>
                <p className="text-green-100 font-jost text-sm">
                  Produced with care to ensure maximum freshness
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-gazpacho font-bold mb-2">Family Favorite</h4>
                <p className="text-green-100 font-jost text-sm">
                  Loved by families for quality and taste
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Features Section */}
      {brands.length > 0 && (
        <section className="relative py-20 bg-gradient-to-br from-green-50 via-green-100 to-green-50 overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-4">
                Why Choose Our Brands?
              </h2>
              <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto">
                Each brand in our portfolio is carefully crafted to deliver exceptional quality and taste
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-gazpacho font-bold text-gray-800 mb-3">Premium Quality</h3>
                <p className="text-gray-600 font-jost leading-relaxed">
                  Every brand meets our strict quality standards, ensuring the best taste and nutrition in every product.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-gazpacho font-bold text-gray-800 mb-3">Natural Ingredients</h3>
                <p className="text-gray-600 font-jost leading-relaxed">
                  We use only the finest natural ingredients, from fresh fruits to premium <span className="text-green-600 font-semibold">dairy products</span>.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-gazpacho font-bold text-gray-800 mb-3">Customer Trust</h3>
                <p className="text-gray-600 font-jost leading-relaxed">
                  Trusted by millions of customers worldwide who love our juices, <span className="text-green-600 font-semibold">flavored milk</span>, and <span className="text-green-600 font-semibold">tea whiteners</span>.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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
              Browse through our entire range of premium juices and <span className="text-white font-semibold">dairy products</span>—including <span className="text-white font-semibold">flavored milk</span> and <span className="text-white font-semibold">tea whiteners</span>—and discover the perfect taste for every moment.
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
