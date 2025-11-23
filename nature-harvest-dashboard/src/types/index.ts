export interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  brandId: string | { _id: string; name: string; imageUrl?: string; logoUrl?: string };
  sizeId?: string | { _id: string; name: string };
  flavorId?: string | { _id: string; name: string };
  imageUrl?: string;
  gallery?: string[];
  nutrients?: {
    calories?: number | string;
    protein?: number | string;
    carbohydrates?: number | string;
    fat?: number | string;
    saturatedFat?: number | string;
    fiber?: number | string;
    sugar?: number | string;
    sodium?: number | string;
    vitaminC?: number | string;
    vitaminA?: number | string;
    calcium?: number | string;
    iron?: number | string;
  };
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface ProductFormData {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  brandId: string;
  sizeId?: string;
  flavorId?: string;
  imageUrl?: string;
  gallery?: string[];
  nutrients?: {
    calories?: number | string;
    protein?: number | string;
    carbohydrates?: number | string;
    fat?: number | string;
    saturatedFat?: number | string;
    fiber?: number | string;
    sugar?: number | string;
    sodium?: number | string;
    vitaminC?: number | string;
    vitaminA?: number | string;
    calcium?: number | string;
    iron?: number | string;
  };
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  imageUrl?: string;
  logoUrl?: string;
}

export interface Size {
  _id: string;
  name: string;
}

export interface Flavor {
  _id: string;
  name: string;
} 