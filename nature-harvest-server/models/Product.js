const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Brand is required']
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  sizeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Size'
  },
  flavorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flavor'
  },
  imageUrl: {
    type: String,
    trim: true
  },
  gallery: [{
    type: String,
    trim: true
  }],
  nutrients: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbohydrates: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    },
    fiber: {
      type: Number,
      min: 0
    },
    sugar: {
      type: Number,
      min: 0
    },
    sodium: {
      type: Number,
      min: 0
    },
    vitaminC: {
      type: Number,
      min: 0
    },
    vitaminA: {
      type: Number,
      min: 0
    },
    calcium: {
      type: Number,
      min: 0
    },
    iron: {
      type: Number,
      min: 0
    }
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

// Virtual populate for flavors
productSchema.virtual('flavors', {
  ref: 'Flavor',
  localField: 'flavorId',
  foreignField: '_id'
});

// Virtual populate for sizes
productSchema.virtual('sizes', {
  ref: 'Size',
  localField: 'sizeId',
  foreignField: '_id'
});

// Indexes for better performance
productSchema.index({ brandId: 1, status: 1 });
productSchema.index({ name: 1 });

module.exports = mongoose.model('Product', productSchema); 