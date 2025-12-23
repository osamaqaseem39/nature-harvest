import WhoWeAre from '@/components/WhoWeAre'
import WhyChooseUs from '@/components/WhyChooseUs'
import CompanyStats from '@/components/CompanyStats'
import OurStory from '@/components/OurStory'
import ValuesSection from '@/components/ValuesSection'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { config } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'About Us - Nature Harvest',
  description: 'Learn about Nature Harvest, a leading natural beverage company committed to bringing healthy, delicious premium juice, flavored milk, and tea whiteners to consumers worldwide. Discover our story, values, and mission.',
  keywords: ['about nature harvest', 'company history', 'natural beverage company', 'our story', 'company values', 'mission statement'],
  url: `${config.site.url}/about`,
})

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <WhoWeAre />
      <CompanyStats />
      <OurStory />
      <ValuesSection />
      <WhyChooseUs />
    </div>
  )
}