const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Size = require('../models/Size');
const Flavor = require('../models/Flavor');
const { validationResult } = require('express-validator');

// Create product
exports.createProduct = async (req, res) => {
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

    const { brandId, name, description, sizeId, flavorId, imageUrl, gallery, nutrients, status } = req.body;

    // Debug logging
    console.log('Create Product - Request Body:', req.body);
    console.log('Create Product - Extracted Data:', { brandId, name, description, sizeId, flavorId, imageUrl, gallery, nutrients, status });

    // Verify brand exists
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Verify size exists if provided
    if (sizeId) {
      const size = await Size.findById(sizeId);
      if (!size) {
        return res.status(404).json({
          success: false,
          message: 'Size not found'
        });
      }
    }

    // Verify flavor exists if provided
    if (flavorId) {
      const flavor = await Flavor.findById(flavorId);
      if (!flavor) {
        return res.status(404).json({
          success: false,
          message: 'Flavor not found'
        });
      }
    }

    // Build product data
    const productData = {
      brandId,
      name,
      description,
      sizeId: sizeId || null,
      flavorId: flavorId || null,
      imageUrl: imageUrl || '',
      gallery: gallery || [],
      nutrients: nutrients || {},
      status: status || 'Active'
    };

    console.log('Create Product - Product Data to Save:', productData);

    const product = new Product(productData);
    await product.save();

    console.log('Create Product - Saved Product:', product);

    // Populate related data
    await product.populate('brandId', 'name imageUrl logoUrl');
    if (product.sizeId) {
      await product.populate('sizeId', 'name');
    }
    if (product.flavorId) {
      await product.populate('flavorId', 'name description imageUrl');
    }

    console.log('Create Product - Final Response Data:', product);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
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

    const { brandId, name, description, sizeId, flavorId, imageUrl, gallery, nutrients, status } = req.body;

    // Debug logging
    console.log('Update Product - Request Body:', req.body);
    console.log('Update Product - Extracted Data:', { brandId, name, description, sizeId, flavorId, imageUrl, gallery, nutrients, status });

    // Verify brand exists if provided
    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return res.status(404).json({
          success: false,
          message: 'Brand not found'
        });
      }
    }

    // Verify size exists if provided
    if (sizeId) {
      const size = await Size.findById(sizeId);
      if (!size) {
        return res.status(404).json({
          success: false,
          message: 'Size not found'
        });
      }
    }

    // Verify flavor exists if provided
    if (flavorId) {
      const flavor = await Flavor.findById(flavorId);
      if (!flavor) {
        return res.status(404).json({
          success: false,
          message: 'Flavor not found'
        });
      }
    }

    // Build update data
    const updateData = {};
    if (brandId) updateData.brandId = brandId;
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (sizeId !== undefined) updateData.sizeId = sizeId || null;
    if (flavorId !== undefined) updateData.flavorId = flavorId || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || '';
    if (gallery !== undefined) updateData.gallery = gallery || [];
    if (nutrients !== undefined) updateData.nutrients = nutrients || {};
    if (status) updateData.status = status;

    console.log('Update Product - Update Data:', updateData);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Populate related data
    await product.populate('brandId', 'name imageUrl logoUrl');
    if (product.sizeId) {
      await product.populate('sizeId', 'name');
    }
    if (product.flavorId) {
      await product.populate('flavorId', 'name description imageUrl');
    }

    console.log('Update Product - Final Response Data:', product);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Get all products with optional filtering
exports.getAllProducts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, brandId, flavorId, sizeId } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (brandId) filter.brandId = brandId;
    if (flavorId) filter.flavorId = flavorId;
    if (sizeId) filter.sizeId = sizeId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get products with populated data
    const products = await Product.find(filter)
      .populate('brandId', 'name imageUrl logoUrl')
      .populate('sizeId', 'name')
      .populate('flavorId', 'name description imageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('Get All Products - Raw Products:', products);

    const total = await Product.countDocuments(filter);

    console.log('Get All Products - Response Data:', products);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Get a single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('brandId', 'name imageUrl logoUrl')
      .populate('sizeId', 'name')
      .populate('flavorId', 'name description imageUrl');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
}; 