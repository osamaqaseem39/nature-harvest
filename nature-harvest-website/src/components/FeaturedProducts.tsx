'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { apiService } from '../lib/api'
import { config } from '../lib/config'

interface Product {
  _id: string
  name: string
  description: string
  imageUrl?: string
  status: string
  brandId?: {
    _id: string
    name: string
    logoUrl?: string
  }
  sizeId?: {
    _id: string
    name: string
    description?: string
  }
  flavorId?: {
    _id: string
    name: string
    description?: string
    imageUrl?: string
  }
  createdAt: string
  updatedAt: string
}

const FeaturedProducts = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fallback hardcoded products when API has no data
  const fallbackProducts: Product[] = [
    {
      _id: 'fallback-1',
      name: 'FreshLay Apple Juice',
      description: 'Premium apple juice made from hand-picked fresh apples. Rich in vitamins and natural sweetness.',
      imageUrl: '/images/125ml Mock FreshLay Apple L.png',
      status: 'Active',
      brandId: {
        _id: 'brand-1',
        name: 'FreshLay',
        logoUrl: '/images/brands/FreshLay Logo PET.jpg'
      },
      sizeId: {
        _id: 'size-1',
        name: '125ml',
        description: 'Perfect single serving size'
      },
      flavorId: {
        _id: 'flavor-1',
        name: 'Apple',
        description: 'Natural apple flavor'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'fallback-2',
      name: 'FreshLay Mango Delight',
      description: 'Exotic mango juice bursting with tropical flavors. Perfect for a refreshing summer drink.',
      imageUrl: '/images/125ml Mock FreshLay Mango L.png',
      status: 'Active',
      brandId: {
        _id: 'brand-2',
        name: 'FreshLay',
        logoUrl: '/images/brands/FreshLay Logo PET.jpg'
      },
      sizeId: {
        _id: 'size-2',
        name: '125ml',
        description: 'Perfect single serving size'
      },
      flavorId: {
        _id: 'flavor-2',
        name: 'Mango',
        description: 'Tropical mango flavor'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'fallback-3',
      name: 'Funtastic Orange Blast',
      description: 'Zesty orange juice with a perfect balance of sweetness and tanginess.',
      imageUrl: '/images/125ml Mock FreshLay Apple R.png',
      status: 'Active',
      brandId: {
        _id: 'brand-3',
        name: 'Funtastic',
        logoUrl: '/images/brands/Funtastic Logo PET.jpg'
      },
      sizeId: {
        _id: 'size-3',
        name: '125ml',
        description: 'Perfect single serving size'
      },
      flavorId: {
        _id: 'flavor-3',
        name: 'Orange',
        description: 'Citrus orange flavor'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'fallback-4',
      name: 'AquaLife Pure Water',
      description: 'Pure mineral water sourced from natural springs. Essential hydration for daily wellness.',
      imageUrl: '/images/125ml Mock FreshLay Apple L.png',
      status: 'Active',
      brandId: {
        _id: 'brand-4',
        name: 'AquaLife',
        logoUrl: '/images/brands/AquaLife Water Logo PET.jpg'
      },
      sizeId: {
        _id: 'size-4',
        name: '500ml',
        description: 'Standard bottle size'
      },
      flavorId: {
        _id: 'flavor-4',
        name: 'Natural',
        description: 'Pure natural water'
      },
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
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null) // Clear any previous errors
        console.log('Products: Starting API call...')
        const response = await apiService.getProducts({
          page: 1,
          limit: config.pagination.featuredProductsLimit,
          status: 'Active'
        })
        console.log('Products Response:', response)
        console.log('Products Array:', response?.data)
        
        if (!response || !response.data) {
          console.warn('Products: Invalid response structure, using fallback')
          setProducts(fallbackProducts)
          return
        }
        
        // Use API data if available, otherwise use fallback products
        setProducts(response.data.length > 0 ? response.data : fallbackProducts)
      } catch (err) {
        console.error('Error fetching featured products:', err)
        // On error, use fallback products instead of showing error
        setProducts(fallbackProducts)
        setError(null) // Don't show error to users, just use fallback
        
        // Optional: Set a non-blocking error state for debugging
        if (config.development.debugMode) {
          console.warn('FeaturedProducts: Using fallback data due to API error:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getProductImage = (product: Product) => {
    if (product.imageUrl) {
      return product.imageUrl
    }
    if (product.brandId?.logoUrl) {
      return product.brandId.logoUrl
    }
    // Fallback to a default image
    return config.images.defaultProductImage
  }

  const getFlavorImage = (product: Product): string => {
    // First, try to use the flavor's imageUrl from the database
    if (product.flavorId?.imageUrl) {
      return product.flavorId.imageUrl
    }
    
    // Fallback to hardcoded mapping if no database image
    const flavorName = product.flavorId?.name?.toLowerCase() || ''
    
    if (flavorName.includes('orange')) {
      return '/images/orange.png'
    } else if (flavorName.includes('strawberry')) {
      return '/images/strawberry.png'
    } else if (flavorName.includes('pineapple')) {
      return '/images/pineapple.png'
    } else if (flavorName.includes('apple')) {
      return '/images/orange.png' // Using orange as fallback for apple
    } else if (flavorName.includes('mango')) {
      return '/images/pineapple.png' // Using pineapple as fallback for mango
    }
    
    // Fallback to a default image if no specific flavor match
    return '/images/orange.png'
  }

  const getProductCategory = (product: Product) => {
    if (product.flavorId?.name) {
      return product.flavorId.name
    }
    if (product.sizeId?.name) {
      return product.sizeId.name
    }
    return 'Beverage'
  }

  if (loading) {
    return (
      <section ref={sectionRef} className="relative bg-white pt-32 pb-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-jost">Loading featured products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
          <section ref={sectionRef} className="relative bg-white pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-5 sm:top-10 right-10 sm:right-20 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-5 sm:bottom-10 left-10 sm:left-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-green-200 rounded-full"></div>
      </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
            FEATURED PRODUCTS
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 leading-tight px-4">
            Experience Our Premium Collection
          </h2>
          <p className="text-sm sm:text-base lg:text-lg font-jost text-gray-600 max-w-3xl mx-auto mt-4 sm:mt-6 px-4">
            Discover the taste and quality that makes Nature Harvest the preferred choice for health-conscious consumers.
          </p>
        </div>

        {/* Individual Product Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12 transition-all duration-1000 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {products.slice(0, 8).map((product, index) => (
            <div 
              key={product._id} 
              className={`relative transition-all duration-1000 ease-out delay-${600 + index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } block group hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
              onClick={() => router.push(`/products/${product._id}`)}
            >
              {/* Product Image Container - No Background Container */}
              <div className="relative overflow-hidden">
                {/* Brand Tag - Top Left */}
                <div className="absolute top-1 sm:top-2 left-1 z-10">
                  <div 
                    className="block"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.brandId?._id) {
                        router.push(`/products?type=brand&id=${product.brandId._id}&name=${encodeURIComponent(product.brandId.name)}`);
                      }
                    }}
                  >
                    <div className="bg-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex flex-col items-center justify-center border border-gray-200 transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 shadow-lg cursor-pointer">
                      <span className="text-green-600 font-gazpacho font-bold text-xs">
                        {product.brandId?.name || 'Nature Harvest'}
                      </span>
                      <span className="text-green-600 font-jost font-medium text-xs">
                        {product.sizeId?.name || '125 ML'}
                      </span>
                    </div>
                  </div>
                </div>

              
                {/* Main Product Image */}
                <div className="relative w-full p-2 sm:p-3 lg:p-4">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    width={200}
                    height={250}
                    className="w-full h-auto object-contain transition-all duration-500"
                  />
                </div>

                {/* Flavor Image - Bottom Left */}
                <div className="absolute bottom-0 left-16 sm:left-24 lg:left-28">
                  <div 
                    className="block"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.flavorId?._id) {
                        router.push(`/products?type=flavor&id=${product.flavorId._id}&name=${encodeURIComponent(product.flavorId.name)}`);
                      }
                    }}
                  >
                    <Image
                      src={getFlavorImage(product)}
                      alt={product.flavorId?.name || 'Flavor'}
                      width={80}
                      height={80}
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* No Product Info Section - Clean Minimal Design */}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center transition-all duration-1000 ease-out delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Link 
            href="/products" 
            className="inline-flex bg-green-400 hover:bg-green-500 text-white font-jost font-semibold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all duration-300 hover:shadow-xl transform hover:scale-105 text-base sm:text-lg uppercase tracking-wide"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 