import { Suspense } from 'react'
import ContactInfo from '@/components/ContactInfo'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { config } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Contact Us - Nature Harvest',
  description: 'Get in touch with Nature Harvest. Contact us for inquiries about our premium juice, flavored milk, tea whiteners, partnerships, or customer support. We\'re here to help!',
  keywords: ['contact nature harvest', 'customer support', 'inquiry', 'get quote', 'partnership inquiry', 'customer service'],
  url: `${config.site.url}/contact`,
})

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20 bg-[#f2eecc]">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading contact form...</p>
          </div>
        </div>
      }>
        <ContactInfo />
      </Suspense>
  
    </div>
  )
}
