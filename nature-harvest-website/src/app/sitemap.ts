import { MetadataRoute } from 'next'
import { config } from '@/lib/config'
import { apiService } from '@/lib/api'
import { generateProductSlug } from '@/lib/slug'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.site.url || 'https://www.natureharvest.com.pk'
  const currentDate = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/partner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Fetch all active products for dynamic product pages
  let productPages: MetadataRoute.Sitemap = []
  
  try {
    // Fetch all products with a high limit to get all active products
    const response = await apiService.getProducts({
      status: 'Active',
      limit: 1000, // Adjust based on your total product count
      page: 1,
    })

    if (response?.data && Array.isArray(response.data)) {
      productPages = response.data
        .filter((product) => product._id && product.status === 'Active')
        .map((product) => {
          const productSlug = generateProductSlug(product.name, product._id)
          return {
            url: `${baseUrl}/products/${productSlug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }
        })
    }

    // If there are more pages, fetch them
    const totalPages = response?.pagination?.pages || 1
    if (totalPages > 1 && totalPages <= 10) { // Limit to 10 pages to avoid timeout
      const additionalPages: MetadataRoute.Sitemap = []
      
      // Fetch remaining pages in parallel (limit to 5 concurrent requests)
      const pagePromises: Promise<void>[] = []
      for (let page = 2; page <= Math.min(totalPages, 10); page++) {
        const fetchPage = async () => {
          try {
            const pageResponse = await apiService.getProducts({
              status: 'Active',
              limit: 1000,
              page,
            })
            
            if (pageResponse?.data && Array.isArray(pageResponse.data)) {
              const pageProducts = pageResponse.data
                .filter((product) => product._id && product.status === 'Active')
                .map((product) => {
                  const productSlug = generateProductSlug(product.name, product._id)
                  return {
                    url: `${baseUrl}/products/${productSlug}`,
                    lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                  }
                })
              additionalPages.push(...pageProducts)
            }
          } catch (error) {
            console.error(`Error fetching products page ${page}:`, error)
            // Continue with other pages even if one fails
          }
        }
        pagePromises.push(fetchPage())
      }
      
      await Promise.all(pagePromises)
      productPages.push(...additionalPages)
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    // Continue with static pages even if product fetch fails
  }

  // Fetch career pages if available
  let careerPages: MetadataRoute.Sitemap = []
  try {
    const careersResponse = await fetch(
      `${config.api.baseUrl}/careers/jobs?status=Active&limit=100`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (careersResponse.ok) {
      const careersData = await careersResponse.json()
      if (careersData?.success && careersData?.data && Array.isArray(careersData.data)) {
        careerPages = careersData.data
          .filter((career: any) => career._id && career.status === 'Active')
          .map((career: any) => ({
            url: `${baseUrl}/careers/${career._id}`,
            lastModified: career.updatedAt ? new Date(career.updatedAt) : currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
          }))
      }
    }
  } catch (error) {
    console.error('Error fetching careers for sitemap:', error)
    // Continue without career pages if fetch fails
  }

  return [...staticPages, ...productPages, ...careerPages]
}

