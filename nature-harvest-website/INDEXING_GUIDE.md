# Google Search Console Indexing Guide

This document outlines the indexing configuration for Nature Harvest website and how to address common indexing issues.

## Current Indexing Configuration

### ✅ All Pages Are Configured for Indexing

1. **Robots Meta Tags**: All pages explicitly allow indexing with `index: true, follow: true`
2. **Canonical URLs**: Every page has a proper canonical URL set
3. **Robots.txt**: Properly configured to allow all public pages
4. **Sitemap**: Available at `https://www.natureharvest.com.pk/sitemap.xml`

## Common Indexing Issues & Solutions

### 1. "Not indexed - URL marked 'noindex'"

**Solution**: All pages use `noindex: false` by default. If you see this error:
- Check the page's metadata in the layout file
- Ensure `generateSEOMetadata` is called without `noindex: true`
- Verify the page isn't in the robots.txt disallow list

### 2. "Not indexed - URL blocked by robots.txt"

**Solution**: Check if the URL matches any disallow patterns:
- `/gallery-demo` - Blocked (test page)
- `/gallery-test` - Blocked (test page)
- `/upload-test` - Blocked (test page)
- `/filter` - Blocked (internal page)
- `/mobile` - Blocked (internal page)

All other pages should be allowed.

### 3. "Duplicate without user-selected canonical"

**Solution**: Ensure all pages have explicit canonical URLs:
- Homepage: `https://www.natureharvest.com.pk/`
- Products: `https://www.natureharvest.com.pk/products`
- Product details: `https://www.natureharvest.com.pk/products/{slug}`
- All other pages have canonical URLs set in their metadata

### 4. "Crawled - currently not indexed"

**Solution**: This is normal for new pages. Google may take time to index. To speed up:
- Submit the URL in Google Search Console
- Ensure the page has unique, quality content
- Check that the page loads without errors
- Verify the page is in the sitemap

### 5. "Server error (5xx)"

**Solution**: 
- Check server logs for errors
- Ensure API endpoints are accessible
- Verify database connections
- Check for timeout issues

### 6. "Soft 404"

**Solution**: 
- Ensure product pages return proper 404 status codes when products don't exist
- Add meaningful error messages
- Don't return 200 status for missing content

## Verification Steps

1. **Check Robots Meta Tag**:
   ```html
   <meta name="robots" content="index, follow">
   ```

2. **Check Canonical URL**:
   ```html
   <link rel="canonical" href="https://www.natureharvest.com.pk/...">
   ```

3. **Test in Google Search Console**:
   - Use URL Inspection tool
   - Check "Page indexing" section
   - Verify "Indexing allowed?" shows "Yes"

4. **Check Sitemap**:
   - Visit: `https://www.natureharvest.com.pk/sitemap.xml`
   - Verify all important pages are listed
   - Check lastModified dates are recent

## Pages Configuration

### Public Pages (Indexed)
- `/` - Homepage
- `/products` - Products listing
- `/products/{slug}` - Product details
- `/brands` - Brands page
- `/about` - About page
- `/contact` - Contact page
- `/careers` - Careers page
- `/careers/{id}` - Job details
- `/partner` - Partner page

### Blocked Pages (Not Indexed)
- `/gallery-demo` - Test page
- `/gallery-test` - Test page
- `/upload-test` - Test page
- `/filter` - Internal filter page
- `/mobile` - Mobile-specific page

## Best Practices

1. **Always set canonical URLs** - Prevents duplicate content issues
2. **Use descriptive titles and descriptions** - Helps Google understand content
3. **Keep sitemap updated** - Submit new pages to sitemap
4. **Monitor Search Console** - Check for indexing errors regularly
5. **Fix errors promptly** - Address indexing issues as they appear

## Troubleshooting

If a page is not being indexed:

1. Check Google Search Console for specific error
2. Use URL Inspection tool to test the page
3. Verify robots meta tag allows indexing
4. Check canonical URL is correct
5. Ensure page is in sitemap
6. Verify page loads without errors
7. Check for duplicate content issues
8. Request indexing in Search Console after fixing issues

