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
      type: mongoose.Schema.Types.Mixed
    },
    protein: {
      type: mongoose.Schema.Types.Mixed
    },
    carbohydrates: {
      type: mongoose.Schema.Types.Mixed
    },
    fat: {
      type: mongoose.Schema.Types.Mixed
    },
    saturatedFat: {
      type: mongoose.Schema.Types.Mixed
    },
    fiber: {
      type: mongoose.Schema.Types.Mixed
    },
    sugar: {
      type: mongoose.Schema.Types.Mixed
    },
    sodium: {
      type: mongoose.Schema.Types.Mixed
    },
    vitaminC: {
      type: mongoose.Schema.Types.Mixed
    },
    vitaminA: {
      type: mongoose.Schema.Types.Mixed
    },
    calcium: {
      type: mongoose.Schema.Types.Mixed
    },
    iron: {
      type: mongoose.Schema.Types.Mixed
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
productSchema.index({ flavorId: 1, status: 1 });
productSchema.index({ sizeId: 1, status: 1 });
productSchema.index({ name: 1 });
productSchema.index({ status: 1 });

module.exports = mongoose.model('Product', productSchema); 