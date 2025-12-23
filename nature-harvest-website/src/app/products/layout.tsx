import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { config } from '@/lib/config'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Products - Premium Juice, Flavored Milk & Tea Whiteners',
    description: 'Browse our complete collection of premium natural products. Discover premium juice, flavored milk, and tea whiteners in various flavors, sizes, and brands. Filter by brand, flavor, or size to find your perfect match.',
    keywords: ['products', 'premium juice', 'flavored milk', 'tea whiteners', 'natural beverages', 'product catalog', 'beverage products'],
    url: `${config.site.url}/products`,
  })
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

