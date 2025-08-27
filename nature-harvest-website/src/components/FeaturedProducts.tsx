'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
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
        const response = await apiService.getProducts({
          page: 1,
          limit: config.pagination.featuredProductsLimit,
          status: 'Active'
        })
        // Use API data if available, otherwise use fallback products
        setProducts(response.data.length > 0 ? response.data : fallbackProducts)
      } catch (err) {
        console.error('Error fetching featured products:', err)
        // On error, use fallback products instead of showing error
        setProducts(fallbackProducts)
        setError(null)
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
      <section ref={sectionRef} className="relative bg-gradient-to-br from-white via-green-50 to-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-jost">Loading featured products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-white via-green-50 to-white py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-4">
            FEATURED PRODUCTS
          </h3>
          <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 leading-tight">
            Experience Our Premium Collection
          </h2>
          <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto mt-6">
            Discover the taste and quality that makes Nature Harvest the preferred choice for health-conscious consumers.
          </p>
        </div>

        {/* Individual Product Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transition-all duration-1000 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {products.slice(0, 8).map((product, index) => (
            <div 
              key={product._id} 
              className={`relative transition-all duration-1000 ease-out delay-${600 + index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Product Image Container - No Background Container */}
              <div className="relative overflow-hidden">
                {/* Brand Tag - Top Left */}
                <div className="absolute top-2 left-1 z-10">
                  <a 
                    href={product.brandId?._id ? `/filter?type=brand&id=${product.brandId._id}&name=${encodeURIComponent(product.brandId.name)}` : '#'}
                    className="block"
                  >
                    <div className="bg-white rounded-full w-20 h-20 flex flex-col items-center justify-center border border-gray-200 transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 shadow-lg cursor-pointer">
                      <span className="text-green-600 font-gazpacho font-bold text-sm">
                        {product.brandId?.name || 'Nature Harvest'}
                      </span>
                      <span className="text-green-600 font-jost font-medium text-xs">
                        {product.sizeId?.name || '125 ML'}
                      </span>
                    </div>
                  </a>
                </div>

              
                {/* Main Product Image */}
                <div className="relative w-full p-8">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="object-contain transition-all duration-500 hover:scale-105 hover:-rotate-6"
                  />
                </div>

                {/* Flavor Image - Bottom Left */}
                <div className="absolute bottom-0 left-40">
                  <a 
                    href={product.flavorId?._id ? `/filter?type=flavor&id=${product.flavorId._id}&name=${encodeURIComponent(product.flavorId.name)}` : '#'}
                    className="block"
                  >
                    <Image
                      src={getFlavorImage(product)}
                      alt={product.flavorId?.name || 'Flavor'}
                      width={180}
                      height={180}
                      className="object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                    />
                  </a>
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
          <a 
            href="/products" 
            className="inline-flex bg-green-400 hover:bg-green-500 text-white font-jost font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-xl transform hover:scale-105 text-lg uppercase tracking-wide"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 