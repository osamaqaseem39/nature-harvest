'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  MapPin, 
  Building2, 
  Clock, 
  Users, 
  Calendar,
  Briefcase,
  GraduationCap,
  DollarSign,
  Globe,
  CheckCircle,
  AlertCircle,
  Upload,
  Plus,
  X
} from 'lucide-react'
import JobApplicationForm from '@/components/JobApplicationForm'
import { config } from '@/lib/config'

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  };
  skills: string[];
  education: string;
  applicationDeadline: string;
  positions: number;
  isRemote: boolean;
  isUrgent: boolean;
  tags: string[];
  views: number;
  applications: number;
  createdAt: string;
  publishedAt: string;
}

const JobDetail = () => {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${config.api.baseUrl}/careers/jobs/${params.id}`)
      const result = await response.json()

      if (response.ok) {
        setJob(result.data)
      } else {
        setError(result.message || 'Failed to fetch job')
      }
    } catch (err) {
      setError('Failed to fetch job')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatSalary = (salary: Job['salary']) => {
    if (!salary.min && !salary.max) return 'Competitive'
    
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
      return `$${num.toLocaleString()}`
    }

    if (salary.min && salary.max) {
      return `${formatNumber(salary.min)} - ${formatNumber(salary.max)} ${salary.period}`
    } else if (salary.min) {
      return `${formatNumber(salary.min)}+ ${salary.period}`
    } else if (salary.max) {
      return `Up to ${formatNumber(salary.max)} ${salary.period}`
    }
    
    return 'Competitive'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-jost">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-gazpacho font-bold text-gray-800 mb-2">
            {error || 'Job not found'}
          </h1>
          <button
            onClick={() => router.push('/careers')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-medium"
          >
            Back to Careers
          </button>
        </div>
      </div>
    )
  }

  if (applicationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-gazpacho font-bold text-gray-800 mb-4">
            Application Submitted!
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-jost">
            Thank you for your interest in the {job.title} position. We'll review your application and get back to you within 2-3 business days.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setApplicationSuccess(false)}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-medium"
            >
              Apply for Another Job
            </button>
            <button
              onClick={() => router.push('/careers')}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-jost font-medium"
            >
              Back to Careers
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Job Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl lg:text-4xl font-gazpacho font-bold text-gray-800">
                  {job.title}
                </h1>
                {job.isUrgent && (
                  <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Urgent Hiring
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600 font-jost">
                  <Building2 className="h-5 w-5" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-jost">
                  <MapPin className="h-5 w-5" />
                  <span>{job.location}</span>
                  {job.isRemote && <span className="text-green-600">(Remote)</span>}
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-jost">
                  <Clock className="h-5 w-5" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-jost">
                  <Users className="h-5 w-5" />
                  <span>{job.positions} position{job.positions > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600 font-jost">
                  <GraduationCap className="h-5 w-5" />
                  <span>{job.education}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-jost">
                  <Briefcase className="h-5 w-5" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-jost">
                  <DollarSign className="h-5 w-5" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-jost">
                  <Calendar className="h-5 w-5" />
                  <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                </div>
              </div>

              {/* Skills */}
              {job.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 font-gazpacho">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {job.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="lg:text-right">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="text-2xl font-gazpacho font-bold text-gray-800 mb-2">
                    {job.applications}
                  </div>
                  <div className="text-gray-600 font-jost">Applications</div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-2xl font-gazpacho font-bold text-gray-800 mb-2">
                    {job.views}
                  </div>
                  <div className="text-gray-600 font-jost">Views</div>
                </div>

                <div className="text-center mb-6">
                  <div className={`text-lg font-gazpacho font-bold mb-1 ${
                    getDaysUntilDeadline(job.applicationDeadline) <= 7 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {getDaysUntilDeadline(job.applicationDeadline)} days left
                  </div>
                  <div className="text-gray-600 font-jost text-sm">to apply</div>
                </div>

                <button
                  onClick={() => setShowApplicationForm(true)}
                  disabled={getDaysUntilDeadline(job.applicationDeadline) <= 0}
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {getDaysUntilDeadline(job.applicationDeadline) <= 0 ? 'Applications Closed' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-gazpacho font-bold text-gray-800 mb-6">Job Description</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 font-jost leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-gazpacho font-bold text-gray-800 mb-6">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-jost">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-gazpacho font-bold text-gray-800 mb-6">Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-jost">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-gazpacho font-bold text-gray-800 mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-jost">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-gazpacho font-semibold text-gray-800 mb-4">About Nature Harvest</h3>
              <p className="text-gray-600 font-jost text-sm leading-relaxed mb-4">
                We are a leading natural beverage company committed to bringing healthy, delicious drinks to consumers worldwide.
              </p>
              <button
                onClick={() => router.push('/about')}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-jost font-medium text-sm"
              >
                Learn More About Us
              </button>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-gazpacho font-semibold text-gray-800 mb-4">Similar Jobs</h3>
              <p className="text-gray-500 font-jost text-sm">
                Check out other opportunities in {job.department}
              </p>
              <button
                onClick={() => router.push('/careers')}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-medium text-sm mt-4"
              >
                View All Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-gazpacho font-bold text-gray-800">
                    Apply for {job.title}
                  </h2>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <JobApplicationForm 
                  jobId={job._id} 
                  jobTitle={job.title}
                  onSuccess={() => setApplicationSuccess(true)}
                  onClose={() => setShowApplicationForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetail 