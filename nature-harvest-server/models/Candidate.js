const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: 'Prefer not to say'
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters']
    },
    state: {
      type: String,
      required: [true, 'State/Province is required'],
      trim: true,
      maxlength: [100, 'State/Province cannot exceed 100 characters']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP/Postal code is required'],
      trim: true,
      maxlength: [20, 'ZIP/Postal code cannot exceed 20 characters']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters']
    }
  },
  education: [{
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
      maxlength: [100, 'Degree cannot exceed 100 characters']
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
      maxlength: [200, 'Institution cannot exceed 200 characters']
    },
    fieldOfStudy: {
      type: String,
      required: [true, 'Field of study is required'],
      trim: true,
      maxlength: [100, 'Field of study cannot exceed 100 characters']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: Date,
    gpa: {
      type: Number,
      min: 0,
      max: 4
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  }],
  experience: [{
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters']
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: Date,
    isCurrent: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    achievements: [{
      type: String,
      trim: true,
      maxlength: [500, 'Achievement cannot exceed 500 characters']
    }]
  }],
  skills: [{
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters']
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    yearsOfExperience: {
      type: Number,
      min: 0
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
      maxlength: [200, 'Certification name cannot exceed 200 characters']
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
      maxlength: [200, 'Issuing organization cannot exceed 200 characters']
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required']
    },
    expiryDate: Date,
    credentialId: {
      type: String,
      trim: true,
      maxlength: [100, 'Credential ID cannot exceed 100 characters']
    }
  }],
  languages: [{
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
      maxlength: [50, 'Language cannot exceed 50 characters']
    },
    proficiency: {
      type: String,
      enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
      default: 'Basic'
    }
  }],
  socialMedia: {
    linkedin: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid LinkedIn URL']
    },
    github: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid GitHub URL']
    },
    portfolio: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid portfolio URL']
    }
  },
  resume: {
    url: {
      type: String,
      required: [true, 'Resume is required'],
      trim: true
    },
    filename: {
      type: String,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  coverLetter: {
    url: String,
    filename: String,
    uploadedAt: Date
  },
  profilePicture: {
    url: String,
    filename: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Blacklisted'],
    default: 'Active'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  source: {
    type: String,
    enum: ['Website', 'Job Board', 'Referral', 'Recruitment Agency', 'Social Media', 'Other'],
    default: 'Website'
  },
  lastContact: Date,
  preferredContactMethod: {
    type: String,
    enum: ['Email', 'Phone', 'LinkedIn', 'Other'],
    default: 'Email'
  }
}, {
  timestamps: true
});

// Indexes for better performance
candidateSchema.index({ email: 1 });
candidateSchema.index({ firstName: 1, lastName: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ 'skills.name': 1 });
candidateSchema.index({ 'experience.company': 1 });
candidateSchema.index({ createdAt: -1 });

// Virtual for full name
candidateSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
candidateSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

module.exports = mongoose.model('Candidate', candidateSchema); 