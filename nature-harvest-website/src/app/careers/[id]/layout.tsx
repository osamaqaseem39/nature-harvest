import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { config } from '@/lib/config'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const response = await fetch(`${config.api.baseUrl}/careers/jobs/${params.id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (response.ok) {
      const result = await response.json()
      const job = result.data

      return generateSEOMetadata({
        title: `${job.title} - Career Opportunity`,
        description: `${job.description?.substring(0, 160)}... Join Nature Harvest as ${job.title} in ${job.department}.`,
        keywords: [
          job.title,
          job.department,
          job.location,
          job.type,
          'job opening',
          'career',
          'employment',
        ],
        url: `${config.site.url}/careers/${params.id}`,
        type: 'article',
        publishedTime: job.publishedAt || job.createdAt,
      })
    }
  } catch (error) {
    // Fallback metadata
  }

  return generateSEOMetadata({
    title: 'Job Details - Nature Harvest Careers',
    description: 'View detailed information about this career opportunity at Nature Harvest.',
    url: `${config.site.url}/careers/${params.id}`,
  })
}

export default function JobDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

