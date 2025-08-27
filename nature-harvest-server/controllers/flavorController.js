const Flavor = require('../models/Flavor');
const fs = require('fs');
const path = require('path');

// Get all flavors
exports.getAllFlavors = async (req, res) => {
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
    
    const flavors = await Flavor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Flavor.countDocuments(filter);

    res.json({
      success: true,
      data: flavors,
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
      message: 'Failed to fetch flavors',
      error: err.message 
    });
  }
};

// Get flavor by ID
exports.getFlavorById = async (req, res) => {
  try {
    const flavor = await Flavor.findById(req.params.id);
    if (!flavor) {
      return res.status(404).json({ 
        success: false,
        message: 'Flavor not found' 
      });
    }
    res.json({
      success: true,
      data: flavor
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch flavor',
      error: err.message 
    });
  }
};

// Create new flavor
exports.createFlavor = async (req, res) => {
  try {
    const { name, description, status = 'Active' } = req.body;
    
    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      imageUrl = `uploads/flavors/${req.file.filename}`;
    }

    const flavor = new Flavor({
      name,
      description,
      imageUrl,
      status
    });

    const savedFlavor = await flavor.save();
    res.status(201).json({
      success: true,
      message: 'Flavor created successfully',
      data: savedFlavor
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create flavor',
      error: err.message 
    });
  }
};

// Update flavor
exports.updateFlavor = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const updateData = { name, description, status };

    // Handle image upload
    if (req.file) {
      updateData.imageUrl = `uploads/flavors/${req.file.filename}`;
      
      // Delete old image if exists
      const existingFlavor = await Flavor.findById(req.params.id);
      if (existingFlavor && existingFlavor.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', existingFlavor.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const flavor = await Flavor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!flavor) {
      return res.status(404).json({ 
        success: false,
        message: 'Flavor not found' 
      });
    }

    res.json({
      success: true,
      message: 'Flavor updated successfully',
      data: flavor
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update flavor',
      error: err.message 
    });
  }
};

// Delete flavor
exports.deleteFlavor = async (req, res) => {
  try {
    const flavor = await Flavor.findById(req.params.id);
    if (!flavor) {
      return res.status(404).json({ 
        success: false,
        message: 'Flavor not found' 
      });
    }

    // Delete image file if exists
    if (flavor.imageUrl) {
      const imagePath = path.join(__dirname, '..', flavor.imageUrl.replace('server/', ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Flavor.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: 'Flavor deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete flavor',
      error: err.message 
    });
  }
}; 