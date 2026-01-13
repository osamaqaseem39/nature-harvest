import { MetadataRoute } from 'next'
import { config } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = config.site.url || 'https://www.natureharvest.com.pk'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/gallery-demo',
          '/gallery-test',
          '/upload-test',
          '/filter',
          '/mobile',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

