'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { apiService, Product } from '../lib/api'
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
  }
  createdAt: string
  updatedAt: string
}

const DemoProducts = () => {
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
      imageUrl: '/images/brands/AquaLife Water Logo PET.jpg',
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
          limit: config.pagination.demoProductsLimit,
          status: 'Active'
        })
        // Use API data if available, otherwise use fallback products
        setProducts(response.data.length > 0 ? response.data : fallbackProducts)
      } catch (err) {
        console.error('Error fetching demo products:', err)
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
      <section ref={sectionRef} className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-jost">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section ref={sectionRef} className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 font-jost">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-green-200 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-100 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-4">
            DEMO PRODUCTS
          </h3>
          <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 leading-tight">
            Experience Our Premium Collection
          </h2>
          <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto mt-6">
            Discover the taste and quality that makes Nature Harvest the preferred choice for health-conscious consumers.
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12 transition-all duration-1000 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {products.map((product, index) => (
            <div 
              key={product._id} 
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 transition-all duration-1000 ease-out delay-${600 + index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Product Image Container */}
              <div className="relative h-64 bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    product.status === 'Active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.status}
                  </span>
                </div>

                {/* Brand & Size Info */}
                <div className="absolute top-4 right-4 text-right z-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <p className="text-xs font-jost font-semibold text-green-600">
                      {product.brandId?.name || 'Nature Harvest'}
                    </p>
                    {product.sizeId?.name && (
                      <p className="text-xs font-jost text-gray-500">{product.sizeId.name}</p>
                    )}
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative w-full h-full p-6">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-700 hover:scale-110"
                  />
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-green-50 transition-colors duration-200">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-green-50 transition-colors duration-200">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category & Rating */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-green-600 font-medium font-jost">
                    {getProductCategory(product)}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1 font-jost">4.8</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="text-xl font-gazpacho font-bold text-gray-800 mb-3 leading-tight">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 font-jost leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {/* Flavor Info */}
                {product.flavorId?.name && (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 font-jost">Flavor: </span>
                    <span className="text-sm font-jost font-medium text-green-600">{product.flavorId.name}</span>
                  </div>
                )}

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-gazpacho font-bold text-gray-800">$12.99</span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-jost font-medium">
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center transition-all duration-1000 ease-out delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button className="bg-green-600 hover:bg-green-700 text-white font-jost font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-xl transform hover:scale-105 text-lg">
            View All Products
          </button>
        </div>
      </div>
    </section>
  )
}

export default DemoProducts 