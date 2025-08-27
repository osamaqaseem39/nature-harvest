import { config } from './config';

const { baseUrl: API_BASE_URL, timeout: API_TIMEOUT, retryAttempts: API_RETRY_ATTEMPTS } = config.api;

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  logoUrl?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Flavor {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Size {
  _id: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  brandId: Brand;
  sizeId?: Size;
  flavorId?: Flavor;
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
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BrandsResponse {
  success: boolean;
  data: Brand[];
}

export interface FlavorsResponse {
  success: boolean;
  data: Flavor[];
}

export interface SizesResponse {
  success: boolean;
  data: Size[];
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`API request timed out after ${API_TIMEOUT}ms`);
        }
        throw error;
      }
      throw new Error('Unknown API error occurred');
    }
  }

  // Brands API
  async getBrands(): Promise<BrandsResponse> {
    return this.request<BrandsResponse>('/brands');
  }

  // Products API
  async getProducts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    brandId?: string;
    flavorId?: string;
    sizeId?: string;
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.brandId) searchParams.append('brandId', params.brandId);
    if (params?.flavorId) searchParams.append('flavorId', params.flavorId);
    if (params?.sizeId) searchParams.append('sizeId', params.sizeId);

    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ProductsResponse>(endpoint);
  }

  // Flavors API
  async getFlavors(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<FlavorsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = `/flavors${queryString ? `?${queryString}` : ''}`;
    
    return this.request<FlavorsResponse>(endpoint);
  }

  // Sizes API
  async getSizes(): Promise<SizesResponse> {
    return this.request<SizesResponse>('/sizes');
  }
}

export const apiService = new ApiService(); 