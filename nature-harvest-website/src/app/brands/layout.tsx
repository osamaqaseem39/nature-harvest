import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { config } from '@/lib/config'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Our Brands - Premium Beverage Collection',
    description: 'Discover our premium beverage brands. Each brand represents our commitment to excellence, quality, and innovation. Explore FreshLay, Funtastic, AquaLife and more premium juice, flavored milk, and tea whiteners.',
    keywords: ['brands', 'beverage brands', 'juice brands', 'milk brands', 'tea whiteners', 'FreshLay', 'Funtastic', 'AquaLife'],
    url: `${config.site.url}/brands`,
  })
}

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

