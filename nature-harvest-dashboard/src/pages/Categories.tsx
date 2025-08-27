import React, { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { categoriesAPI } from '../services/api';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import CategoryForm from '../components/forms/CategoryForm';
import Modal from '../components/Modal';
import MarkdownDisplay from '../components/common/MarkdownDisplay';

// Type definitions
interface Category {
  id?: string;
  _id?: string;
  name: string;
  image?: string;
  description?: string;
  parent?: string;
  createdAt?: string;
}

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categoriesResponse, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useApi(categoriesAPI.getAll);
  
  // Extract categories array from the response structure
  const categories = (categoriesResponse as any)?.data || [];
  
  const { mutate: deleteCategory, loading: deleteLoading } = useApiMutation(categoriesAPI.delete);
  const { mutate: createCategory, loading: createLoading } = useApiMutation(categoriesAPI.create);
  const { mutate: updateCategory, loading: updateLoading } = useApiMutation(categoriesAPI.update);

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        refetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (categoryData: any) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      refetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleCancelCategory = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const filteredCategories = (Array.isArray(categories) ? categories : []).filter((category: Category) => {
    const matchesSearch = category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getParentCategoryName = (parentId: string) => {
    if (!parentId) return null;
    if (!Array.isArray(categories)) return 'Unknown';
    const parent = (categories as Category[]).find((cat: Category) => cat._id === parentId);
    return parent?.name || 'Unknown';
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Categories</h3>
            <p className="text-red-600">{categoriesError}</p>
            <button 
              onClick={refetchCategories} 
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
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="mt-2 text-gray-600">
                Manage your product categories and organization
              </p>
            </div>
            <button 
              onClick={handleAddCategory}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Category
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category: Category) => (
            <div key={category._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Category Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm">No Image</p>
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                
                {category.description && (
                  <div className="text-gray-600 text-sm mb-4">
                    <MarkdownDisplay 
                      content={category.description} 
                      maxLength={100}
                      className="line-clamp-2"
                    />
                  </div>
                )}

                {category.parent && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">Parent: </span>
                    <span className="text-sm text-gray-600">{getParentCategoryName(category.parent)}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id || category.id || '')}
                      disabled={deleteLoading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CubeIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search'
                : 'Get started by adding your first category'
              }
            </p>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={handleCancelCategory}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="lg"
      >
                 <CategoryForm
           category={editingCategory || undefined}
           parentCategories={Array.isArray(categories) ? categories : []}
           onSubmit={handleCategorySubmit}
           onCancel={handleCancelCategory}
           loading={createLoading || updateLoading}
         />
      </Modal>
    </div>
  );
};

export default Categories; 