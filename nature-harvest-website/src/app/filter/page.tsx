'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { apiService, Product, Brand, Flavor, Size } from '../../lib/api'
import { config } from '../../lib/config'

interface FilterData {
  type: 'brand' | 'flavor' | 'size'
  id: string
  name: string
  description?: string
  imageUrl?: string
}

const FilterPage = () => {
  const searchParams = useSearchParams()
  const [filterData, setFilterData] = useState<FilterData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [sizes, setSizes] = useState<Size[]>([])

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true)
        
        // Get filter parameters from URL
        const type = searchParams.get('type') as 'brand' | 'flavor' | 'size'
        const id = searchParams.get('id')
        const name = searchParams.get('name')

        if (!type || !id || !name) {
          setError('Invalid filter parameters')
          setLoading(false)
          return
        }

        // Fetch all data needed for filtering
        const [brandsRes, flavorsRes, sizesRes] = await Promise.all([
          apiService.getBrands(),
          apiService.getFlavors(),
          apiService.getSizes()
        ])

        setBrands(brandsRes.data.filter(brand => brand.status === 'Active'))
        setFlavors(flavorsRes.data.filter(flavor => flavor.status === 'Active'))
        setSizes(sizesRes.data.filter(size => size.status === 'Active'))

        // Set filter data based on type
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

        if (!filterInfo) {
          setError('Filter data not found')
          setLoading(false)
          return
        }

        setFilterData(filterInfo)

        // Fetch products based on filter
        let productsResponse
        switch (type) {
          case 'brand':
            productsResponse = await apiService.getProducts({
              page: 1,
              limit: 50,
              status: 'Active',
              brandId: id
            })
            break
          case 'flavor':
            productsResponse = await apiService.getProducts({
              page: 1,
              limit: 50,
              status: 'Active',
              flavorId: id
            })
            break
          case 'size':
            productsResponse = await apiService.getProducts({
              page: 1,
              limit: 50,
              status: 'Active',
              sizeId: id
            })
            break
        }

        setProducts(productsResponse.data)

      } catch (err) {
        console.error('Error fetching filter data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchFilterData()
  }, [searchParams])

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
    const flavorName = product.flavorId?.name?.toLowerCase() || ''
    
    if (flavorName.includes('orange')) {
      return '/images/orange.png'
    } else if (flavorName.includes('strawberry')) {
      return '/images/strawberry.png'
    } else if (flavorName.includes('pineapple')) {
      return '/images/pineapple.png'
    }
    
    return '/images/orange.png'
  }

  const getFilterIcon = () => {
    if (!filterData) return null
    
    switch (filterData.type) {
      case 'brand':
        return '🏢'
      case 'flavor':
        return '🍊'
      case 'size':
        return '📏'
      default:
        return '🔍'
    }
  }

  const getFilterDescription = () => {
    if (!filterData) return ''
    
    switch (filterData.type) {
      case 'brand':
        return `Discover all products from ${filterData.name} - a trusted name in premium beverages.`
      case 'flavor':
        return `Explore our collection of ${filterData.name} flavored beverages, crafted with natural ingredients.`
      case 'size':
        return `Browse our selection of ${filterData.name} sized products, perfect for your needs.`
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-jost text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-gazpacho font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 font-jost">{error}</p>
        </div>
      </div>
    )
  }

  if (!filterData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-gazpacho font-bold text-gray-800 mb-2">No Filter Selected</h2>
          <p className="text-gray-600 font-jost">Please select a valid filter to view products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Info Header */}
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">{getFilterIcon()}</div>
            <h3 className="text-green-600 uppercase tracking-widest font-jost font-semibold text-sm mb-4">
              {filterData.type.toUpperCase()} FILTER
            </h3>
            <h1 className="text-5xl lg:text-6xl font-gazpacho font-bold text-gray-800 mb-6 leading-tight">
              {filterData.name}
            </h1>
            {filterData.description && (
              <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto mb-8">
                {filterData.description}
              </p>
            )}
            <p className="text-lg font-jost text-gray-600 max-w-3xl mx-auto">
              {getFilterDescription()}
            </p>
          </div>

          {/* Products Count */}
          <div className="text-center mb-12">
            <p className="text-gray-600 font-jost">
              Found <span className="font-bold text-green-600">{products.length}</span> products
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {products.map((product, index) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                >
                  {/* Product Image Container */}
                  <div className="relative h-64 bg-gradient-to-br from-green-50 to-white p-6">
                    {/* Brand Tag */}
                    {product.brandId && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-white rounded-full px-3 py-1 shadow-md">
                          <span className="text-green-600 font-gazpacho font-bold text-xs">
                            {product.brandId.name}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Size Tag */}
                    {product.sizeId && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-green-600 text-white rounded-full px-3 py-1 shadow-md">
                          <span className="font-jost font-medium text-xs">
                            {product.sizeId.name}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Main Product Image */}
                    <div className="flex items-center justify-center h-full">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-contain transition-all duration-500 hover:scale-110"
                      />
                    </div>

                    {/* Flavor Image */}
                    {product.flavorId && (
                      <div className="absolute bottom-4 left-4">
                        <Image
                          src={getFlavorImage(product)}
                          alt={product.flavorId.name}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-gazpacho font-bold text-lg text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 font-jost text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Product Details */}
                    <div className="space-y-2 text-sm text-gray-500 font-jost">
                      {product.brandId && (
                        <div className="flex items-center">
                          <span className="font-medium">Brand:</span>
                          <span className="ml-2">{product.brandId.name}</span>
                        </div>
                      )}
                      {product.flavorId && (
                        <div className="flex items-center">
                          <span className="font-medium">Flavor:</span>
                          <span className="ml-2">{product.flavorId.name}</span>
                        </div>
                      )}
                      {product.sizeId && (
                        <div className="flex items-center">
                          <span className="font-medium">Size:</span>
                          <span className="ml-2">{product.sizeId.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-gazpacho font-bold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600 font-jost">
                No products available for this {filterData.type} at the moment.
              </p>
            </div>
          )}

          {/* Back to All Products */}
          <div className="text-center">
            <a 
              href="/products" 
              className="inline-flex items-center bg-green-400 hover:bg-green-500 text-white font-jost font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-xl transform hover:scale-105 text-lg uppercase tracking-wide"
            >
              ← Back to All Products
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterPage 