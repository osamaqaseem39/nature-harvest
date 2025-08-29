'use client'

import React, { useState, useRef } from 'react'
import { 
  Upload, 
  Plus, 
  X, 
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  FileText,
  AlertCircle
} from 'lucide-react'

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  onSuccess: () => void
  onClose: () => void
}

interface CandidateData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  education: Array<{
    degree: string
    institution: string
    fieldOfStudy: string
    startDate: string
    endDate: string
    gpa: string
    isCurrent: boolean
  }>
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    isCurrent: boolean
    description: string
    achievements: string[]
  }>
  skills: Array<{
    name: string
    level: string
    yearsOfExperience: string
  }>
  resume: {
    url: string
    filename: string
  }
  coverLetter: {
    content: string
  }
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  jobTitle,
  onSuccess,
  onClose
}) => {
  const [formData, setFormData] = useState<CandidateData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    education: [{
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
      isCurrent: false
    }],
    experience: [],
    skills: [],
    resume: {
      url: '',
      filename: ''
    },
    coverLetter: {
      content: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 4

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

  const handleEducationChange = (index: number, field: string, value: string | boolean) => {
    const newEducation = [...formData.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setFormData(prev => ({ ...prev, education: newEducation }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: '',
        isCurrent: false
      }]
    }))
  }

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }))
    }
  }

  const handleExperienceChange = (index: number, field: string, value: string | boolean) => {
    const newExperience = [...formData.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setFormData(prev => ({ ...prev, experience: newExperience }))
  }

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        achievements: ['']
      }]
    }))
  }

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const handleSkillChange = (index: number, field: string, value: string) => {
    const newSkills = [...formData.skills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setFormData(prev => ({ ...prev, skills: newSkills }))
  }

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, {
        name: '',
        level: 'Intermediate',
        yearsOfExperience: ''
      }]
    }))
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setResumeFile(file)
    setFormData(prev => ({
      ...prev,
      resume: {
        url: URL.createObjectURL(file),
        filename: file.name
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // First upload resume if there's a file
      let resumeUrl = formData.resume.url
      if (resumeFile) {
        const formDataFile = new FormData()
        formDataFile.append('file', resumeFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          resumeUrl = uploadResult.data.urls[0]
        } else {
          throw new Error('Failed to upload resume')
        }
      }

      // Submit application
      const applicationData = {
        jobId,
        candidateData: {
          ...formData,
          resume: { url: resumeUrl, filename: formData.resume.filename }
        },
        coverLetter: formData.coverLetter,
        additionalDocuments: []
      }

      const response = await fetch('/api/careers/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess()
      } else {
        setError(result.message || 'Failed to submit application')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            i + 1 < currentStep ? 'bg-green-500 text-white' :
            i + 1 === currentStep ? 'bg-blue-500 text-white' :
            'bg-gray-200 text-gray-500'
          }`}>
            {i + 1 < currentStep ? '✓' : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 h-1 mx-2 ${
              i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-gazpacho font-semibold text-gray-800 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Date of Birth *</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Street Address *</label>
        <input
          type="text"
          name="address.street"
          value={formData.address.street}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">City *</label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">State/Province *</label>
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">ZIP/Postal Code *</label>
          <input
            type="text"
            name="address.zipCode"
            value={formData.address.zipCode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Country *</label>
        <input
          type="text"
          name="address.country"
          value={formData.address.country}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
        />
      </div>
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-gazpacho font-semibold text-gray-800">Education</h3>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </button>
      </div>

      {formData.education.map((edu, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-jost font-medium text-gray-800">Education #{index + 1}</h4>
            {formData.education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700 font-jost text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Institution *</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Field of Study *</label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">GPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={edu.gpa}
                onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Start Date *</label>
              <input
                type="date"
                value={edu.startDate}
                onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">End Date</label>
              <input
                type="date"
                value={edu.endDate}
                onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                disabled={edu.isCurrent}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 font-jost text-sm text-gray-700">
              <input
                type="checkbox"
                checked={edu.isCurrent}
                onChange={(e) => handleEducationChange(index, 'isCurrent', e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              Currently studying here
            </label>
          </div>
        </div>
      ))}
    </div>
  )

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-gazpacho font-semibold text-gray-800">Work Experience</h3>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {formData.experience.map((exp, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-jost font-medium text-gray-800">Experience #{index + 1}</h4>
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-700 font-jost text-sm"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Job Title *</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Company *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Start Date *</label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">End Date</label>
            <input
              type="date"
              value={exp.endDate}
              onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
              disabled={exp.isCurrent}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost disabled:bg-gray-100"
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 font-jost text-sm text-gray-700">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => handleExperienceChange(index, 'isCurrent', e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              I currently work here
            </label>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Job Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              placeholder="Describe your role and responsibilities..."
            />
          </div>
        </div>
      ))}
    </div>
  )

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-gazpacho font-semibold text-gray-800">Skills</h3>
        <button
          type="button"
          onClick={addSkill}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      {formData.skills.map((skill, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-jost font-medium text-gray-800">Skill #{index + 1}</h4>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="text-red-600 hover:text-red-700 font-jost text-sm"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Skill Name *</label>
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Level *</label>
              <select
                value={skill.level}
                onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={skill.yearsOfExperience}
                onChange={(e) => handleSkillChange(index, 'yearsOfExperience', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-gazpacho font-semibold text-gray-800 mb-4">Documents</h3>
      
      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Resume/CV *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
          />
          
          {formData.resume.url ? (
            <div className="space-y-2">
              <FileText className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-sm text-gray-600 font-jost">{formData.resume.filename}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-green-600 hover:text-green-700 font-jost text-sm font-medium"
              >
                Change File
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600 font-jost">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 font-jost">
                PDF, DOC, or DOCX (max 10MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost text-sm font-medium"
              >
                Choose File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-jost">Cover Letter</label>
        <textarea
          name="coverLetter.content"
          value={formData.coverLetter.content}
          onChange={handleInputChange}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-jost"
          placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
        />
        <p className="text-xs text-gray-500 font-jost mt-1">
          Optional but recommended. Explain your interest in the role and relevant experience.
        </p>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo()
      case 2:
        return renderEducation()
      case 3:
        return renderExperience()
      case 4:
        return renderDocuments()
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information'
      case 2:
        return 'Education'
      case 3:
        return 'Work Experience'
      case 4:
        return 'Documents'
      default:
        return ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700 font-jost">{error}</p>
        </div>
      )}

      {renderStepIndicator()}

      <div className="mb-6">
        <h2 className="text-2xl font-gazpacho font-bold text-gray-800 mb-2">
          {getStepTitle()}
        </h2>
        <p className="text-gray-600 font-jost">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 font-jost font-medium"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-medium"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !formData.resume.url}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-jost font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default JobApplicationForm 