import { config } from './config';
import { getToken } from './auth';
import { apiCache } from './apiCache';

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

export interface ProductResponse {
  success: boolean;
  data: Product;
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

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  companyType: string;
  businessDescription: string;
  partnershipType: string[];
  targetMarkets: string[];
  annualRevenue: string;
  employeeCount: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  additionalInfo?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Contacted';
  notes?: string;
  adminResponse?: string;
  respondedBy?: User;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  companyType: string;
  businessDescription: string;
  partnershipType: string[];
  targetMarkets: string[];
  annualRevenue: string;
  employeeCount: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  additionalInfo?: string;
}

export interface PartnersResponse {
  success: boolean;
  data: Partner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PartnerResponse {
  success: boolean;
  data: Partner;
}

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  };
  skills: string[];
  education: string;
  applicationDeadline: string;
  positions: number;
  isRemote: boolean;
  isUrgent: boolean;
  tags: string[];
  status: string;
  views: number;
  applications: number;
  createdBy: User;
  publishedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  success: boolean;
  data: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JobResponse {
  success: boolean;
  data: Job;
}

export interface CandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    gpa: string;
    isCurrent: boolean;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    achievements: string[];
  }>;
  skills: Array<{
    name: string;
    level: string;
    yearsOfExperience: string;
  }>;
  resume: {
    url: string;
    filename: string;
  };
  coverLetter?: {
    content: string;
  };
}

export interface ApplicationData {
  jobId: string;
  candidateData: CandidateData;
  coverLetter?: {
    content: string;
  };
  additionalDocuments?: Array<{
    name: string;
    url: string;
    filename: string;
  }>;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: {
    applicationId: string;
    candidateId: string;
    status: string;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit, retryCount = 0): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const bearer = getToken()
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
          ...options?.headers,
        },
        signal: controller.signal,
        mode: 'cors', // Explicitly set CORS mode
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Better error handling for different HTTP status codes
        const errorMessage = response.status === 404 
          ? `Endpoint not found: ${endpoint}`
          : response.status >= 500 
          ? `Server error (${response.status}): ${response.statusText}`
          : `API request failed (${response.status}): ${response.statusText}`;
        
        console.error(`API Error - URL: ${url}, Status: ${response.status}, Message: ${response.statusText}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Validate response data
      if (!data) {
        console.warn(`API returned null/undefined data for ${endpoint}`);
        throw new Error('API returned null response');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry logic for network errors
      if (retryCount < API_RETRY_ATTEMPTS && error instanceof Error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          console.warn(`Network error, retrying... (${retryCount + 1}/${API_RETRY_ATTEMPTS})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return this.request<T>(endpoint, options, retryCount + 1);
        }
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`API Timeout - URL: ${url}, Timeout: ${API_TIMEOUT}ms`);
          throw new Error(`API request timed out after ${API_TIMEOUT}ms`);
        }
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          console.error(`Network Error - URL: ${url}, Possible CORS or network issue`);
          throw new Error('Network error: Unable to connect to the API server. Please check your internet connection.');
        }
        console.error(`API Error - URL: ${url}, Error:`, error);
        throw error;
      }
      
      console.error(`Unknown API Error - URL: ${url}`);
      throw new Error('Unknown API error occurred');
    }
  }

  // Brands API
  async getBrands(): Promise<BrandsResponse> {
    return apiCache.getOrSet(
      'brands',
      () => this.request<BrandsResponse>('/brands'),
      5 * 60 * 1000 // 5 minutes cache
    );
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
    const cacheKey = `products_${queryString || 'default'}`;
    
    return apiCache.getOrSet(
      cacheKey,
      () => this.request<ProductsResponse>(endpoint),
      2 * 60 * 1000 // 2 minutes cache for products
    );
  }

  async getProduct(id: string): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${id}`);
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

  // Partner API
  async submitPartnerApplication(data: PartnerFormData): Promise<PartnerResponse> {
    return this.request<PartnerResponse>('/partners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPartners(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<PartnersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/partners?${queryString}` : '/partners';
    
    return this.request<PartnersResponse>(endpoint);
  }

  async getPartner(id: string): Promise<PartnerResponse> {
    return this.request<PartnerResponse>(`/partners/${id}`);
  }

  async updatePartnerStatus(id: string, data: { status: string; notes?: string; adminResponse?: string }): Promise<PartnerResponse> {
    return this.request<PartnerResponse>(`/partners/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePartner(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/partners/${id}`, {
      method: 'DELETE',
    });
  }

  async getPartnerStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/partners/stats');
  }

  // Career API
  async getJobs(params?: { page?: number; limit?: number; department?: string; location?: string; type?: string; experience?: string; search?: string; status?: string }): Promise<JobsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.department) queryParams.append('department', params.department);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.experience) queryParams.append('experience', params.experience);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/careers/jobs?${queryString}` : '/careers/jobs';
    
    return this.request<JobsResponse>(endpoint);
  }

  async getJob(id: string): Promise<JobResponse> {
    return this.request<JobResponse>(`/careers/jobs/${id}`);
  }

  async searchJobs(params: { q?: string; department?: string; location?: string; type?: string; experience?: string; page?: number; limit?: number }): Promise<JobsResponse> {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append('q', params.q);
    if (params.department) queryParams.append('department', params.department);
    if (params.location) queryParams.append('location', params.location);
    if (params.type) queryParams.append('type', params.type);
    if (params.experience) queryParams.append('experience', params.experience);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/careers/jobs/search?${queryString}` : '/careers/jobs/search';
    
    return this.request<JobsResponse>(endpoint);
  }

  async getJobsByDepartment(department: string, limit?: number): Promise<JobsResponse> {
    const params = limit ? `?limit=${limit}` : '';
    return this.request<JobsResponse>(`/careers/jobs/department/${department}${params}`);
  }

  async submitJobApplication(data: ApplicationData): Promise<ApplicationResponse> {
    return this.request<ApplicationResponse>('/careers/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(); 