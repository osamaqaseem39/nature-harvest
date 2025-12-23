import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { config } from '@/lib/config'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Become a Partner - Join Nature Harvest',
    description: 'Join Nature Harvest as a partner in our mission to bring healthy, natural premium juice, flavored milk, and tea whiteners to consumers worldwide. Apply for distribution, retail, or wholesale partnerships.',
    keywords: ['partnership', 'become a partner', 'distribution partner', 'retail partner', 'wholesale partner', 'business partnership'],
    url: `${config.site.url}/partner`,
  })
}

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

