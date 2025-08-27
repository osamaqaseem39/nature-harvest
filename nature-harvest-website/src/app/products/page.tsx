'use client'

import { Search, Filter, Star, ChevronDown, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService, Product, Brand, Flavor, Size } from '../../lib/api'
import { config, isFeatureEnabled } from '../../lib/config'

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedFlavor, setSelectedFlavor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

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
      } catch (err) {
        console.error('Error fetching filter data:', err)
        setError('Failed to load filter options')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await apiService.getProducts({
          page: currentPage,
          limit: config.pagination.productsPerPage,
          status: 'Active',
          search: searchTerm || undefined,
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
  }, [searchTerm, selectedBrand, selectedFlavor, selectedSize, currentPage])

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBrand('')
    setSelectedFlavor('')
    setSelectedSize('')
    setCurrentPage(1)
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedBrand || selectedFlavor || selectedSize

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of organic and natural products 
            designed to support your health and wellness journey.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            {isFeatureEnabled('enableSearch') && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              
              {/* Filter Toggle Button */}
              {isFeatureEnabled('enableProductFilters') && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            )}

            {/* Filter Options */}
            {showFilters && isFeatureEnabled('enableProductFilters') && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Brand Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flavor</label>
                    <select
                      value={selectedFlavor}
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Sizes</option>
                      {sizes.map((size) => (
                        <option key={size._id} value={size._id}>
                          {size.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} products
            {hasActiveFilters && ' (filtered)'}
          </p>
          
          {/* Quick Filter Links */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {/* Brand Quick Links */}
              {brands.slice(0, 5).map((brand) => (
                <a
                  key={brand._id}
                  href={`/filter?type=brand&id=${brand._id}&name=${encodeURIComponent(brand.name)}`}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full hover:bg-green-200 transition-colors duration-200"
                >
                  🏢 {brand.name}
                </a>
              ))}
              
              {/* Flavor Quick Links */}
              {flavors.slice(0, 5).map((flavor) => (
                <a
                  key={flavor._id}
                  href={`/filter?type=flavor&id=${flavor._id}&name=${encodeURIComponent(flavor.name)}`}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full hover:bg-orange-200 transition-colors duration-200"
                >
                  🍊 {flavor.name}
                </a>
              ))}
              
              {/* Size Quick Links */}
              {sizes.slice(0, 5).map((size) => (
                <a
                  key={size._id}
                  href={`/filter?type=size&id=${size._id}&name=${encodeURIComponent(size.name)}`}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                >
                  📏 {size.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                                     <div className={`absolute inset-0 flex items-center justify-center ${product.imageUrl ? 'hidden' : ''}`}>
                     <img
                       src={config.images.defaultProductImage}
                       alt="Default product"
                       className="w-16 h-16 object-contain opacity-50"
                       onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                         target.nextElementSibling?.classList.remove('hidden');
                       }}
                     />
                     <span className="text-6xl hidden">🥤</span>
                   </div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-600 font-medium">{product.brandId?.name || 'Unknown Brand'}</span>
                    <div className="flex items-center gap-2">
                      {product.flavorId && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {product.flavorId.name}
                        </span>
                      )}
                      {product.sizeId && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {product.sizeId.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  {/* Nutritional Info */}
                  {product.nutrients && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Nutritional Info</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {product.nutrients.calories && (
                          <span>Calories: {product.nutrients.calories}</span>
                        )}
                        {product.nutrients.protein && (
                          <span>Protein: {product.nutrients.protein}g</span>
                        )}
                        {product.nutrients.carbohydrates && (
                          <span>Carbs: {product.nutrients.carbohydrates}g</span>
                        )}
                        {product.nutrients.sugar && (
                          <span>Sugar: {product.nutrients.sugar}g</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🥤</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms.'
                : 'No products are available at the moment.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
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
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
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
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products 