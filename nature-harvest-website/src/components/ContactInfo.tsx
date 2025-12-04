'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const ContactInfo = () => {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  // Check if this is a product quote request
  const isQuoteRequest = searchParams.get('type') === 'quote'
  const productName = searchParams.get('product')
  const brandName = searchParams.get('brand')
  const flavorName = searchParams.get('flavor')
  const sizeName = searchParams.get('size')

  useEffect(() => {
    if (isQuoteRequest && productName) {
      // Pre-fill form with product information
      const quoteSubject = `Quote Request for ${productName}`
      let quoteMessage = `I am interested in getting a quote for the following product:\n\n`
      quoteMessage += `Product: ${productName}\n`
      if (brandName) quoteMessage += `Brand: ${brandName}\n`
      if (flavorName) quoteMessage += `Flavor: ${flavorName}\n`
      if (sizeName) quoteMessage += `Size: ${sizeName}\n\n`
      quoteMessage += `Please provide pricing and availability information.\n\n`
      quoteMessage += `Additional requirements:\n`

      setFormData({
        name: '',
        email: '',
        subject: quoteSubject,
        message: quoteMessage
      })
    }
  }, [isQuoteRequest, productName, brandName, flavorName, sizeName])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your quote request! We will get back to you soon.')
  }
  return (
    <section className="relative py-20" style={{ backgroundColor: '#f2eecc' }}>
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h3 className="text-green-500 uppercase tracking-widest font-jost font-semibold text-sm mb-4">
            {isQuoteRequest ? 'QUOTE REQUEST' : 'CONTACT INFORMATION'}
          </h3>
          <h2 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 leading-tight">
            {isQuoteRequest ? 'Get Your Product Quote' : 'Get in Touch with Nature Harvest'}
          </h2>
          {isQuoteRequest && productName && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-green-200">
              <p className="text-green-700 font-jost font-medium">
                Requesting quote for: <span className="font-bold">{productName}</span>
                {brandName && ` (${brandName})`}
              </p>
            </div>
          )}
        </div>

        {/* Two Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-gazpacho font-bold text-black mb-6">Contact Information</h4>
              
              {/* Addresses */}
              <div className="space-y-6 mb-8">
                <div>
                  <h5 className="text-lg font-jost font-semibold text-black mb-3">Manufacturing Facility</h5>
                  <p className="font-jost text-gray-700 text-base">
                    Plot No. T-28 A, New Industrial Area,<br />
                    Mirpur, Azad Jammu and Kashmir, Pakistan
                  </p>
                </div>
                
                <div>
                  <h5 className="text-lg font-jost font-semibold text-black mb-3">Head Office</h5>
                  <p className="font-jost text-gray-700 text-base">
                    9/E Block G, Main Boulevard Gulberg II,<br />
                    Lahore, Pakistan
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center lg:justify-start text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-jost text-base">+92 325 413 1111</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-jost text-base">info@natureharvest.com.pk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-center lg:text-left mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-2xl font-gazpacho font-bold text-black mb-2">Send us a message</h4>
              <p className="text-gray-600 font-jost">
                Have a question? We&apos;d love to hear from you.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base font-jost focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white placeholder:text-gray-500 placeholder:font-jost"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base font-jost focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white placeholder:text-gray-500 placeholder:font-jost"
                    required
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base font-jost focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white placeholder:text-gray-500 placeholder:font-jost"
                  required
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base font-jost focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none placeholder:text-gray-500 placeholder:font-jost"
                  required
                ></textarea>
              </div>
              
              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-jost font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                >
                  {isQuoteRequest ? 'Request Quote' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactInfo 