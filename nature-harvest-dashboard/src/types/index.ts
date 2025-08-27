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
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    vitaminC?: number;
    vitaminA?: number;
    calcium?: number;
    iron?: number;
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
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    vitaminC?: number;
    vitaminA?: number;
    calcium?: number;
    iron?: number;
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