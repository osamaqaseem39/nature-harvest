import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import PageWrapper from '@/components/PageWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nature Harvest - Organic & Natural Products',
  description: 'Discover premium organic and natural products from Nature Harvest. Fresh, healthy, and sustainable products for your lifestyle.',
  keywords: 'organic, natural, healthy, sustainable, nature harvest, fresh products',
  authors: [{ name: 'Nature Harvest' }],
  openGraph: {
    title: 'Nature Harvest - Organic & Natural Products',
    description: 'Discover premium organic and natural products from Nature Harvest.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <PageWrapper>
          <main>{children}</main>
        </PageWrapper>
        <Footer />
      </body>
    </html>
  )
}
