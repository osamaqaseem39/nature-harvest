const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  companyType: {
    type: String,
    required: [true, 'Company type is required'],
    enum: ['Distributor', 'Retailer', 'Wholesaler', 'Restaurant', 'Cafe', 'Hotel', 'Supermarket', 'Other'],
    default: 'Other'
  },
  businessDescription: {
    type: String,
    required: [true, 'Business description is required'],
    trim: true,
    maxlength: [1000, 'Business description cannot exceed 1000 characters']
  },
  partnershipType: {
    type: [String],
    required: [true, 'Partnership type is required'],
    enum: ['Distribution', 'Retail', 'Wholesale', 'Co-branding', 'Joint Marketing', 'Product Development', 'Other'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one partnership type must be selected'
    }
  },
  targetMarkets: {
    type: [String],
    required: [true, 'Target markets are required'],
    maxlength: [500, 'Target markets description cannot exceed 500 characters']
  },
  annualRevenue: {
    type: String,
    required: [true, 'Annual revenue information is required'],
    enum: ['Under $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $10M', 'Over $10M', 'Prefer not to say']
  },
  employeeCount: {
    type: String,
    required: [true, 'Employee count is required'],
    enum: ['1-10', '11-50', '51-100', '101-500', '500+', 'Prefer not to say']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL starting with http:// or https://']
  },
  socialMedia: {
    linkedin: String,
    facebook: String,
    instagram: String,
    twitter: String
  },
  additionalInfo: {
    type: String,
    trim: true,
    maxlength: [1000, 'Additional information cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Contacted'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  adminResponse: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin response cannot exceed 1000 characters']
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: Date
}, {
  timestamps: true
});

// Indexes for better performance
partnerSchema.index({ email: 1 });
partnerSchema.index({ companyName: 1 });
partnerSchema.index({ status: 1 });
partnerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Partner', partnerSchema); 