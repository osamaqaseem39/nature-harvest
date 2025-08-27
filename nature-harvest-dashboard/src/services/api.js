import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3002',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (userData) => api.put('/api/auth/profile', userData),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getHealth: () => api.get('/api/dashboard/health'),
  getActivity: () => api.get('/api/dashboard/activity'),
  getRecentProducts: () => api.get('/api/dashboard/recent-products'),
  getRecentServices: () => api.get('/api/dashboard/recent-services'),
  getRecentBlogs: () => api.get('/api/dashboard/recent-blogs'),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (productData) => api.post('/api/products', productData),
  update: (id, productData) => api.put(`/api/products/${id}`, productData),
  delete: (id) => api.delete(`/api/products/${id}`),
  getByCategory: (categoryId) => api.get(`/api/products/category/${categoryId}`),
  getBySubcategory: (subcategoryId) => api.get(`/api/products/subcategory/${subcategoryId}`),
  search: (query) => api.get('/api/products/search', { params: { q: query } }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (categoryData) => api.post('/api/categories', categoryData),
  update: (id, categoryData) => api.put(`/api/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// Subcategories API
export const subcategoriesAPI = {
  getAll: () => api.get('/api/subcategories'),
  getById: (id) => api.get(`/api/subcategories/${id}`),
  create: (subcategoryData) => api.post('/api/subcategories', subcategoryData),
  update: (id, subcategoryData) => api.put(`/api/subcategories/${id}`, subcategoryData),
  delete: (id) => api.delete(`/api/subcategories/${id}`),
  getByCategory: (categoryId) => api.get(`/api/subcategories/category/${categoryId}`),
};

// Brands API
export const brandsAPI = {
  getAll: () => api.get('/api/brands'),
  getById: (id) => api.get(`/api/brands/${id}`),
  create: (brandData) => api.post('/api/brands', brandData),
  update: (id, brandData) => api.put(`/api/brands/${id}`, brandData),
  delete: (id) => api.delete(`/api/brands/${id}`),
};

// Flavors API
export const flavorsAPI = {
  getAll: () => api.get('/api/flavors'),
  getById: (id) => api.get(`/api/flavors/${id}`),
  create: (flavorData) => api.post('/api/flavors', flavorData),
  update: (id, flavorData) => api.put(`/api/flavors/${id}`, flavorData),
  delete: (id) => api.delete(`/api/flavors/${id}`),
};

// Sizes API
export const sizesAPI = {
  getAll: () => api.get('/api/sizes'),
  getById: (id) => api.get(`/api/sizes/${id}`),
  create: (sizeData) => api.post('/api/sizes', sizeData),
  update: (id, sizeData) => api.put(`/api/sizes/${id}`, sizeData),
  delete: (id) => api.delete(`/api/sizes/${id}`),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/api/services'),
  getById: (id) => api.get(`/api/services/${id}`),
  create: (serviceData) => api.post('/api/services', serviceData),
  update: (id, serviceData) => api.put(`/api/services/${id}`, serviceData),
  delete: (id) => api.delete(`/api/services/${id}`),
};

// Blogs API
export const blogsAPI = {
  getAll: (params = {}) => api.get('/api/blogs', { params }),
  getById: (id) => api.get(`/api/blogs/${id}`),
  create: (blogData) => api.post('/api/blogs', blogData),
  update: (id, blogData) => api.put(`/api/blogs/${id}`, blogData),
  delete: (id) => api.delete(`/api/blogs/${id}`),
  publish: (id) => api.put(`/api/blogs/${id}/publish`),
  unpublish: (id) => api.put(`/api/blogs/${id}/unpublish`),
};

// Quotes API
export const quotesAPI = {
  getAll: () => api.get('/api/quotes'),
  getById: (id) => api.get(`/api/quotes/${id}`),
  create: (quoteData) => api.post('/api/quotes', quoteData),
  update: (id, quoteData) => api.put(`/api/quotes/${id}`, quoteData),
  delete: (id) => api.delete(`/api/quotes/${id}`),
  approve: (id) => api.put(`/api/quotes/${id}/approve`),
  reject: (id) => api.put(`/api/quotes/${id}/reject`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/api/suppliers'),
  getById: (id) => api.get(`/api/suppliers/${id}`),
  create: (supplierData) => api.post('/api/suppliers', supplierData),
  update: (id, supplierData) => api.put(`/api/suppliers/${id}`, supplierData),
  delete: (id) => api.delete(`/api/suppliers/${id}`),
  approve: (id) => api.put(`/api/suppliers/${id}/approve`),
  reject: (id) => api.put(`/api/suppliers/${id}/reject`),
};

// File upload helper
export const uploadFile = async (file, type = 'product') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  return api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Export the main api instance for custom requests
export default api; 