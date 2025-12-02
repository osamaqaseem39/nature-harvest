import WhoWeAre from '@/components/WhoWeAre'
import WhyChooseUs from '@/components/WhyChooseUs'
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
      <WhyChooseUs />
    </div>
  )
}