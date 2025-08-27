import React, { useState } from 'react';
import FormField from './FormField';
import MarkdownField from './MarkdownField';
import ImageUpload from './ImageUpload';

interface Size {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: 'Active' | 'Inactive';
}

interface SizeFormProps {
  size?: Size;
  onSubmit: (size: Size) => void;
  onCancel: () => void;
  loading?: boolean;
}

const SizeForm: React.FC<SizeFormProps> = ({
  size,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Size>({
    name: size?.name || '',
    description: size?.description || '',
    imageUrl: size?.imageUrl || '',
    status: size?.status || 'Active'
  });

  const [errors, setErrors] = useState<Partial<Size>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof Size]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Size> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Size name is required';
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
          label="Size Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter size name"
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


      </div>

      <ImageUpload
        label="Size Image"
        currentImageUrl={formData.imageUrl || ''}
        onImageUpload={(url: string) => {
          setFormData(prev => ({ ...prev, imageUrl: url }));
        }}
      />

      <MarkdownField
        label="Description"
        name="description"
        value={formData.description || ''}
        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
        placeholder="Enter size description"
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
          {loading ? 'Saving...' : size ? 'Update Size' : 'Create Size'}
        </button>
      </div>
    </form>
  );
};

export default SizeForm; 