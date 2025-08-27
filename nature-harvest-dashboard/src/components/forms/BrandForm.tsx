import React, { useState } from 'react';
import FormField from './FormField';
import MarkdownField from './MarkdownField';
import ImageUpload from './ImageUpload';

interface Brand {
  id?: string;
  name: string;
  imageUrl?: string;
  logoUrl?: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (brand: Brand) => void;
  onCancel: () => void;
  loading?: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({
  brand,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Brand>({
    name: brand?.name || '',
    imageUrl: brand?.imageUrl || brand?.logoUrl || '',
    logoUrl: brand?.logoUrl || '',
    description: brand?.description || '',
    status: brand?.status || 'Active'
  });

  const [errors, setErrors] = useState<Partial<Brand>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof Brand]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Brand> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Ensure imageUrl is included even if it's empty
      const submitData = {
        ...formData,
        imageUrl: formData.imageUrl || ''
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Brand Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter brand name"
          required
          error={errors.name}
        />

        <FormField
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleChange}
          required
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' }
          ]}
        />

        <ImageUpload
          onImageUpload={(imageUrl) => {
            setFormData(prev => ({ ...prev, imageUrl: imageUrl }));
          }}
          currentImageUrl={formData.imageUrl}
          label="Brand Image"
        />
      </div>

      <MarkdownField
        label="Description"
        name="description"
        value={formData.description || ''}
        onChange={(markdown) => setFormData(prev => ({ ...prev, description: markdown }))}
        placeholder="Enter brand description"
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
          {loading ? 'Saving...' : brand ? 'Update Brand' : 'Create Brand'}
        </button>
      </div>
    </form>
  );
};

export default BrandForm; 