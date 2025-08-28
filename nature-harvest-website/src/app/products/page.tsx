'use client'

import { ChevronDown, X, Home, ChevronRight, Filter, Sliders } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { apiService, Product, Brand, Flavor, Size } from '../../lib/api'
import { config, isFeatureEnabled } from '../../lib/config'

interface FilterData {
  type: 'brand' | 'flavor' | 'size'
  id: string
  name: string
  description?: string
  imageUrl?: string
}

const ProductsContent = () => {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterData, setFilterData] = useState<FilterData | null>(null)
  
  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedFlavor, setSelectedFlavor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Check URL parameters for initial filter
  useEffect(() => {
    const type = searchParams.get('type') as 'brand' | 'flavor' | 'size'
    const id = searchParams.get('id')
    const name = searchParams.get('name')

    if (type && id && name) {
      // Set initial filter based on URL parameters
      switch (type) {
        case 'brand':
          setSelectedBrand(id)
          break
        case 'flavor':
          setSelectedFlavor(id)
          break
        case 'size':
          setSelectedSize(id)
          break
      }
    }
  }, [searchParams])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [brandsRes, flavorsRes, sizesRes] = await Promise.all([
          apiService.getBrands(),
          apiService.getFlavors(),
          apiService.getSizes()
        ])
        
        setBrands(brandsRes.data.filter(brand => brand.status === 'Active'))
        setFlavors(flavorsRes.data.filter(flavor => flavor.status === 'Active'))
        setSizes(sizesRes.data.filter(size => size.status === 'Active'))

        // Set filter data if URL parameters exist
        const type = searchParams.get('type') as 'brand' | 'flavor' | 'size'
        const id = searchParams.get('id')
        const name = searchParams.get('name')

        if (type && id && name) {
          let filterInfo: FilterData | null = null
          
          switch (type) {
            case 'brand':
              const brand = brandsRes.data.find(b => b._id === id)
              if (brand) {
                filterInfo = {
                  type: 'brand',
                  id: brand._id,
                  name: brand.name,
                  description: brand.description,
                  imageUrl: brand.logoUrl || brand.imageUrl
                }
              }
              break
            case 'flavor':
              const flavor = flavorsRes.data.find(f => f._id === id)
              if (flavor) {
                filterInfo = {
                  type: 'flavor',
                  id: flavor._id,
                  name: flavor.name,
                  description: flavor.description,
                  imageUrl: flavor.imageUrl
                }
              }
              break
            case 'size':
              const size = sizesRes.data.find(s => s._id === id)
              if (size) {
                filterInfo = {
                  type: 'size',
                  id: size._id,
                  name: size.name,
                  description: size.description
                }
              }
              break
          }
          setFilterData(filterInfo)
        }
      } catch (err) {
        console.error('Error fetching filter data:', err)
        setError('Failed to load filter options')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await apiService.getProducts({
          page: currentPage,
          limit: config.pagination.productsPerPage,
          status: 'Active',
          brandId: selectedBrand || undefined,
          flavorId: selectedFlavor || undefined,
          sizeId: selectedSize || undefined
        })
        
        setProducts(response.data)
        setTotalPages(response.pagination.pages)
        setTotalProducts(response.pagination.total)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedBrand, selectedFlavor, selectedSize, currentPage])

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrand('')
    setSelectedFlavor('')
    setSelectedSize('')
    setCurrentPage(1)
    setFilterData(null)
  }

  // Check if any filters are active
  const hasActiveFilters = selectedBrand || selectedFlavor || selectedSize

  // Helper functions for product display
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

  const getFilterIcon = () => {
    if (!filterData) return '🥤'
    
    switch (filterData.type) {
      case 'brand':
        return '🏢'
      case 'flavor':
        return '🍊'
      case 'size':
        return '📏'
      default:
        return '🥤'
    }
  }

  const getFilterDescription = () => {
    if (!filterData) return 'Discover our carefully curated selection of organic and natural products designed to support your health and wellness journey.'
    
    switch (filterData.type) {
      case 'brand':
        return `Discover all products from ${filterData.name} - a trusted name in premium beverages.`
      case 'flavor':
        return `Explore our collection of ${filterData.name} flavored beverages, crafted with natural ingredients.`
      case 'size':
        return `Browse our selection of ${filterData.name} sized products, perfect for your needs.`
      default:
        return 'Discover our carefully curated selection of organic and natural products.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-600 mb-8">
            <Link href="/" className="flex items-center hover:text-green-600 transition-colors duration-200">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-800 font-medium">Products</span>
            {filterData && (
              <>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-gray-800 font-medium">{filterData.name}</span>
              </>
            )}
          </div>

          {/* Page Header */}
          <div className="text-center mb-16">
            {filterData && filterData.imageUrl ? (
              <div className="mb-6 flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white shadow-lg border-4 border-green-100">
                  <Image
                    src={filterData.imageUrl}
                    alt={filterData.name}
                    fill
                    className="object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // Show fallback icon if image fails
                      const fallback = target.parentElement?.querySelector('.fallback-icon');
                      if (fallback) {
                        (fallback as HTMLElement).style.display = 'block';
                      }
                    }}
                  />
                  {/* Fallback icon */}
                  <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center text-4xl">
                    {getFilterIcon()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-6xl mb-6">{getFilterIcon()}</div>
            )}
            <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-4">
              {filterData ? `${filterData.type.toUpperCase()} PRODUCTS` : 'OUR PRODUCTS'}
            </h3>
            <h1 className="text-5xl lg:text-6xl font-gazpacho font-bold text-gray-800 mb-6 leading-tight">
              {filterData ? filterData.name : 'Our Products'}
            </h1>
            <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto">
              {getFilterDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sticky Sidebar - Filters */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              {/* Filters Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                {/* Filter Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <Sliders className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-gazpacho font-bold text-gray-800">Filters</h3>
                  {hasActiveFilters && (
                    <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      {[selectedBrand, selectedFlavor, selectedSize].filter(Boolean).length} active
                    </span>
                  )}
                </div>

                {/* Filter Options */}
                <div className="space-y-6">
                  {/* Brand Filter */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 font-jost">Brand</label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost bg-white hover:border-green-300 transition-colors duration-200"
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Flavor Filter */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 font-jost">Flavor</label>
                    <select
                      value={selectedFlavor}
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost bg-white hover:border-green-300 transition-colors duration-200"
                    >
                      <option value="">All Flavors</option>
                      {flavors.map((flavor) => (
                        <option key={flavor._id} value={flavor._id}>
                          {flavor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size Filter */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 font-jost">Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost bg-white hover:border-gray-300 transition-colors duration-200"
                    >
                      <option value="">All Sizes</option>
                      {sizes.map((size) => (
                        <option key={size._id} value={size._id}>
                          {size.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-jost font-medium"
                      >
                        <X className="h-4 w-4" />
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Filter Links */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 font-jost">Quick Filters:</h4>
                  <div className="space-y-2">
                    {/* Brand Quick Links */}
                    {brands.slice(0, 3).map((brand) => (
                      <Link
                        key={brand._id}
                        href={`/products?type=brand&id=${brand._id}&name=${encodeURIComponent(brand.name)}`}
                        className="block px-3 py-2 bg-green-50 text-green-800 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors duration-200 font-jost"
                      >
                        🏢 {brand.name}
                      </Link>
                    ))}
                    
                    {/* Flavor Quick Links */}
                    {flavors.slice(0, 3).map((flavor) => (
                      <Link
                        key={flavor._id}
                        href={`/products?type=flavor&id=${flavor._id}&name=${encodeURIComponent(flavor.name)}`}
                        className="block px-3 py-2 bg-orange-50 text-orange-800 text-sm font-medium rounded-lg hover:bg-orange-100 transition-colors duration-200 font-jost"
                      >
                        🍊 {flavor.name}
                      </Link>
                    ))}
                  </div>
                  
                  {/* View All Products Link */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href="/products"
                      className="block w-full text-center px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Products */}
          <div className="flex-1 lg:min-w-0">
            {/* Results Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-600 font-jost text-sm lg:text-base">
                    Showing <span className="font-bold text-green-600">{products.length}</span> of <span className="font-bold text-green-600">{totalProducts}</span> products
                    {hasActiveFilters && ' (filtered)'}
                  </p>
                  {filterData && (
                    <p className="text-sm text-gray-500 mt-1">
                      Filtered by: <span className="font-medium text-green-600">{filterData.name}</span>
                    </p>
                  )}
                </div>
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-medium">
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-jost">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-gazpacho">{error}</h3>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                {products.map((product, index) => (
                  <Link 
                    key={product._id} 
                    href={`/products/${product._id}`}
                    className="block"
                  >
                    <div className="relative transition-all duration-500 ease-out hover:scale-105 cursor-pointer">
                      {/* Product Image Container */}
                      <div className="relative overflow-hidden">
                        {/* Brand Tag - Top Left */}
                        <div className="absolute top-2 left-1 z-10">
                          <Link 
                            href={product.brandId?._id ? `/products?type=brand&id=${product.brandId._id}&name=${encodeURIComponent(product.brandId.name)}` : '#'}
                            className="block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="bg-white rounded-full w-20 h-20 flex flex-col items-center justify-center border border-gray-200 transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 shadow-lg cursor-pointer">
                              <span className="text-green-600 font-gazpacho font-bold text-sm">
                                {product.brandId?.name || 'Nature Harvest'}
                              </span>
                              <span className="text-green-600 font-jost font-medium text-xs">
                                {product.sizeId?.name || '125 ML'}
                              </span>
                            </div>
                          </Link>
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
                          <Link 
                            href={product.flavorId?._id ? `/products?type=flavor&id=${product.flavorId._id}&name=${encodeURIComponent(product.flavorId.name)}` : '#'}
                            className="block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Image
                              src={getFlavorImage(product)}
                              alt={product.flavorId?.name || 'Flavor'}
                              width={180}
                              height={180}
                              className="object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                            />
                          </Link>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="text-center mt-4">
                        <h3 className="font-gazpacho font-bold text-lg text-gray-800 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 font-jost text-sm line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Products State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🥤</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 font-gazpacho">No products found</h3>
                <p className="text-gray-600 mb-4 font-jost">
                  {hasActiveFilters 
                    ? 'Try adjusting your filters or search terms.'
                    : 'No products are available at the moment.'
                  }
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-jost"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-jost ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-jost"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Products = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-jost text-lg">Loading...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}

export default Products 