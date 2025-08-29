'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  MapPin, 
  Building2, 
  Clock, 
  Users, 
  Calendar,
  Briefcase,
  GraduationCap,
  DollarSign,
  Globe,
  Filter,
  X
} from 'lucide-react'

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

const Careers = () => {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    department: '',
    location: '',
    type: '',
    experience: '',
    isRemote: false
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchJobs()
  }, [currentPage, filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (searchTerm) params.append('search', searchTerm)
      if (filters.department) params.append('department', filters.department)
      if (filters.location) params.append('location', filters.location)
      if (filters.type) params.append('type', filters.type)
      if (filters.experience) params.append('experience', filters.experience)

      const response = await fetch(`/api/careers/jobs?${params}`)
      const result = await response.json()

      if (response.ok) {
        setJobs(result.data)
        setTotalPages(result.pagination.pages)
      } else {
        setError(result.message || 'Failed to fetch jobs')
      }
    } catch (err) {
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchJobs()
  }

  const clearFilters = () => {
    setFilters({
      department: '',
      location: '',
      type: '',
      experience: '',
      isRemote: false
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-jost">Loading career opportunities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-40 h-40 bg-green-300 rounded-full"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-gazpacho font-bold text-gray-800 mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-600 font-jost max-w-3xl mx-auto leading-relaxed">
              Be part of our mission to bring healthy, natural beverages to consumers worldwide. 
              We're looking for passionate individuals who share our values and drive for excellence.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jobs by title, skills, or keywords..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost text-lg"
                />
              </div>

              {/* Filters Toggle */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 font-jost font-medium"
                >
                  <Filter className="h-5 w-5" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                
                {Object.values(filters).some(f => f !== '' && f !== false) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 font-jost text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Department
                    </label>
                    <select
                      value={filters.department}
                      onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    >
                      <option value="">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Product">Product</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Location
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    >
                      <option value="">All Locations</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Job Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">
                      Experience
                    </label>
                    <select
                      value={filters.experience}
                      onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
                    >
                      <option value="">All Levels</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 font-jost text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={filters.isRemote}
                        onChange={(e) => setFilters(prev => ({ ...prev, isRemote: e.target.checked }))}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      Remote Only
                    </label>
                  </div>
                </div>
              )}

              {/* Search Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-semibold text-lg"
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700 font-jost">{error}</p>
              </div>
            )}

            {jobs.length === 0 && !loading ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-gazpacho font-semibold text-gray-600 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500 font-jost">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-gazpacho font-bold text-gray-800 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                          {job.title}
                        </h3>
                        {job.isUrgent && (
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 font-jost">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                          {job.isRemote && <span className="text-green-600">(Remote)</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.positions} position{job.positions > 1 ? 's' : ''}
                        </div>
                      </div>

                      <p className="text-gray-700 font-jost mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Skills */}
                      {job.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="text-gray-500 text-xs font-medium px-2 py-1">
                                +{job.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Requirements */}
                      {job.requirements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 font-jost">Key Requirements:</h4>
                          <ul className="text-sm text-gray-600 font-jost space-y-1">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {req}
                              </li>
                            ))}
                            {job.requirements.length > 3 && (
                              <li className="text-gray-500 text-sm">
                                +{job.requirements.length - 3} more requirements
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Job Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 font-jost">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {job.education}
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {job.experience}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job.salary)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(job.applicationDeadline)}
                        </div>
                      </div>
                    </div>

                    {/* Apply Button and Stats */}
                    <div className="flex flex-col items-end gap-4">
                      <button
                        onClick={() => router.push(`/careers/${job._id}`)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-semibold whitespace-nowrap"
                      >
                        Apply Now
                      </button>

                      <div className="text-right text-sm text-gray-500 font-jost">
                        <div>{job.views} views</div>
                        <div>{job.applications} applications</div>
                        <div className="text-orange-600 font-medium">
                          {getDaysUntilDeadline(job.applicationDeadline)} days left
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-jost"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-700 font-jost">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-jost"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-gazpacho font-semibold text-gray-800 mb-4">
              Don't see the right fit?
            </h3>
            <p className="text-gray-600 font-jost mb-6">
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button
              onClick={() => router.push('/contact')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-jost font-semibold text-lg"
            >
              Send Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Careers 