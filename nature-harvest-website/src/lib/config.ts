// Configuration utility for environment variables
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
  },

  // Website Configuration
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Nature Harvest',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Premium organic beverages and natural products',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Contact Information
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@natureharvest.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1-555-123-4567',
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || '123 Nature Way, Green City, GC 12345',
  },

  // Social Media Links
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/natureharvest',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/natureharvest',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/natureharvest',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/natureharvest',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableSocialSharing: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_SHARING !== 'false',
    enableProductFilters: process.env.NEXT_PUBLIC_ENABLE_PRODUCT_FILTERS !== 'false',
    enableSearch: process.env.NEXT_PUBLIC_ENABLE_SEARCH !== 'false',
  },

  // Pagination Settings
  pagination: {
    productsPerPage: parseInt(process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE || '12'),
    featuredProductsLimit: parseInt(process.env.NEXT_PUBLIC_FEATURED_PRODUCTS_LIMIT || '8'),
    demoProductsLimit: parseInt(process.env.NEXT_PUBLIC_DEMO_PRODUCTS_LIMIT || '8'),
  },

  // Image Configuration
  images: {
    defaultProductImage: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE || '/images/product-placeholder.png',
    defaultBrandImage: process.env.NEXT_PUBLIC_DEFAULT_BRAND_IMAGE || '/images/placeholder-brand.png',
    quality: parseInt(process.env.NEXT_PUBLIC_IMAGE_QUALITY || '85'),
  },

  // Development Settings
  development: {
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    showApiErrors: process.env.NEXT_PUBLIC_SHOW_API_ERRORS !== 'false',
  },

  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// Type-safe config access
export type Config = typeof config;

// Helper function to get nested config values
export function getConfig<T extends keyof Config>(key: T): Config[T] {
  return config[key];
}

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof Config['features']): boolean {
  return config.features[feature];
}

// Helper function to get API configuration
export function getApiConfig() {
  return config.api;
}

// Helper function to get site configuration
export function getSiteConfig() {
  return config.site;
} 