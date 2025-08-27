import React, { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { brandsAPI } from '../services/api';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import BrandForm from '../components/forms/BrandForm';
import Modal from '../components/Modal';
import MarkdownDisplay from '../components/common/MarkdownDisplay';

// Type definitions
interface Brand {
  id?: string;
  _id?: string;
  name: string;
  imageUrl?: string;
  logoUrl?: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

interface BrandsResponse {
  success: boolean;
  data: Brand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const Brands = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const { data: brandsResponse, loading: brandsLoading, error: brandsError, refetch: refetchBrands } = useApi(brandsAPI.getAll);
  
  // Extract brands array from the response structure
  const brands = (brandsResponse as BrandsResponse | null)?.data || [];
  
  const { mutate: deleteBrand, loading: deleteLoading } = useApiMutation(brandsAPI.delete);
  const { mutate: createBrand, loading: createLoading } = useApiMutation(brandsAPI.create);
  const { mutate: updateBrand, loading: updateLoading } = useApiMutation(brandsAPI.update);

  const handleDelete = async (brandId: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand(brandId);
        refetchBrands();
      } catch (error) {
        console.error('Failed to delete brand:', error);
      }
    }
  };

  const handleAddBrand = () => {
    setEditingBrand(null);
    setShowBrandModal(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setShowBrandModal(true);
  };

  const handleBrandSubmit = async (brandData: any) => {
    try {
      if (editingBrand) {
        await updateBrand(editingBrand._id, brandData);
      } else {
        await createBrand(brandData);
      }
      setShowBrandModal(false);
      setEditingBrand(null);
      refetchBrands();
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  };

  const handleCancelBrand = () => {
    setShowBrandModal(false);
    setEditingBrand(null);
  };

  const filteredBrands = (Array.isArray(brands) ? brands : []).filter((brand: Brand) => {
    const matchesSearch = brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (brandsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brands...</p>
        </div>
      </div>
    );
  }

  if (brandsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Brands</h3>
            <p className="text-red-600">{brandsError}</p>
            <button 
              onClick={refetchBrands} 
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
              <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
              <p className="mt-2 text-gray-600">
                Manage your product brands and manufacturers
              </p>
            </div>
            <button 
              onClick={handleAddBrand}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Brand
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
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand: Brand) => (
            <div key={brand._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Brand Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {brand.imageUrl || brand.logoUrl ? (
                  <img
                    src={brand.imageUrl || brand.logoUrl}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {brand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm">No Image</p>
                  </div>
                )}
              </div>

              {/* Brand Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {brand.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    brand.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {brand.status}
                  </span>
                </div>
                
                {brand.description && (
                  <div className="text-gray-600 text-sm mb-4">
                    <MarkdownDisplay 
                      content={brand.description} 
                      maxLength={100}
                      className="line-clamp-2"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditBrand(brand)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(brand._id || brand.id || '')}
                      disabled={deleteLoading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CubeIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search'
                : 'Get started by adding your first brand'
              }
            </p>
          </div>
        )}
      </div>

      {/* Brand Form Modal */}
      <Modal
        isOpen={showBrandModal}
        onClose={handleCancelBrand}
        title={editingBrand ? 'Edit Brand' : 'Add New Brand'}
        size="lg"
      >
        <BrandForm
          brand={editingBrand || undefined}
          onSubmit={handleBrandSubmit}
          onCancel={handleCancelBrand}
          loading={createLoading || updateLoading}
        />
      </Modal>
    </div>
  );
};

export default Brands; 