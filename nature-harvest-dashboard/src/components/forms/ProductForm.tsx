import React, { useState } from 'react';
import FormField from './FormField';
import MarkdownField from './MarkdownField';
import ImageUpload from './ImageUpload';
import GalleryUpload from './GalleryUpload';
import NutrientsForm from './NutrientsForm';
import { useApi } from '../../hooks/useApi';
import { brandsAPI, flavorsAPI, sizesAPI } from '../../services/api';
import { Product, ProductFormData } from '../../types';
import { Brand } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: ProductFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    brandId: typeof product?.brandId === 'string' ? product.brandId : product?.brandId?._id || '',
    sizeId: typeof product?.sizeId === 'string' ? product.sizeId : product?.sizeId?._id || '',
    flavorId: typeof product?.flavorId === 'string' ? product.flavorId : product?.flavorId?._id || '',
    imageUrl: product?.imageUrl || '',
    gallery: product?.gallery || [],
    nutrients: product?.nutrients || {},
    status: product?.status || 'Active'
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  // Fetch brands, flavors, and sizes for dropdowns
  const { data: brandsResponse } = useApi(brandsAPI.getAll);
  const { data: flavorsResponse } = useApi(flavorsAPI.getAll);
  const { data: sizesResponse } = useApi(sizesAPI.getAll);
  
  // Extract arrays from the response structure
  const brands: Brand[] = Array.isArray(brandsResponse) ? brandsResponse : 
                         (brandsResponse as any)?.data || [];
  const flavors: any[] = Array.isArray(flavorsResponse) ? flavorsResponse : 
                        (flavorsResponse as any)?.data || [];
  const sizes: any[] = Array.isArray(sizesResponse) ? sizesResponse : 
                      (sizesResponse as any)?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string) => {
    if (typeof e === 'string') {
      // Handle MarkdownField onChange
      setFormData(prev => ({
        ...prev,
        description: e
      }));
      
      // Clear error when user starts typing
      if (errors.description) {
        setErrors(prev => ({
          ...prev,
          description: undefined
        }));
      }
    } else {
      // Handle regular form field onChange
      const { name, value } = e.target;
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Clear error when user starts typing
      if (errors[name as keyof ProductFormData]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };



  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.brandId) {
      newErrors.brandId = 'Brand is required';
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

  const brandOptions = (brands && Array.isArray(brands) ? brands : []).map((brand: any) => ({
    value: brand._id || brand.id,
    label: brand.name
  }));

  const flavorOptions = [
    { value: '', label: 'No Flavor' },
    ...(flavors && Array.isArray(flavors) ? flavors : []).map((flavor: any) => ({
      value: flavor._id || flavor.id,
      label: flavor.name
    }))
  ];

  const sizeOptions = [
    { value: '', label: 'No Size' },
    ...(sizes && Array.isArray(sizes) ? sizes : []).map((size: any) => ({
      value: size._id || size.id,
      label: size.name
    }))
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Product Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
          error={errors.name}
        />

        <FormField
          label="Brand"
          name="brandId"
          type="select"
          value={formData.brandId}
          onChange={handleChange}
          required
          options={brandOptions}
          error={errors.brandId}
        />

        <FormField
          label="Flavor"
          name="flavorId"
          type="select"
          value={formData.flavorId || ''}
          onChange={handleChange}
          options={flavorOptions}
          error={errors.flavorId}
        />

        <FormField
          label="Size"
          name="sizeId"
          type="select"
          value={formData.sizeId || ''}
          onChange={handleChange}
          options={sizeOptions}
          error={errors.sizeId}
        />

                          <ImageUpload
           onImageUpload={(imageUrl) => {
             setFormData(prev => ({ ...prev, imageUrl }));
           }}
           currentImageUrl={formData.imageUrl}
           label="Product Image"
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

       <GalleryUpload
         onGalleryUpdate={(gallery) => {
           setFormData(prev => ({ ...prev, gallery }));
         }}
         currentGallery={formData.gallery}
         label="Product Gallery"
       />

       <MarkdownField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter product description"
        required
        error={errors.description}
      />

       <NutrientsForm
         nutrients={formData.nutrients || {}}
         onChange={(nutrients) => {
           setFormData(prev => ({ ...prev, nutrients }));
         }}
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
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 