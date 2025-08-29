const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [50, 'Department cannot exceed 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
    default: 'Full-time'
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
    default: 'Entry Level'
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [2000, 'Job description cannot exceed 2000 characters']
  },
  requirements: {
    type: [String],
    required: [true, 'Job requirements are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one requirement must be specified'
    }
  },
  responsibilities: {
    type: [String],
    required: [true, 'Job responsibilities are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one responsibility must be specified'
    }
  },
  benefits: {
    type: [String],
    default: []
  },
  salary: {
    min: {
      type: Number,
      min: 0
    },
    max: {
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
  skills: {
    type: [String],
    default: []
  },
  education: {
    type: String,
    required: [true, 'Education requirement is required'],
    enum: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Any'],
    default: 'Bachelor'
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  positions: {
    type: Number,
    required: [true, 'Number of positions is required'],
    min: [1, 'At least 1 position must be available'],
    default: 1
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Closed', 'Archived'],
    default: 'Draft'
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: Date,
  closedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
jobSchema.index({ status: 1, publishedAt: -1 });
jobSchema.index({ department: 1, location: 1 });
jobSchema.index({ title: 'text', description: 'text', requirements: 'text' });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ isUrgent: 1, status: 1 });

// Virtual for checking if job is active
jobSchema.virtual('isActive').get(function() {
  return this.status === 'Published' && 
         this.applicationDeadline > new Date() && 
         this.applications < this.positions;
});

// Virtual for days until deadline
jobSchema.virtual('daysUntilDeadline').get(function() {
  if (!this.applicationDeadline) return null;
  const now = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model('Job', jobSchema); 