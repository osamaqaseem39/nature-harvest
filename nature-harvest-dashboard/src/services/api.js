import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://nature-harvest-q2ra.vercel.app/api',
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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getHealth: () => api.get('/dashboard/health'),
  getActivity: () => api.get('/dashboard/activity'),
  getRecentProducts: () => api.get('/dashboard/recent-products'),
  getRecentServices: () => api.get('/dashboard/recent-services'),
  getRecentBlogs: () => api.get('/dashboard/recent-blogs'),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getBySubcategory: (subcategoryId) => api.get(`/products/subcategory/${subcategoryId}`),
  search: (query) => api.get('/products/search', { params: { q: query } }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Subcategories API
export const subcategoriesAPI = {
  getAll: () => api.get('/subcategories'),
  getById: (id) => api.get(`/subcategories/${id}`),
  create: (subcategoryData) => api.post('/subcategories', subcategoryData),
  update: (id, subcategoryData) => api.put(`/subcategories/${id}`, subcategoryData),
  delete: (id) => api.delete(`/subcategories/${id}`),
  getByCategory: (categoryId) => api.get(`/subcategories/category/${categoryId}`),
};

// Brands API
export const brandsAPI = {
  getAll: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  create: (brandData) => api.post('/brands', brandData),
  update: (id, brandData) => api.put(`/brands/${id}`, brandData),
  delete: (id) => api.delete(`/brands/${id}`),
};

// Flavors API
export const flavorsAPI = {
  getAll: () => api.get('/flavors'),
  getById: (id) => api.get(`/flavors/${id}`),
  create: (flavorData) => api.post('/flavors', flavorData),
  update: (id, flavorData) => api.put(`/flavors/${id}`, flavorData),
  delete: (id) => api.delete(`/flavors/${id}`),
};

// Sizes API
export const sizesAPI = {
  getAll: () => api.get('/sizes'),
  getById: (id) => api.get(`/sizes/${id}`),
  create: (sizeData) => api.post('/sizes', sizeData),
  update: (id, sizeData) => api.put(`/sizes/${id}`, sizeData),
  delete: (id) => api.delete(`/sizes/${id}`),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post('/services', serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
};

// Blogs API
export const blogsAPI = {
  getAll: (params = {}) => api.get('/blogs', { params }),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (blogData) => api.post('/blogs', blogData),
  update: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  delete: (id) => api.delete(`/blogs/${id}`),
  publish: (id) => api.put(`/blogs/${id}/publish`),
  unpublish: (id) => api.put(`/blogs/${id}/unpublish`),
};

// Quotes API
export const quotesAPI = {
  getAll: () => api.get('/quotes'),
  getById: (id) => api.get(`/quotes/${id}`),
  create: (quoteData) => api.post('/quotes', quoteData),
  update: (id, quoteData) => api.put(`/quotes/${id}`, quoteData),
  delete: (id) => api.delete(`/quotes/${id}`),
  approve: (id) => api.put(`/quotes/${id}/approve`),
  reject: (id) => api.put(`/quotes/${id}/reject`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (supplierData) => api.post('/suppliers', supplierData),
  update: (id, supplierData) => api.put(`/suppliers/${id}`, supplierData),
  delete: (id) => api.delete(`/suppliers/${id}`),
  approve: (id) => api.put(`/suppliers/${id}/approve`),
  reject: (id) => api.put(`/suppliers/${id}/reject`),
};

// File upload helper
export const uploadFile = async (file, type = 'product') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Export the main api instance for custom requests
export default api; 