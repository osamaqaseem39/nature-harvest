const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: [true, 'Candidate ID is required']
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Offer Made', 'Hired', 'Rejected', 'Withdrawn'],
    default: 'Applied'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  coverLetter: {
    content: {
      type: String,
      trim: true,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
    },
    url: String,
    filename: String
  },
  resume: {
    url: {
      type: String,
      required: [true, 'Resume URL is required']
    },
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  additionalDocuments: [{
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
      maxlength: [100, 'Document name cannot exceed 100 characters']
    },
    url: {
      type: String,
      required: [true, 'Document URL is required']
    },
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  screening: {
    isPassed: {
      type: Boolean,
      default: null
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Screening notes cannot exceed 1000 characters']
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date
  },
  interviews: [{
    round: {
      type: Number,
      required: [true, 'Interview round is required'],
      min: 1
    },
    type: {
      type: String,
      enum: ['Phone', 'Video', 'In-Person', 'Technical', 'Panel', 'Final'],
      required: [true, 'Interview type is required']
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Interview date is required']
    },
    duration: {
      type: Number,
      required: [true, 'Interview duration is required'],
      min: 15,
      max: 480 // 8 hours max
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    meetingLink: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid meeting link']
    },
    interviewers: [{
      name: {
        type: String,
        required: [true, 'Interviewer name is required'],
        trim: true,
        maxlength: [100, 'Interviewer name cannot exceed 100 characters']
      },
      email: {
        type: String,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
      },
      role: {
        type: String,
        trim: true,
        maxlength: [100, 'Interviewer role cannot exceed 100 characters']
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Interview notes cannot exceed 1000 characters']
    },
    feedback: {
      technicalSkills: {
        type: Number,
        min: 1,
        max: 5
      },
      communicationSkills: {
        type: Number,
        min: 1,
        max: 5
      },
      culturalFit: {
        type: Number,
        min: 1,
        max: 5
      },
      overallRating: {
        type: Number,
        min: 1,
        max: 5
      },
      strengths: [{
        type: String,
        trim: true,
        maxlength: [200, 'Strength cannot exceed 200 characters']
      }],
      areasOfImprovement: [{
        type: String,
        trim: true,
        maxlength: [200, 'Area of improvement cannot exceed 200 characters']
      }],
      comments: {
        type: String,
        trim: true,
        maxlength: [1000, 'Comments cannot exceed 1000 characters']
      }
    },
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    scheduledAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
    }
  }],
  assessment: {
    tests: [{
      name: {
        type: String,
        required: [true, 'Test name is required'],
        trim: true,
        maxlength: [100, 'Test name cannot exceed 100 characters']
      },
      type: {
        type: String,
        enum: ['Technical', 'Personality', 'Cognitive', 'Skills', 'Other'],
        required: [true, 'Test type is required']
      },
      url: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, 'Please enter a valid test URL']
      },
      assignedDate: {
        type: Date,
        default: Date.now
      },
      dueDate: Date,
      completedDate: Date,
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      status: {
        type: String,
        enum: ['Assigned', 'In Progress', 'Completed', 'Expired'],
        default: 'Assigned'
      }
    }],
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  offer: {
    isMade: {
      type: Boolean,
      default: false
    },
    salary: {
      amount: {
        type: Number,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD'
      },
      period: {
        type: String,
        enum: ['Hourly', 'Monthly', 'Yearly'],
        default: 'Yearly'
      }
    },
    benefits: [{
      type: String,
      trim: true,
      maxlength: [200, 'Benefit cannot exceed 200 characters']
    }],
    startDate: Date,
    offerDate: Date,
    responseDate: Date,
    response: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Counter Offer'],
      default: 'Pending'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Offer notes cannot exceed 1000 characters']
    }
  },
  timeline: [{
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      maxlength: [100, 'Action cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  source: {
    type: String,
    enum: ['Website', 'Job Board', 'Referral', 'Recruitment Agency', 'Social Media', 'Direct Application', 'Other'],
    default: 'Website'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

// Indexes for better performance
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ candidateId: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ 'interviews.scheduledDate': 1 });
applicationSchema.index({ applicationDate: -1 });

// Virtual for next interview
applicationSchema.virtual('nextInterview').get(function() {
  if (!this.interviews || this.interviews.length === 0) return null;
  
  const upcomingInterviews = this.interviews.filter(interview => 
    interview.status === 'Scheduled' && 
    interview.scheduledDate > new Date()
  );
  
  if (upcomingInterviews.length === 0) return null;
  
  return upcomingInterviews.sort((a, b) => 
    new Date(a.scheduledDate) - new Date(b.scheduledDate)
  )[0];
});

// Virtual for days since application
applicationSchema.virtual('daysSinceApplication').get(function() {
  const now = new Date();
  const appDate = new Date(this.applicationDate);
  const diffTime = now - appDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware to update job application count
applicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Job = mongoose.model('Job');
      await Job.findByIdAndUpdate(this.jobId, { $inc: { applications: 1 } });
    } catch (error) {
      console.error('Error updating job application count:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema); 