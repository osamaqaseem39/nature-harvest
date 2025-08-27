import React, { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { sizesAPI } from '../services/api';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import SizeForm from '../components/forms/SizeForm';
import Modal from '../components/Modal';
import MarkdownDisplay from '../components/common/MarkdownDisplay';

// Type definitions
interface Size {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

const Sizes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  const { data: sizesResponse, loading: sizesLoading, error: sizesError, refetch: refetchSizes } = useApi(sizesAPI.getAll);
  
  // Extract sizes array from the response structure
  const sizes = (sizesResponse as any)?.data || [];
  
  const { mutate: deleteSize, loading: deleteLoading } = useApiMutation(sizesAPI.delete);
  const { mutate: createSize, loading: createLoading } = useApiMutation(sizesAPI.create);
  const { mutate: updateSize, loading: updateLoading } = useApiMutation(sizesAPI.update);

  const handleDelete = async (sizeId: string) => {
    if (window.confirm('Are you sure you want to delete this size?')) {
      try {
        await deleteSize(sizeId);
        refetchSizes();
      } catch (error) {
        console.error('Failed to delete size:', error);
      }
    }
  };

  const handleAddSize = () => {
    setEditingSize(null);
    setShowSizeModal(true);
  };

  const handleEditSize = (size: Size) => {
    setEditingSize(size);
    setShowSizeModal(true);
  };

  const handleSizeSubmit = async (sizeData: any) => {
    try {
      if (editingSize) {
        await updateSize(editingSize._id, sizeData);
      } else {
        await createSize(sizeData);
      }
      setShowSizeModal(false);
      setEditingSize(null);
      refetchSizes();
    } catch (error) {
      console.error('Failed to save size:', error);
    }
  };

  const handleCancelSize = () => {
    setShowSizeModal(false);
    setEditingSize(null);
  };

  const filteredSizes = (Array.isArray(sizes) ? sizes : []).filter((size: Size) => {
    const matchesSearch = size.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         size.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (sizesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sizes...</p>
        </div>
      </div>
    );
  }

  if (sizesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Sizes</h3>
            <p className="text-red-600">{sizesError}</p>
            <button 
              onClick={refetchSizes} 
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
              <h1 className="text-3xl font-bold text-gray-900">Sizes</h1>
              <p className="mt-2 text-gray-600">
                Manage your product sizes and dimensions
              </p>
            </div>
            <button 
              onClick={handleAddSize}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Size
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
                placeholder="Search sizes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSizes.map((size: Size) => (
            <div key={size._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Size Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {size.imageUrl ? (
                  <img
                    src={size.imageUrl}
                    alt={size.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {size.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm">No Image</p>
                  </div>
                )}
              </div>

              {/* Size Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {size.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    size.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {size.status}
                  </span>
                </div>
                
                {size.description && (
                  <div className="text-gray-600 text-sm mb-4">
                    <MarkdownDisplay 
                      content={size.description} 
                      maxLength={100}
                      className="line-clamp-2"
                    />
                  </div>
                )}



                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditSize(size)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(size._id || size.id || '')}
                      disabled={deleteLoading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {size.createdAt ? new Date(size.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSizes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CubeIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sizes found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search'
                : 'Get started by adding your first size'
              }
            </p>
          </div>
        )}
      </div>

      {/* Size Form Modal */}
      <Modal
        isOpen={showSizeModal}
        onClose={handleCancelSize}
        title={editingSize ? 'Edit Size' : 'Add New Size'}
        size="lg"
      >
        <SizeForm
          size={editingSize || undefined}
          onSubmit={handleSizeSubmit}
          onCancel={handleCancelSize}
          loading={createLoading || updateLoading}
        />
      </Modal>
    </div>
  );
};

export default Sizes; 