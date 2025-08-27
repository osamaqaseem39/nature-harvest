import WhoWeAre from '@/components/WhoWeAre'
import CEOMessage from '@/components/CEOMessage'
import WhyChooseUs from '@/components/WhyChooseUs'
import Brands from '@/components/Brands'
import CompanyStats from '@/components/CompanyStats'
import OurStory from '@/components/OurStory'
import ValuesSection from '@/components/ValuesSection'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <WhoWeAre />
      <CompanyStats />
      <OurStory />
      <ValuesSection />
      <CEOMessage />
      <WhyChooseUs />
      <Brands />
    </div>
  )
}