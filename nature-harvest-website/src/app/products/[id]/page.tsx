'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Leaf, Zap, Droplets, Scale, Home, ChevronRight, MessageCircle } from 'lucide-react'
import { apiService, Product } from '../../../lib/api'
import { config } from '../../../lib/config'

const ProductDetailContent = () => {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isFavorite, setIsFavorite] = useState(false)

  const productId = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await apiService.getProduct(productId)
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

    if (productId) {
      fetchProduct()
    }
  }, [productId])

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

  const getNutrientValue = (value?: number, unit: string = '') => {
    if (value === undefined || value === null) return 'N/A'
    return `${value}${unit}`
  }

  const getNutrientPercentage = (value?: number, dailyValue: number = 100) => {
    if (value === undefined || value === null) return 0
    return Math.round((value / dailyValue) * 100)
  }

  const handleGetQuote = () => {
    // Navigate to contact page or open quote form
    router.push('/contact')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Product',
          text: product?.description || 'Check out this amazing product!',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white pt-20">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
        </div>

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
            <span className="text-gray-800 font-medium">{product.name}</span>
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
                <div className="max-w-md mx-auto">
                  <Image
                    src={selectedImage || getProductImage(product)}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-auto max-h-96 object-contain transition-all duration-300"
                  />
                </div>
                
                {/* Brand Badge */}
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
                        width={60}
                        height={60}
                        className="w-12 h-12 lg:w-20 lg:h-20 object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery && product.gallery.length > 0 && (
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
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6 lg:space-y-8">
              {/* Product Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3 lg:mb-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full font-jost">
                    {product.brandId.name}
                  </span>
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

                <p className="text-base lg:text-lg font-jost text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <button 
                  onClick={handleGetQuote}
                  className="flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 font-jost font-semibold text-base lg:text-lg"
                >
                  <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5" />
                  Get a Quote
                </button>
                
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

                <button 
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 lg:px-6 py-3 lg:py-4 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200 font-jost font-medium"
                >
                  <Share2 className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="hidden sm:inline">Share</span>
                  <span className="sm:hidden">↗</span>
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <div className="flex items-center gap-3 p-3 lg:p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-jost font-semibold text-gray-800 text-sm lg:text-base">100% Natural</p>
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
          {product.nutrients && (
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-12 lg:mb-16 border border-gray-100">
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-3 lg:mb-4">Nutritional Information</h2>
                <p className="text-sm lg:text-base text-gray-600 font-jost">Per serving - Discover what makes this product healthy</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Calories */}
                <div className="text-center p-4 lg:p-6 bg-green-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-gazpacho font-bold text-green-600 mb-2">
                    {getNutrientValue(product.nutrients.calories)}
                  </div>
                  <p className="text-gray-700 font-jost font-medium text-sm lg:text-base">Calories</p>
                  <p className="text-xs lg:text-sm text-gray-500">per serving</p>
                </div>

                {/* Protein */}
                <div className="text-center p-4 lg:p-6 bg-blue-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-gazpacho font-bold text-blue-600 mb-2">
                    {getNutrientValue(product.nutrients.protein, 'g')}
                  </div>
                  <p className="text-gray-700 font-jost font-medium text-sm lg:text-base">Protein</p>
                  <p className="text-xs lg:text-sm text-gray-500">
                    {getNutrientPercentage(product.nutrients.protein, 50)}% daily value
                  </p>
                </div>

                {/* Carbohydrates */}
                <div className="text-center p-4 lg:p-6 bg-orange-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-gazpacho font-bold text-orange-600 mb-2">
                    {getNutrientValue(product.nutrients.carbohydrates, 'g')}
                  </div>
                  <p className="text-gray-700 font-jost font-medium text-sm lg:text-base">Carbs</p>
                  <p className="text-xs lg:text-sm text-gray-500">
                    {getNutrientPercentage(product.nutrients.carbohydrates, 275)}% daily value
                  </p>
                </div>

                {/* Fiber */}
                <div className="text-center p-4 lg:p-6 bg-purple-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-gazpacho font-bold text-purple-600 mb-2">
                    {getNutrientValue(product.nutrients.fiber, 'g')}
                  </div>
                  <p className="text-gray-700 font-jost font-medium text-sm lg:text-base">Fiber</p>
                  <p className="text-xs lg:text-sm text-gray-500">
                    {getNutrientPercentage(product.nutrients.fiber, 28)}% daily value
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
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.fat, 'g')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Saturated Fat</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">0g</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Sodium</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.sodium, 'mg')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Total Carbohydrates</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.carbohydrates, 'g')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Dietary Fiber</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.fiber, 'g')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Total Sugars</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.sugar, 'g')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Protein</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.protein, 'g')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Vitamin C</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.vitaminC, 'mg')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Vitamin A</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.vitaminA, 'IU')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Calcium</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.calcium, 'mg')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-jost text-gray-700 text-sm lg:text-base">Iron</span>
                      <span className="font-jost font-medium text-black text-sm lg:text-base">{getNutrientValue(product.nutrients.iron, 'mg')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Products Section */}
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-gazpacho font-bold text-gray-800 mb-3 lg:mb-4">Explore More Products</h2>
            <p className="text-sm lg:text-base text-gray-600 font-jost mb-6 lg:mb-8">Discover our complete range of premium beverages</p>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              <Link
                href={`/products?type=brand&id=${product.brandId._id}&name=${encodeURIComponent(product.brandId.name)}`}
                className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 font-jost font-medium text-sm lg:text-base"
              >
                🏢 <span className="hidden sm:inline">More from {product.brandId.name}</span>
                <span className="sm:hidden">{product.brandId.name}</span>
              </Link>
              
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