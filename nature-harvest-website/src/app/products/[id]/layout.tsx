import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { config } from '@/lib/config'
import { apiService } from '@/lib/api'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const response = await apiService.getProduct(params.id)
    const product = response.data

    return generateSEOMetadata({
      title: `${product.name} - Product Details`,
      description: product.description 
        ? `${product.description.substring(0, 160)}...` 
        : `Discover ${product.name} from Nature Harvest. Premium quality natural beverage.`,
      keywords: [
        product.name,
        product.brandId?.name || '',
        product.flavorId?.name || '',
        product.sizeId?.name || '',
        'premium juice',
        'flavored milk',
        'tea whiteners',
      ].filter(Boolean),
      image: product.imageUrl || product.brandId?.logoUrl || `${config.site.url}/images/logo.png`,
      url: `${config.site.url}/products/${params.id}`,
      type: 'product',
    })
  } catch (error) {
    return generateSEOMetadata({
      title: 'Product Details - Nature Harvest',
      description: 'View detailed information about our premium natural products.',
      url: `${config.site.url}/products/${params.id}`,
    })
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

