import React, { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { flavorsAPI } from '../services/api';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import FlavorForm from '../components/forms/FlavorForm';
import Modal from '../components/Modal';
import MarkdownDisplay from '../components/common/MarkdownDisplay';

// Type definitions
interface Flavor {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

const Flavors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFlavorModal, setShowFlavorModal] = useState(false);
  const [editingFlavor, setEditingFlavor] = useState<Flavor | null>(null);

  const { data: flavorsResponse, loading: flavorsLoading, error: flavorsError, refetch: refetchFlavors } = useApi(flavorsAPI.getAll);
  
  // Extract flavors array from the response structure
  const flavors = (flavorsResponse as any)?.data || [];
  
  const { mutate: deleteFlavor, loading: deleteLoading } = useApiMutation(flavorsAPI.delete);
  const { mutate: createFlavor, loading: createLoading } = useApiMutation(flavorsAPI.create);
  const { mutate: updateFlavor, loading: updateLoading } = useApiMutation(flavorsAPI.update);

  const handleDelete = async (flavorId: string) => {
    if (window.confirm('Are you sure you want to delete this flavor?')) {
      try {
        await deleteFlavor(flavorId);
        refetchFlavors();
      } catch (error) {
        console.error('Failed to delete flavor:', error);
      }
    }
  };

  const handleAddFlavor = () => {
    setEditingFlavor(null);
    setShowFlavorModal(true);
  };

  const handleEditFlavor = (flavor: Flavor) => {
    setEditingFlavor(flavor);
    setShowFlavorModal(true);
  };

  const handleFlavorSubmit = async (flavorData: any) => {
    try {
      if (editingFlavor) {
        await updateFlavor(editingFlavor._id, flavorData);
      } else {
        await createFlavor(flavorData);
      }
      setShowFlavorModal(false);
      setEditingFlavor(null);
      refetchFlavors();
    } catch (error) {
      console.error('Failed to save flavor:', error);
    }
  };

  const handleCancelFlavor = () => {
    setShowFlavorModal(false);
    setEditingFlavor(null);
  };

  const filteredFlavors = (Array.isArray(flavors) ? flavors : []).filter((flavor: Flavor) => {
    const matchesSearch = flavor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flavor.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (flavorsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flavors...</p>
        </div>
      </div>
    );
  }

  if (flavorsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Flavors</h3>
            <p className="text-red-600">{flavorsError}</p>
            <button 
              onClick={refetchFlavors} 
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
              <h1 className="text-3xl font-bold text-gray-900">Flavors</h1>
              <p className="mt-2 text-gray-600">
                Manage your product flavors and variations
              </p>
            </div>
            <button 
              onClick={handleAddFlavor}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Flavor
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
                placeholder="Search flavors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Flavors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlavors.map((flavor: Flavor) => (
            <div key={flavor._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Flavor Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {flavor.imageUrl ? (
                  <img
                    src={flavor.imageUrl}
                    alt={flavor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {flavor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm">No Image</p>
                  </div>
                )}
              </div>

              {/* Flavor Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {flavor.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    flavor.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {flavor.status}
                  </span>
                </div>
                
                {flavor.description && (
                  <div className="text-gray-600 text-sm mb-4">
                    <MarkdownDisplay 
                      content={flavor.description} 
                      maxLength={100}
                      className="line-clamp-2"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditFlavor(flavor)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(flavor._id || flavor.id || '')}
                      disabled={deleteLoading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {flavor.createdAt ? new Date(flavor.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFlavors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CubeIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flavors found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search'
                : 'Get started by adding your first flavor'
              }
            </p>
          </div>
        )}
      </div>

      {/* Flavor Form Modal */}
      <Modal
        isOpen={showFlavorModal}
        onClose={handleCancelFlavor}
        title={editingFlavor ? 'Edit Flavor' : 'Add New Flavor'}
        size="lg"
      >
        <FlavorForm
          flavor={editingFlavor || undefined}
          onSubmit={handleFlavorSubmit}
          onCancel={handleCancelFlavor}
          loading={createLoading || updateLoading}
        />
      </Modal>
    </div>
  );
};

export default Flavors; 