const Size = require('../models/Size');
const fs = require('fs');
const path = require('path');

// Get all sizes
exports.getAllSizes = async (req, res) => {
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
    
    const sizes = await Size.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Size.countDocuments(filter);

    res.json({
      success: true,
      data: sizes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch sizes',
      error: err.message 
    });
  }
};

// Get size by ID
exports.getSizeById = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) {
      return res.status(404).json({ 
        success: false,
        message: 'Size not found' 
      });
    }
    res.json({
      success: true,
      data: size
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch size',
      error: err.message 
    });
  }
};

// Create new size
exports.createSize = async (req, res) => {
  try {
    const { name, description, status = 'Active', imageUrl } = req.body;

    const size = new Size({
      name,
      description,
      imageUrl,
      status
    });

    const savedSize = await size.save();
    res.status(201).json({
      success: true,
      message: 'Size created successfully',
      data: savedSize
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create size',
      error: err.message 
    });
  }
};

// Update size
exports.updateSize = async (req, res) => {
  try {
    const { name, description, status, imageUrl } = req.body;
    const updateData = { name, description, status, imageUrl };

    const size = await Size.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!size) {
      return res.status(404).json({ 
        success: false,
        message: 'Size not found' 
      });
    }

    res.json({
      success: true,
      message: 'Size updated successfully',
      data: size
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update size',
      error: err.message 
    });
  }
};

// Delete size
exports.deleteSize = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) {
      return res.status(404).json({ 
        success: false,
        message: 'Size not found' 
      });
    }

    // Delete image file if exists
    if (size.imageUrl) {
      const imagePath = path.join(__dirname, '..', size.imageUrl.replace('server/', ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Size.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: 'Size deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete size',
      error: err.message 
    });
  }
}; 