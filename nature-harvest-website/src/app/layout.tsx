import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/Footer'
import PageWrapper from '@/components/PageWrapper'
import WhatsAppButton from '@/components/WhatsAppButton'
import { AuthProvider } from '@/contexts/AuthContext'
import { config } from '@/lib/config'
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = config.site.url || 'https://www.natureharvest.com.pk'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nature Harvest - Premium Juice, Flavored Milk & Tea Whiteners',
    template: '%s | Nature Harvest',
  },
  description: 'Experience the authentic taste of nature\'s finest juice, premium flavored milk, and quality tea whiteners. Every product is crafted with care, bringing you the purest flavors without compromise. Nature Harvest - Premium Beverage Manufacturing in Pakistan.',
  keywords: ['nature harvest', 'premium juice', 'flavored milk', 'tea whiteners', 'natural beverages', 'fresh juice pakistan', 'premium beverages', 'healthy drinks', 'organic juice', 'quality tea whiteners', 'beverage manufacturing pakistan', 'nature harvest pakistan'],
  authors: [{ name: 'Nature Harvest' }],
  creator: 'Nature Harvest',
  publisher: 'Nature Harvest',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'noimageindex': false,
      'notranslate': false,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Nature Harvest',
    title: 'Nature Harvest - Premium Juice, Flavored Milk & Tea Whiteners',
    description: 'Experience the authentic taste of nature\'s finest juice, premium flavored milk, and quality tea whiteners. Every product is crafted with care, bringing you the purest flavors without compromise.',
    images: [
      {
        url: `${siteUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Nature Harvest - Premium Beverages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nature Harvest - Premium Juice, Flavored Milk & Tea Whiteners',
    description: 'Experience the authentic taste of nature\'s finest juice, premium flavored milk, and quality tea whiteners.',
    images: [`${siteUrl}/images/logo.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: '_G_WWlNwk-br53oiUttAX8Xch8RAK-BoA6QBb_LWHOQ',
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
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GXFKPXH2EV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GXFKPXH2EV');
          `}
        </Script>
        
        <AuthProvider>
          <PageWrapper>
            <main>{children}</main>
          </PageWrapper>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  )
}
