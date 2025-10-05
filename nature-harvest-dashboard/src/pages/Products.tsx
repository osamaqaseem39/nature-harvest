import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, PencilIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useApi, useApiMutation } from '../hooks/useApi';
import { productsAPI, brandsAPI } from '../services/api';
import ProductForm from '../components/forms/ProductForm';
import Modal from '../components/Modal';
import { Product, Brand } from '../types';
import MarkdownDisplay from '../components/common/MarkdownDisplay';
import ErrorMessage from '../components/common/ErrorMessage';


const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Stable fetcher to avoid infinite re-fetch loops
  const fetchProducts = React.useCallback(() => {
    return productsAPI.getAll({
      page: currentPage,
      limit,
      search: searchTerm?.trim() ? searchTerm.trim() : undefined,
    });
  }, [currentPage, limit, searchTerm]);

  // Fetch products with server-side pagination and search
  const { data: productsResponse, loading: productsLoading, error: productsError, refetch: refetchProducts } = useApi(fetchProducts);
  const { data: brandsResponse } = useApi(brandsAPI.getAll);
  
  // Extract arrays from the response structure
  const products = Array.isArray(productsResponse) ? productsResponse : 
                   (productsResponse as any)?.value || (productsResponse as any)?.data || [];
  const pagination = (productsResponse as any)?.pagination || { page: currentPage, limit, total: products?.length || 0, pages: 1 };
  const brands: Brand[] = Array.isArray(brandsResponse) ? brandsResponse : 
                         (brandsResponse as any)?.data || [];

  // Debug logging
  console.log('Products Response:', productsResponse);
  console.log('Products Array:', products);
  console.log('Brands Response:', brandsResponse);
  console.log('Brands Array:', brands);
  console.log('Brands Response Type:', typeof brandsResponse);
  console.log('Brands Response Data:', (brandsResponse as any)?.data);

  const { mutate: deleteProduct, loading: deleteLoading } = useApiMutation(productsAPI.delete);
  const { mutate: createProduct, loading: createLoading } = useApiMutation(productsAPI.create);
  const { mutate: updateProduct, loading: updateLoading } = useApiMutation(productsAPI.update);

  // Helper function to get brand name
  const getBrandName = (product: Product) => {
    if (typeof product.brandId === 'object' && product.brandId !== null) {
      return product.brandId.name;
    }
    // If brandId is a string, find the brand in the brands array
    const brand = brands.find((b: Brand) => b._id === product.brandId);
    return brand ? brand.name : (typeof product.brandId === 'string' ? product.brandId : 'Unknown Brand');
  };

  // Helper function to get size name
  const getSizeName = (product: Product) => {
    if (typeof product.sizeId === 'object' && product.sizeId !== null) {
      return product.sizeId.name;
    }
    return product.sizeId;
  };

  // Helper function to get flavor name
  const getFlavorName = (product: Product) => {
    if (typeof product.flavorId === 'object' && product.flavorId !== null) {
      return product.flavorId.name;
    }
    return product.flavorId;
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        refetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormError(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormError(null);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (productData: any) => {
    try {
      setFormError(null);
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      refetchProducts();
    } catch (error: any) {
      console.error('Failed to save product:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save product. Please try again.';
      setFormError(errorMessage);
    }
  };

  const handleCancelProduct = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setFormError(null);
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter((product: Product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle brand filtering - brandId can be string or object
    let productBrandId = product.brandId;
    if (typeof product.brandId === 'object' && product.brandId !== null) {
      productBrandId = product.brandId._id;
    }
    const matchesBrand = !selectedBrand || productBrandId === selectedBrand;
    
    return matchesSearch && matchesBrand;
  });



  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Products</h3>
            <p className="text-red-600">{productsError}</p>
            <button 
              onClick={refetchProducts} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-2 text-gray-600">
                Manage your product catalog and inventory
              </p>
            </div>
            <button 
              onClick={handleAddProduct}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

                     {/* Filters */}
           {showFilters && (
             <div className="mt-4 pt-4 border-t border-gray-200">
               <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Brand
                   </label>
                   <select
                     value={selectedBrand}
                     onChange={(e) => setSelectedBrand(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                   >
                     <option value="">All Brands</option>
                                           {(Array.isArray(brands) ? brands : []).map((brand: Brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                   </select>
                 </div>
               </div>
             </div>
           )}
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flavor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product: Product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden flex items-center justify-center mr-4">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBrandName(product)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getFlavorName(product) || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getSizeName(product) || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.status || 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg mr-2"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id || product.id || '')}
                        disabled={deleteLoading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages} • Total {pagination.total}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.pages || 1) }, (_, i) => {
                const pageNum = i + Math.max(1, Math.min((pagination.page || 1) - 2, (pagination.pages || 1) - 4));
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${pageNum === pagination.page ? 'bg-primary-600 text-white' : 'border border-gray-300'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min((pagination.pages || 1), p + 1))}
                disabled={(pagination.page || 1) >= (pagination.pages || 1)}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value, 10) || 10);
                  setCurrentPage(1);
                }}
                className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CubeIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                         <p className="text-gray-600">
               {searchTerm || selectedBrand 
                 ? 'Try adjusting your search or filters'
                 : 'Get started by adding your first product'
               }
             </p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={handleCancelProduct}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="xl"
      >
        {formError && (
          <ErrorMessage 
            message={formError} 
            onDismiss={() => setFormError(null)}
            className="mb-4"
          />
        )}
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={handleProductSubmit}
          onCancel={handleCancelProduct}
          loading={createLoading || updateLoading}
        />
      </Modal>
    </div>
  );
};

export default Products; 