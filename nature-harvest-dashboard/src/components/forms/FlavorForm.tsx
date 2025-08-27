import React, { useState } from 'react';
import FormField from './FormField';
import MarkdownField from './MarkdownField';
import ImageUpload from './ImageUpload';

interface Flavor {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: 'Active' | 'Inactive';
}

interface FlavorFormProps {
  flavor?: Flavor;
  onSubmit: (flavor: Flavor) => void;
  onCancel: () => void;
  loading?: boolean;
}

const FlavorForm: React.FC<FlavorFormProps> = ({
  flavor,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Flavor>({
    name: flavor?.name || '',
    description: flavor?.description || '',
    imageUrl: flavor?.imageUrl || '',
    status: flavor?.status || 'Active'
  });

  const [errors, setErrors] = useState<Partial<Flavor>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof Flavor]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Flavor> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Flavor name is required';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Flavor Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter flavor name"
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
          label="Flavor Image"
          currentImageUrl={formData.imageUrl || ''}
          onImageUpload={(url: string) => setFormData(prev => ({ ...prev, imageUrl: url }))}
        />
      </div>

      <MarkdownField
        label="Description"
        name="description"
        value={formData.description || ''}
        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
        placeholder="Enter flavor description"
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
          {loading ? 'Saving...' : flavor ? 'Update Flavor' : 'Create Flavor'}
        </button>
      </div>
    </form>
  );
};

export default FlavorForm; 