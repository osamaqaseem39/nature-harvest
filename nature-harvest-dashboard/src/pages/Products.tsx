import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, PencilIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useApi, useApiMutation } from '../hooks/useApi';
import { productsAPI, brandsAPI } from '../services/api';
import ProductForm from '../components/forms/ProductForm';
import Modal from '../components/Modal';
import { Product, Brand } from '../types';
import MarkdownDisplay from '../components/common/MarkdownDisplay';


const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: productsResponse, loading: productsLoading, error: productsError, refetch: refetchProducts } = useApi(productsAPI.getAll);
  const { data: brandsResponse } = useApi(brandsAPI.getAll);
  
  // Extract arrays from the response structure
  const products = Array.isArray(productsResponse) ? productsResponse : 
                   (productsResponse as any)?.value || (productsResponse as any)?.data || [];
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
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      refetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleCancelProduct = () => {
    setShowProductModal(false);
    setEditingProduct(null);
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => (
            <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                             {/* Product Image */}
               <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                 {product.imageUrl ? (
                   <img
                     src={product.imageUrl}
                     alt={product.name}
                     className="w-full h-48 object-cover"
                   />
                 ) : (
                   <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                     <span className="text-gray-400">No Image</span>
                   </div>
                 )}
               </div>

               {/* Gallery Preview */}
               {product.gallery && product.gallery.length > 0 && (
                 <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                   <div className="flex space-x-2 overflow-x-auto">
                     {product.gallery.slice(0, 4).map((imageUrl, index) => (
                       <img
                         key={index}
                         src={imageUrl}
                         alt={`Gallery ${index + 1}`}
                         className="w-12 h-12 object-cover rounded border border-gray-300 flex-shrink-0"
                       />
                     ))}
                     {product.gallery.length > 4 && (
                       <div className="w-12 h-12 bg-gray-200 rounded border border-gray-300 flex items-center justify-center flex-shrink-0">
                         <span className="text-xs text-gray-500">+{product.gallery.length - 4}</span>
                       </div>
                     )}
                   </div>
                 </div>
               )}

              {/* Product Info */}
              <div className="p-6">
                                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
                   {product.name}
                 </h3>
                <div className="text-gray-600 text-sm mb-4">
                  <MarkdownDisplay 
                    content={product.description || ''} 
                    maxLength={100}
                    className="line-clamp-2"
                  />
                </div>

                                 {/* Product Meta */}
                 <div className="space-y-2 mb-4">
                   {product.brandId && (
                     <div className="flex items-center text-sm text-gray-500">
                       <span className="font-medium">Brand:</span>
                       <span className="ml-2">{getBrandName(product)}</span>
                     </div>
                   )}
                   
                   {product.flavorId && (
                     <div className="flex items-center text-sm text-gray-500">
                       <span className="font-medium">Flavor:</span>
                       <span className="ml-2">{getFlavorName(product)}</span>
                     </div>
                   )}
                   {product.sizeId && (
                     <div className="flex items-center text-sm text-gray-500">
                       <span className="font-medium">Size:</span>
                       <span className="ml-2">{getSizeName(product)}</span>
                     </div>
                   )}
                 </div>

                 {/* Nutrients Display */}
                 {product.nutrients && Object.keys(product.nutrients).length > 0 && (
                   <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                     <h4 className="text-sm font-medium text-gray-900 mb-2">Nutrition Facts</h4>
                     <div className="grid grid-cols-2 gap-2 text-xs">
                       {product.nutrients.calories && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Calories:</span>
                           <span className="font-medium">{product.nutrients.calories} kcal</span>
                         </div>
                       )}
                       {product.nutrients.protein && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Protein:</span>
                           <span className="font-medium">{product.nutrients.protein}g</span>
                         </div>
                       )}
                       {product.nutrients.carbohydrates && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Carbs:</span>
                           <span className="font-medium">{product.nutrients.carbohydrates}g</span>
                         </div>
                       )}
                       {product.nutrients.fat && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Fat:</span>
                           <span className="font-medium">{product.nutrients.fat}g</span>
                         </div>
                       )}
                       {product.nutrients.fiber && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Fiber:</span>
                           <span className="font-medium">{product.nutrients.fiber}g</span>
                         </div>
                       )}
                       {product.nutrients.sugar && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Sugar:</span>
                           <span className="font-medium">{product.nutrients.sugar}g</span>
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
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
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
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