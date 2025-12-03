import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import PageWrapper from '@/components/PageWrapper'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nature Harvest - Natural Products',
  description: 'Discover premium natural products from Nature Harvest. Fresh, healthy, and sustainable products for your lifestyle.',
  keywords: 'natural, healthy, sustainable, nature harvest, fresh products',
  authors: [{ name: 'Nature Harvest' }],
  openGraph: {
    title: 'Nature Harvest - Natural Products',
    description: 'Discover premium natural products from Nature Harvest.',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <PageWrapper>
            <main>{children}</main>
          </PageWrapper>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
