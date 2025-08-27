# API Setup Guide

## Environment Configuration

To connect the website to your API server, create a `.env.local` file in the root of the website project. You can copy from the example file:

```bash
cp env.example .env.local
```

Then edit `.env.local` with your specific configuration:

```env
# ========================================
# API Configuration
# ========================================
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3

# ========================================
# Website Configuration
# ========================================
NEXT_PUBLIC_SITE_NAME=Nature Harvest
NEXT_PUBLIC_SITE_DESCRIPTION=Premium organic beverages and natural products
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ========================================
# Contact Information
# ========================================
NEXT_PUBLIC_CONTACT_EMAIL=info@natureharvest.com
NEXT_PUBLIC_CONTACT_PHONE=+1-555-123-4567
NEXT_PUBLIC_CONTACT_ADDRESS=123 Nature Way, Green City, GC 12345

# ========================================
# Feature Flags
# ========================================
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SOCIAL_SHARING=true
NEXT_PUBLIC_ENABLE_PRODUCT_FILTERS=true
NEXT_PUBLIC_ENABLE_SEARCH=true

# ========================================
# Pagination Settings
# ========================================
NEXT_PUBLIC_PRODUCTS_PER_PAGE=12
NEXT_PUBLIC_FEATURED_PRODUCTS_LIMIT=8
NEXT_PUBLIC_DEMO_PRODUCTS_LIMIT=8

# ========================================
# Image Configuration
# ========================================
NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE=/images/product-placeholder.png
NEXT_PUBLIC_DEFAULT_BRAND_IMAGE=/images/placeholder-brand.png
NEXT_PUBLIC_IMAGE_QUALITY=85

# ========================================
# Development Settings
# ========================================
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SHOW_API_ERRORS=true
```

## Features Implemented

### Dynamic Brands
- Brands are now fetched from the API instead of being hardcoded
- Only active brands are displayed
- Loading and error states are handled gracefully
- Fallback images for missing brand logos

### Dynamic Products with Filtering
- Products are fetched from the API with pagination
- Advanced filtering by:
  - Search term (searches product name and description)
  - Brand
  - Flavor
  - Size
- Real-time filtering with debounced search
- Clear filters functionality
- Pagination support
- Loading and error states

### Product Display
- Shows product images with fallback
- Displays brand, flavor, and size information
- Nutritional information when available
- Responsive grid layout
- Product cards with hover effects

## API Endpoints Used

- `GET /api/brands` - Fetch all brands
- `GET /api/products` - Fetch products with filtering
- `GET /api/flavors` - Fetch all flavors
- `GET /api/sizes` - Fetch all sizes

## Filter Parameters

The products API supports the following query parameters:
- `page` - Page number for pagination
- `limit` - Number of products per page
- `status` - Filter by status (Active/Inactive)
- `search` - Search in name and description
- `brandId` - Filter by brand ID
- `flavorId` - Filter by flavor ID
- `sizeId` - Filter by size ID

## Getting Started

1. **Copy the environment example file:**
   ```bash
   cp env.example .env.local
   ```

2. **Edit the `.env.local` file** with your specific configuration

3. **Make sure your API server is running** on the configured URL

4. **Start the website development server:**
   ```bash
   npm run dev
   ```

5. **Test the API connection:**
   ```bash
   node test-api.js
   ```

## Configuration Categories

### API Configuration
- `NEXT_PUBLIC_API_URL` - Your API server URL
- `NEXT_PUBLIC_API_TIMEOUT` - Request timeout in milliseconds
- `NEXT_PUBLIC_API_RETRY_ATTEMPTS` - Number of retry attempts

### Feature Flags
- `NEXT_PUBLIC_ENABLE_SEARCH` - Enable/disable product search
- `NEXT_PUBLIC_ENABLE_PRODUCT_FILTERS` - Enable/disable filtering
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable/disable analytics
- `NEXT_PUBLIC_ENABLE_SOCIAL_SHARING` - Enable/disable social sharing

### Pagination Settings
- `NEXT_PUBLIC_PRODUCTS_PER_PAGE` - Number of products per page
- `NEXT_PUBLIC_FEATURED_PRODUCTS_LIMIT` - Number of featured products
- `NEXT_PUBLIC_DEMO_PRODUCTS_LIMIT` - Number of demo products

### Image Configuration
- `NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE` - Default product image path
- `NEXT_PUBLIC_DEFAULT_BRAND_IMAGE` - Default brand image path
- `NEXT_PUBLIC_IMAGE_QUALITY` - Image quality (1-100)

## Notes

- The website will automatically handle API errors and show appropriate messages
- All API calls include proper error handling and loading states
- The filtering is real-time and will update the product list as you type or select options
- Only active (status: 'Active') brands, flavors, and sizes are shown in the filters 