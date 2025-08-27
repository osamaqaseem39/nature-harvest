# Environment Configuration Guide

This guide explains how to configure the Nature Harvest website using environment variables.

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Edit the configuration:**
   ```bash
   # Edit with your preferred editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Test your configuration:**
   ```bash
   node test-api.js
   ```

## Configuration Categories

### 🔗 API Configuration
Configure your API server connection:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
```

- **NEXT_PUBLIC_API_URL**: Your API server URL (required)
- **NEXT_PUBLIC_API_TIMEOUT**: Request timeout in milliseconds (default: 10000)
- **NEXT_PUBLIC_API_RETRY_ATTEMPTS**: Number of retry attempts (default: 3)

### 🌐 Website Configuration
Basic website information:

```env
NEXT_PUBLIC_SITE_NAME=Nature Harvest
NEXT_PUBLIC_SITE_DESCRIPTION=Premium organic beverages and natural products
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 📞 Contact Information
Contact details displayed on the website:

```env
NEXT_PUBLIC_CONTACT_EMAIL=info@natureharvest.com
NEXT_PUBLIC_CONTACT_PHONE=+1-555-123-4567
NEXT_PUBLIC_CONTACT_ADDRESS=123 Nature Way, Green City, GC 12345
```

### 📱 Social Media Links
Social media URLs for sharing and links:

```env
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/natureharvest
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/natureharvest
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/natureharvest
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/natureharvest
```

### 📊 Analytics (Optional)
Analytics tracking IDs:

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=FB_PIXEL_ID
```

### 🎛️ Feature Flags
Enable or disable specific features:

```env
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SOCIAL_SHARING=true
NEXT_PUBLIC_ENABLE_PRODUCT_FILTERS=true
NEXT_PUBLIC_ENABLE_SEARCH=true
```

### 📄 Pagination Settings
Control how many items are displayed:

```env
NEXT_PUBLIC_PRODUCTS_PER_PAGE=12
NEXT_PUBLIC_FEATURED_PRODUCTS_LIMIT=8
NEXT_PUBLIC_DEMO_PRODUCTS_LIMIT=8
```

### 🖼️ Image Configuration
Default images and quality settings:

```env
NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE=/images/product-placeholder.png
NEXT_PUBLIC_DEFAULT_BRAND_IMAGE=/images/placeholder-brand.png
NEXT_PUBLIC_IMAGE_QUALITY=85
```

### 🛠️ Development Settings
Development and debugging options:

```env
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SHOW_API_ERRORS=true
```

## Environment-Specific Configurations

### Development Environment
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_API_ERRORS=true
```

### Production Environment
```env
NEXT_PUBLIC_API_URL=https://api.natureharvest.com/api
NEXT_PUBLIC_SITE_URL=https://natureharvest.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SHOW_API_ERRORS=false
```

### Staging Environment
```env
NEXT_PUBLIC_API_URL=https://staging-api.natureharvest.com/api
NEXT_PUBLIC_SITE_URL=https://staging.natureharvest.com
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_API_ERRORS=true
```

## Validation

The application includes environment validation that checks:

- ✅ Required variables are set
- ✅ API URL is valid
- ✅ Numeric values are valid numbers
- ✅ Image quality is within range (1-100)
- ⚠️ Development vs production warnings

### Running Validation

```bash
# Test API connection
node test-api.js

# The validation will show:
# ✅ Environment configuration is valid
# ⚠️ Warnings (if any)
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if your API server is running
   - Verify the `NEXT_PUBLIC_API_URL` is correct
   - Ensure CORS is properly configured on your API server

2. **Environment Variables Not Loading**
   - Make sure `.env.local` is in the project root
   - Restart your development server after changing environment variables
   - Check that variable names start with `NEXT_PUBLIC_`

3. **Images Not Loading**
   - Verify image paths in `NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE` and `NEXT_PUBLIC_DEFAULT_BRAND_IMAGE`
   - Ensure images exist in the `public` directory

### Debug Mode

Enable debug mode to see more detailed information:

```env
NEXT_PUBLIC_DEBUG_MODE=true
```

This will show:
- API request/response details
- Environment validation results
- Feature flag status

## Security Notes

- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never include sensitive information like API keys or passwords
- Use server-side environment variables for sensitive data
- In production, disable debug mode and API error display

## Best Practices

1. **Use the example file**: Always start with `env.example`
2. **Validate configuration**: Run `node test-api.js` before starting
3. **Environment-specific files**: Use different files for different environments
4. **Version control**: Never commit `.env.local` to version control
5. **Documentation**: Keep this guide updated with new variables

## Adding New Environment Variables

When adding new environment variables:

1. Add them to `env.example`
2. Update the configuration in `src/lib/config.ts`
3. Add validation in `src/lib/env-validator.ts`
4. Update this documentation
5. Test with `node test-api.js` 