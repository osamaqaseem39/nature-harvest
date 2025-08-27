import React, { useState } from 'react';
import FormField from './FormField';
import MarkdownField from './MarkdownField';
import ImageUpload from './ImageUpload';

interface Category {
  id?: string;
  name: string;
  image?: string;
  description?: string;
  parent?: string;
}

interface CategoryFormProps {
  category?: Category;
  parentCategories?: { id?: string; _id?: string; name: string }[];
  onSubmit: (category: Category) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  parentCategories = [],
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Category>({
    name: category?.name || '',
    image: category?.image || '',
    description: category?.description || '',
    parent: category?.parent || ''
  });

  const [errors, setErrors] = useState<Partial<Category>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof Category]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Category> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const parentCategoryOptions = parentCategories
    .filter(cat => cat._id || cat.id)
    .map(cat => ({
      value: cat._id || cat.id || '',
      label: cat.name
    }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Category Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter category name"
          required
          error={errors.name}
        />

        <ImageUpload
          onImageUpload={(imageUrl) => {
            setFormData(prev => ({ ...prev, image: imageUrl }));
          }}
          currentImageUrl={formData.image}
          label="Category Image"
        />

        <FormField
          label="Parent Category"
          name="parent"
          type="select"
          value={formData.parent || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'No Parent (Root Category)' },
            ...parentCategoryOptions
          ]}
        />
      </div>

      <MarkdownField
        label="Description"
        name="description"
        value={formData.description || ''}
        onChange={(markdown) => setFormData(prev => ({ ...prev, description: markdown }))}
        placeholder="Enter category description"
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm; 