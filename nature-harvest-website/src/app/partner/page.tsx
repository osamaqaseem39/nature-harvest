'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Twitter,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const BecomePartner = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    companyType: '',
    businessDescription: '',
    partnershipType: [] as string[],
    targetMarkets: [''],
    annualRevenue: '',
    employeeCount: '',
    website: '',
    socialMedia: {
      linkedin: '',
      facebook: '',
      instagram: '',
      twitter: ''
    },
    additionalInfo: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const companyTypes = [
    'Distributor',
    'Retailer', 
    'Wholesaler',
    'Restaurant',
    'Cafe',
    'Hotel',
    'Supermarket',
    'Other'
  ]

  const partnershipTypes = [
    'Distribution',
    'Retail',
    'Wholesale',
    'Co-branding',
    'Joint Marketing',
    'Product Development',
    'Other'
  ]

  const revenueOptions = [
    'Under $100K',
    '$100K - $500K',
    '$500K - $1M',
    '$1M - $5M',
    '$5M - $10M',
    'Over $10M',
    'Prefer not to say'
  ]

  const employeeOptions = [
    '1-10',
    '11-50',
    '51-100',
    '101-500',
    '500+',
    'Prefer not to say'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleCheckboxChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      partnershipType: checked 
        ? [...prev.partnershipType, type]
        : prev.partnershipType.filter(t => t !== type)
    }))
  }

  const handleTargetMarketChange = (index: number, value: string) => {
    const newTargetMarkets = [...formData.targetMarkets]
    newTargetMarkets[index] = value
    setFormData(prev => ({
      ...prev,
      targetMarkets: newTargetMarkets
    }))
  }

  const addTargetMarket = () => {
    setFormData(prev => ({
      ...prev,
      targetMarkets: [...prev.targetMarkets, '']
    }))
  }

  const removeTargetMarket = (index: number) => {
    if (formData.targetMarkets.length > 1) {
      const newTargetMarkets = formData.targetMarkets.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        targetMarkets: newTargetMarkets
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          companyType: '',
          businessDescription: '',
          partnershipType: [],
          targetMarkets: [''],
          annualRevenue: '',
          employeeCount: '',
          website: '',
          socialMedia: {
            linkedin: '',
            facebook: '',
            instagram: '',
            twitter: ''
          },
          additionalInfo: ''
        })
      } else {
        setError(result.message || 'Failed to submit application')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-gazpacho font-bold text-gray-800 mb-4">
            Application Submitted!
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-jost">
            Thank you for your interest in partnering with Nature Harvest. We'll review your application and get back to you within 2-3 business days.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-medium"
            >
              Submit Another Application
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-jost font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white pt-20">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-6">
              Become a Partner
            </h1>
            <p className="text-xl text-gray-600 font-jost max-w-3xl mx-auto leading-relaxed">
              Join Nature Harvest in our mission to bring healthy, natural <span className="text-green-600 font-semibold">premium juice</span>, <span className="text-green-600 font-semibold">flavored milk</span>, and <span className="text-green-600 font-semibold">tea whiteners</span> to consumers worldwide. 
              We're looking for passionate partners who share our values and vision.
            </p>
          </div>

          {/* Partnership Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-gazpacho font-bold text-gray-800 mb-2">Business Growth</h3>
              <p className="text-gray-600 font-jost">Expand your product portfolio with premium natural <span className="text-green-600 font-semibold">juice</span>, <span className="text-green-600 font-semibold">flavored milk</span>, and <span className="text-green-600 font-semibold">tea whiteners</span></p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-gazpacho font-bold text-gray-800 mb-2">Market Access</h3>
              <p className="text-gray-600 font-jost">Access our established distribution network and customer base</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-gazpacho font-bold text-gray-800 mb-2">Quality Assurance</h3>
              <p className="text-gray-600 font-jost">Partner with a brand known for quality and innovation</p>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-gazpacho font-bold text-gray-800 mb-6 text-center">
              Partnership Application
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 font-jost">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-gazpacho font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Company Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Company Type *
                    </label>
                    <select
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    >
                      <option value="">Select company type</option>
                      {companyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                    Business Description *
                  </label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    placeholder="Describe your business, products, and services..."
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-gazpacho font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="email@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="https://www.company.com"
                    />
                  </div>
                </div>
              </div>

              {/* Partnership Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-gazpacho font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Partnership Details
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-jost">
                    Partnership Types * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {partnershipTypes.map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.partnershipType.includes(type)}
                          onChange={(e) => handleCheckboxChange(type, e.target.checked)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 font-jost">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                    Target Markets * (Add multiple if needed)
                  </label>
                  {formData.targetMarkets.map((market, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={market}
                        onChange={(e) => handleTargetMarketChange(index, e.target.value)}
                        required
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                        placeholder="e.g., North America, Europe, Asia..."
                      />
                      {formData.targetMarkets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTargetMarket(index)}
                          className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTargetMarket}
                    className="text-green-600 hover:text-green-700 font-jost text-sm font-medium"
                  >
                    + Add Another Market
                  </button>
                </div>
              </div>

              {/* Company Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-gazpacho font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Company Metrics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Annual Revenue *
                    </label>
                    <select
                      name="annualRevenue"
                      value={formData.annualRevenue}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    >
                      <option value="">Select revenue range</option>
                      {revenueOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Employee Count *
                    </label>
                    <select
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    >
                      <option value="">Select employee count</option>
                      {employeeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-gazpacho font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Social Media (Optional)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="socialMedia.linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="socialMedia.facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="socialMedia.instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="socialMedia.twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-gazpacho font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Additional Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    placeholder="Any additional information you'd like to share about your company or partnership goals..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Partnership Application'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="text-center mt-12">
            <h3 className="text-xl font-gazpacho font-semibold text-gray-800 mb-4">
              Questions About Partnership?
            </h3>
            <p className="text-gray-600 font-jost mb-6">
              Contact our partnership team directly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:partnerships@natureharvest.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-jost font-medium"
              >
                <Mail className="h-5 w-5" />
                partnerships@natureharvest.com
              </a>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-medium"
              >
                <Phone className="h-5 w-5" />
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BecomePartner 