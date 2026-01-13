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
    'Nature Harvest Pakistan',
    'premium juice',
    'flavored milk',
    'tea whiteners',
    'natural beverages',
    'fresh juice Pakistan',
    'premium beverages',
    'healthy drinks',
    'organic juice',
    'beverage manufacturing',
    'quality tea whiteners',
    'authentic juice',
    'natural flavors',
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
      nocache: false,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'noimageindex': false,
        'notranslate': false,
      },
    },
    openGraph: {
      type: type === 'product' ? 'website' : (type as 'website' | 'article' | undefined),
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
    name: 'Nature Harvest (Pvt) Ltd.',
    legalName: 'Nature Harvest Private Limited',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: 'Experience the authentic taste of nature\'s finest juice, premium flavored milk, and quality tea whiteners. Every product is crafted with care, bringing you the purest flavors without compromise.',
    foundingDate: '2020',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config.contact.phone,
      contactType: 'Customer Service',
      email: config.contact.email,
      areaServed: ['PK', 'Worldwide'],
      availableLanguage: ['en', 'ur'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.contact.address,
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      postalCode: '54600',
      addressCountry: 'PK',
    },
    sameAs: [
      config.social.facebook,
      config.social.twitter,
      config.social.instagram,
      config.social.linkedin,
      config.social.tiktok,
      config.social.youtube,
    ],
    founder: {
      '@type': 'Person',
      name: 'Hafiz Muhammad Abdul Basit',
      jobTitle: 'CEO & Co-Founder',
    },
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nature Harvest - Premium Juice, Flavored Milk & Tea Whiteners',
    alternateName: 'Nature Harvest Pakistan',
    url: siteUrl,
    description: 'Experience the authentic taste of nature\'s finest juice, premium flavored milk, and quality tea whiteners. Every product is crafted with care, bringing you the purest flavors without compromise.',
    inLanguage: ['en', 'ur'],
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

