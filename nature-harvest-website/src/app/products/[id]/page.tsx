'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Leaf, Zap, Droplets, Scale, Home, ChevronRight, MessageCircle, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { apiService, Product } from '../../../lib/api'
import { config } from '../../../lib/config'
import StructuredData from '@/components/StructuredData'
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo'
import { isObjectId, generateProductSlug } from '../../../lib/slug'

const ProductDetailContent = () => {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const productSlugOrId = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        let response
        
        // If it looks like an ObjectId, try direct fetch first
        if (isObjectId(productSlugOrId)) {
          try {
            response = await apiService.getProduct(productSlugOrId)
          } catch {
            // If direct fetch fails, try slug lookup
            response = await apiService.getProductBySlug(productSlugOrId)
            if (!response) {
              throw new Error('Product not found')
            }
          }
        } else {
          // It's a slug, search for it
          response = await apiService.getProductBySlug(productSlugOrId)
          if (!response) {
            throw new Error('Product not found')
          }
        }

        setProduct(response.data)
        // Set the main product image as selected by default
        if (response.data.imageUrl) {
          setSelectedImage(response.data.imageUrl)
        } else if (response.data.brandId?.logoUrl) {
          setSelectedImage(response.data.brandId.logoUrl)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    if (productSlugOrId) {
      fetchProduct()
    }
  }, [productSlugOrId])

  // Reset navigation state when product changes
  useEffect(() => {
    setIsNavigating(false)
  }, [product])

  const getProductImage = (product: Product) => {
    if (product.imageUrl) {
      return product.imageUrl
    }
    if (product.brandId?.logoUrl) {
      return product.brandId.logoUrl
    }
    return config.images.defaultProductImage
  }

  const getFlavorImage = (product: Product): string => {
    if (product.flavorId?.imageUrl) {
      return product.flavorId.imageUrl
    }
    
    const flavorName = product.flavorId?.name?.toLowerCase() || ''
    
    if (flavorName.includes('orange')) {
      return '/images/orange.png'
    } else if (flavorName.includes('strawberry')) {
      return '/images/strawberry.png'
    } else if (flavorName.includes('pineapple')) {
      return '/images/pineapple.png'
    } else if (flavorName.includes('apple')) {
      return '/images/orange.png'
    } else if (flavorName.includes('mango')) {
      return '/images/pineapple.png'
    }
    
    return '/images/orange.png'
  }

  const getNutrientValue = (value?: number | string, unit: string = '') => {
    if (value === undefined || value === null) return 'N/A'
    // If it's a string, just return it (might already include unit or be descriptive text)
    if (typeof value === 'string') return value
    return `${value}${unit}`
  }

  const getNutrientPercentage = (value?: number | string, dailyValue: number = 100) => {
    if (value === undefined || value === null) return 0
    // If it's a string, try to parse it as a number
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return 0
    return Math.round((numValue / dailyValue) * 100)
  }

  const hasNutrients = (nutrients?: Product['nutrients']): nutrients is NonNullable<Product['nutrients']> => {
    if (!nutrients) return false
    return Object.values(nutrients).some(value => value !== undefined && value !== null)
  }

  const handleGetQuote = async () => {
    setIsNavigating(true)
    
    try {
      // Navigate to contact page with product information
      const productInfo = {
        productName: product?.name || 'Product',
        productId: product?._id || '',
        brandName: product?.brandId?.name || '',
        flavorName: product?.flavorId?.name || '',
        sizeName: product?.sizeId?.name || ''
      }
      
      // Create query string with product information
      const queryParams = new URLSearchParams({
        product: productInfo.productName,
        productId: productInfo.productId,
        brand: productInfo.brandName,
        flavor: productInfo.flavorName,
        size: productInfo.sizeName,
        type: 'quote'
      })
      
      await router.push(`/contact?${queryParams.toString()}`)
    } catch (error) {
      console.error('Error navigating to quote page:', error)
      setIsNavigating(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Product',
          text: product?.description || 'Check out this amazing product!',
          url: window.location.href,
        })
        setShowShareMenu(false)
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Show share menu if Web Share API is not available
      setShowShareMenu(!showShareMenu)
    }
  }

  const handleWhatsAppShare = () => {
    const url = window.location.href
    const text = `${product?.name || 'Product'}\n\n${product?.description || 'Check out this amazing product!'}\n\n${url}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
    setShowShareMenu(false)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
      setShowShareMenu(false)
    } catch (error) {
      console.log('Error copying to clipboard:', error)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Here you could also save to localStorage or send to backend
    if (!isFavorite) {
      alert('Product added to favorites!')
    } else {
      alert('Product removed from favorites!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-jost text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-gazpacho">
            {error || 'Product not found'}
          </h3>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Generate structured data
  const structuredData = product ? (() => {
    const productSlug = generateProductSlug(product.name, product._id)
    const productUrl = `${config.site.url}/products/${productSlug}`
    
    return [
      generateProductSchema({
        name: product.name,
        description: product.description || `${product.name} from Nature Harvest`,
        image: product.imageUrl || product.brandId?.logoUrl || `${config.site.url}/images/logo.png`,
        brand: product.brandId?.name || 'Nature Harvest',
        category: 'Beverages',
        url: productUrl,
      }),
      generateBreadcrumbSchema([
        { name: 'Home', url: config.site.url },
        { name: 'Products', url: `${config.site.url}/products` },
        { name: product.name, url: productUrl },
      ]),
    ]
  })() : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white pt-20">
      {product && <StructuredData data={structuredData} />}
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-600 mb-8">
            <Link href="/" className="flex items-center hover:text-green-600 transition-colors duration-200">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/products" className="hover:text-green-600 transition-colors duration-200">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-800 font-medium">{product?.name || 'Product'}</span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200 font-jost mb-6 lg:mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Products</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Product Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
            
            {/* Product Images */}
            <div className="space-y-4 lg:space-y-6">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl shadow-lg p-4 lg:p-8 border border-gray-100">
                <div className="max-w-md mx-auto h-96 flex items-center justify-center">
                  <Image
                    src={selectedImage || getProductImage(product)}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full max-h-96 object-contain transition-all duration-300"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                
                {/* Brand Badge */}
                {product.brandId && (
                  <div className="absolute top-2 lg:top-4 left-2 lg:left-4">
                    <Link 
                      href={`/products?type=brand&id=${product.brandId._id}&name=${encodeURIComponent(product.brandId.name)}`}
                      className="block"
                    >
                      <div className="bg-white rounded-full w-12 h-12 lg:w-16 lg:h-16 flex flex-col items-center justify-center border border-gray-200 transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 shadow-lg cursor-pointer">
                        <span className="text-green-600 font-gazpacho font-bold text-xs text-center leading-tight">
                          {product.brandId.name}
                        </span>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Flavor Badge */}
                {product.flavorId && (
                  <div className="absolute bottom-2 lg:bottom-4 right-2 lg:right-4">
                    <Link 
                      href={`/products?type=flavor&id=${product.flavorId._id}&name=${encodeURIComponent(product.flavorId.name)}`}
                      className="block"
                    >
                      <Image
                        src={getFlavorImage(product)}
                        alt={product.flavorId.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 lg:w-24 lg:h-24 object-contain cursor-pointer transition-transform duration-300"
                        style={{ objectFit: 'contain' }}
                      />
                    </Link>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Gallery Images ({product.gallery.length})
                  </h4>
                  <div className="grid grid-cols-4 gap-2 lg:gap-4">
                    {product.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`relative bg-white rounded-lg p-2 lg:p-4 border-2 transition-all duration-200 ${
                          selectedImage === image ? 'border-green-500' : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            console.error(`Failed to load gallery image ${index + 1}:`, image)
                            // Hide broken images
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6 lg:space-y-8">
              {/* Product Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3 lg:mb-4">
                  {product.brandId && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full font-jost">
                      {product.brandId.name}
                    </span>
                  )}
                  {product.sizeId && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full font-jost">
                      {product.sizeId.name}
                    </span>
                  )}
                  {product.flavorId && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full font-jost">
                      {product.flavorId.name}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-gazpacho font-bold text-gray-800 mb-3 lg:mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="product-description text-base lg:text-lg font-jost text-gray-600 leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-2xl font-gazpacho font-bold text-gray-800 mb-3 mt-4" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-gazpacho font-bold text-gray-800 mb-2 mt-4" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-gazpacho font-semibold text-gray-800 mb-2 mt-3" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />,
                      a: ({node, ...props}) => <a className="text-green-600 no-underline hover:underline" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      code: ({node, inline, ...props}: any) => 
                        inline ? (
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                        ) : (
                          <code className="block bg-gray-100 p-2 rounded text-sm font-mono mb-4 overflow-x-auto" {...props} />
                        ),
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-700 mb-4" {...props} />,
                    }}
                  >
                    {product.description || ''}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                {/* Quote Button - Primary Action */}
                <button 
                  onClick={handleGetQuote}
                  disabled={isNavigating}
                  className={`flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-full transition-all duration-200 font-jost font-semibold text-base lg:text-lg ${
                    isNavigating 
                      ? 'bg-green-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isNavigating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5" />
                      Get a Quote
                    </>
                  )}
                </button>
                
                {/* Secondary Action Buttons */}
                <button
                  onClick={handleFavorite}
                  className={`flex items-center justify-center gap-2 px-4 lg:px-6 py-3 lg:py-4 rounded-full transition-colors duration-200 font-jost font-medium ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-4 w-4 lg:h-5 lg:w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
                  <span className="sm:hidden">{isFavorite ? '✓' : '♥'}</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-4 lg:px-6 py-3 lg:py-4 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200 font-jost font-medium"
                  >
                    <Share2 className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden sm:inline">Share</span>
                    <span className="sm:hidden">↗</span>
                  </button>
                  
                  {/* Share Menu Dropdown */}
                  {showShareMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowShareMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="py-1">
                          <button
                            onClick={handleWhatsAppShare}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors duration-200"
                          >
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-jost text-gray-700">Share on WhatsApp</span>
                          </button>
                          <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <Share2 className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="font-jost text-gray-700">Copy Link</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <div className="flex items-center gap-3 p-3 lg:p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-jost font-semibold text-gray-800 text-sm lg:text-base">Natural Ingredients</p>
                    <p className="text-xs lg:text-sm text-gray-600">No artificial ingredients</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 lg:p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-jost font-semibold text-gray-800 text-sm lg:text-base">Energy Boost</p>
                    <p className="text-xs lg:text-sm text-gray-600">Natural energy source</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 lg:p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Droplets className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-jost font-semibold text-gray-800 text-sm lg:text-base">Hydration</p>
                    <p className="text-xs lg:text-sm text-gray-600">Stay refreshed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 lg:p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Scale className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-jost font-semibold text-gray-800 text-sm lg:text-base">Balanced</p>
                    <p className="text-xs lg:text-sm text-gray-600">Perfect nutrition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutritional Information */}
          {(() => {
            const nutrients = product.nutrients
            if (!hasNutrients(nutrients)) return null
            
            return (
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-12 lg:mb-16 border border-gray-100">
                <div className="text-center mb-6 lg:mb-8">
                  <h2 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-3 lg:mb-4">Nutritional Information</h2>
                  <p className="text-sm lg:text-base text-gray-600 font-jost">Per serving - Discover what makes this product healthy</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {/* Calories */}
                  <div className="text-center p-4 lg:p-6 bg-green-50 rounded-xl">
                    <div className="text-2xl lg:text-3xl font-gazpacho font-bold text-green-600 mb-2">
                      {getNutrientValue(nutrients.calories)}
                    </div>
                    <p className="text-gray-700 font-jost font-medium text-sm lg:text-base">Calories</p>
                    <p className="text-xs lg:text-sm text-gray-500">per serving</p>
                  </div>

                  {/* Protein */}
                  <div className="text-center p-4 lg:p-6 bg-blue-50 rounded-xl">
                    <div className="text-2xl lg:text-3xl font-gazpacho font-bold text-blue-600 mb-2">
                      {getNutrientValue(nutrients.protein, 'g')}
                    </div>
                    <p className="text-gray-700 font-jost font-medium text-sm lg:text-base">Protein</p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {getNutrientPercentage(nutrients.protein, 50)}% daily value
                    </p>
                  </div>

                  {/* Carbohydrates */}
                  <div className="text-center p-4 lg:p-6 bg-orange-50 rounded-xl">
                    <div className="text-2xl lg:text-3xl font-gazpacho font-bold text-orange-600 mb-2">
                      {getNutrientValue(nutrients.carbohydrates, 'g')}
                    </div>
                    <p className="text-gray-700 font-jost font-medium text-sm lg:text-base">Carbs</p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {getNutrientPercentage(nutrients.carbohydrates, 275)}% daily value
                    </p>
                  </div>

                  {/* Fiber */}
                  <div className="text-center p-4 lg:p-6 bg-purple-50 rounded-xl">
                    <div className="text-2xl lg:text-3xl font-gazpacho font-bold text-purple-600 mb-2">
                      {getNutrientValue(nutrients.fiber, 'g')}
                    </div>
                    <p className="text-gray-700 font-jost font-medium text-sm lg:text-base">Fiber</p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {getNutrientPercentage(nutrients.fiber, 28)}% daily value
                    </p>
                  </div>
                </div>

                {/* Detailed Nutrition Table */}
                <div className="mt-6 lg:mt-8">
                  <h3 className="text-lg lg:text-xl font-gazpacho font-bold text-gray-800 mb-3 lg:mb-4 text-center">Complete Nutrition Facts</h3>
                  <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Total Fat</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.fat, 'g')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Saturated Fat</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.saturatedFat, 'g')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Sodium</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.sodium, 'mg')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Total Carbohydrates</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.carbohydrates, 'g')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Dietary Fiber</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.fiber, 'g')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Total Sugars</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.sugar, 'g')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Protein</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.protein, 'g')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Vitamin C</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.vitaminC, 'mg')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Vitamin A</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.vitaminA, 'IU')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Calcium</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.calcium, 'mg')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-jost text-gray-700 text-sm lg:text-base">Iron</span>
                        <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(nutrients.iron, 'mg')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Related Products Section */}
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-3 lg:mb-4">Explore More Products</h2>
            <p className="text-sm lg:text-base text-gray-600 font-jost mb-6 lg:mb-8">Discover our complete range of premium juice, flavored milk, and tea whiteners</p>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              {product.brandId && (
                <Link
                  href={`/products?type=brand&id=${product.brandId._id}&name=${encodeURIComponent(product.brandId.name)}`}
                  className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 font-jost font-medium text-sm lg:text-base"
                >
                  🏢 <span className="hidden sm:inline">More from {product.brandId.name}</span>
                  <span className="sm:hidden">{product.brandId.name}</span>
                </Link>
              )}
              
              {product.flavorId && (
                <Link
                  href={`/products?type=flavor&id=${product.flavorId._id}&name=${encodeURIComponent(product.flavorId.name)}`}
                  className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors duration-200 font-jost font-medium text-sm lg:text-base"
                >
                  🍊 <span className="hidden sm:inline">More {product.flavorId.name} Flavors</span>
                  <span className="sm:hidden">{product.flavorId.name}</span>
                </Link>
              )}
              
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200 font-jost font-medium text-sm lg:text-base"
              >
                🥤 <span className="hidden sm:inline">View All Products</span>
                <span className="sm:hidden">All Products</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductDetail = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-jost text-lg">Loading...</p>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  )
}

export default ProductDetail 