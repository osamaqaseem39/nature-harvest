import { Metadata } from 'next'
import { config } from './config'

const siteUrl = config.site.url

export interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noindex?: boolean
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = `${siteUrl}/images/logo.png`,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
}: SEOProps): Metadata {
  const fullTitle = title.includes('|') ? title : `${title} | Nature Harvest`
  const canonicalUrl = url || siteUrl
  const defaultKeywords = [
    'Nature Harvest',
    'natural products',
    'premium juice',
    'flavored milk',
    'tea whiteners',
    'organic beverages',
    'healthy drinks',
    'natural beverages',
    'fresh juice',
    'dairy products',
  ]

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords].join(', '),
    authors: author ? [{ name: author }] : [{ name: 'Nature Harvest' }],
    creator: 'Nature Harvest',
    publisher: 'Nature Harvest',
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: canonicalUrl,
      siteName: 'Nature Harvest',
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

// Structured Data (JSON-LD) generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nature Harvest',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: 'Premium natural juice, flavored milk, and tea whiteners',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config.contact.phone,
      contactType: 'Customer Service',
      email: config.contact.email,
      areaServed: 'Worldwide',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.contact.address,
      addressCountry: 'PK',
    },
    sameAs: [
      config.social.facebook,
      config.social.twitter,
      config.social.instagram,
      config.social.linkedin,
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nature Harvest',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  image?: string
  brand?: string
  category?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || `${siteUrl}/images/logo.png`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Nature Harvest',
    },
    category: product.category || 'Beverages',
    url: product.url,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
    },
  }
}

export function generateArticleSchema(article: {
  title: string
  description: string
  image?: string
  url: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${siteUrl}/images/logo.png`,
    url: article.url,
    ...(article.publishedTime && { datePublished: article.publishedTime }),
    ...(article.modifiedTime && { dateModified: article.modifiedTime }),
    author: {
      '@type': 'Person',
      name: article.author || 'Nature Harvest',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nature Harvest',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
  }
}

export function generateJobPostingSchema(job: {
  title: string
  description: string
  location: string
  employmentType: string
  datePosted: string
  validThrough: string
  url: string
  baseSalary?: { value: number; currency: string }
  organization: { name: string; logo?: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Nature Harvest',
      value: job.title,
    },
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'PK',
      },
    },
    ...(job.baseSalary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.baseSalary.currency,
        value: {
          '@type': 'QuantitativeValue',
          value: job.baseSalary.value,
        },
      },
    }),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organization.name,
      ...(job.organization.logo && { logo: job.organization.logo }),
    },
    url: job.url,
  }
}

