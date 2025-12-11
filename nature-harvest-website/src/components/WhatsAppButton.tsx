'use client'

import { MessageCircle } from 'lucide-react'

const WhatsAppButton = () => {
  // Format phone number: remove leading 0 and add country code 92 for Pakistan
  const phoneNumber = '0300070853'
  const whatsappUrl = `https://wa.me/${phoneNumber}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      <span className="absolute -top-2 -right-2 bg-white text-[#25D366] text-xs font-jost font-bold rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        +
      </span>
    </a>
  )
}

export default WhatsAppButton

