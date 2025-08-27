const Brand = require('../models/Brand');
const { validationResult } = require('express-validator');

// Create brand with logo upload
exports.createBrand = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, status, imageUrl } = req.body;
    
    // Build brand data
    const brandData = {
      name,
      description,
      status: status || 'Active'
    };

    // Handle image URL (from frontend upload)
    if (imageUrl) {
      brandData.imageUrl = imageUrl;
    }

    // Handle logo upload (legacy file upload)
    if (req.file) {
      brandData.logoUrl = `/uploads/${req.file.filename}`;
    }

    const brand = new Brand(brandData);
    const savedBrand = await brand.save();

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create brand',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Get all brands with optional filtering
exports.getBrands = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get brands with products populated
    const brands = await Brand.find(filter)
      .populate('products')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Brand.countDocuments(filter);

    res.json({
      success: true,
      data: brands,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Get single brand by ID
exports.getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate('products');
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brand',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Update brand
exports.updateBrand = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, status, imageUrl } = req.body;
    
    // Build update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    // Handle image URL (from frontend upload)
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    // Handle logo upload (legacy file upload)
    if (req.file) {
      updateData.logoUrl = `/uploads/${req.file.filename}`;
    }

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    console.error('Update brand error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update brand',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Delete brand
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      message: 'Brand deleted successfully',
      data: brand
    });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete brand',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
}; 