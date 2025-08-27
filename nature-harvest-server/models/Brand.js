const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Brand name is required'], 
    unique: true,
    trim: true
  },
  logoUrl: { 
    type: String,
    trim: true
  },
  imageUrl: { 
    type: String,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for products
brandSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'brandId'
});

// Index for better performance
brandSchema.index({ name: 1, status: 1 });

module.exports = mongoose.model('Brand', brandSchema); 