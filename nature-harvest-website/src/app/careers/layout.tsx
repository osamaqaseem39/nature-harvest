import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { config } from '@/lib/config'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Careers - Join Our Team',
    description: 'Join Nature Harvest in our mission to bring healthy, natural premium juice, flavored milk, and tea whiteners to consumers worldwide. Explore career opportunities and be part of our passionate team.',
    keywords: ['careers', 'jobs', 'employment', 'career opportunities', 'join our team', 'work with us', 'job openings'],
    url: `${config.site.url}/careers`,
  })
}

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

