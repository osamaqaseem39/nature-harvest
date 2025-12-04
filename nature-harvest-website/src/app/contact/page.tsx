import { Suspense } from 'react'
import ContactInfo from '@/components/ContactInfo'

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
