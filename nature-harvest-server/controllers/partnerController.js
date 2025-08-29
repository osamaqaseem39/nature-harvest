const Partner = require('../models/Partner');
const { validationResult } = require('express-validator');

// Create partner application
exports.createPartner = async (req, res) => {
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

    const {
      companyName,
      contactPerson,
      email,
      phone,
      companyType,
      businessDescription,
      partnershipType,
      targetMarkets,
      annualRevenue,
      employeeCount,
      website,
      socialMedia,
      additionalInfo
    } = req.body;

    // Check if partner with this email already exists
    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: 'A partner application with this email already exists'
      });
    }

    // Create new partner application
    const partner = new Partner({
      companyName,
      contactPerson,
      email,
      phone,
      companyType,
      businessDescription,
      partnershipType,
      targetMarkets,
      annualRevenue,
      employeeCount,
      website,
      socialMedia,
      additionalInfo,
      status: 'Pending'
    });

    await partner.save();

    res.status(201).json({
      success: true,
      message: 'Partner application submitted successfully',
      data: partner
    });
  } catch (error) {
    console.error('Create partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit partner application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all partner applications (admin only)
exports.getAllPartners = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const partners = await Partner.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('respondedBy', 'name email');

    const total = await Partner.countDocuments(query);
    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: partners,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Get all partners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner applications',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get partner application by ID (admin only)
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id)
      .populate('respondedBy', 'name email');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner application not found'
      });
    }

    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Get partner by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update partner application status (admin only)
exports.updatePartnerStatus = async (req, res) => {
  try {
    const { status, notes, adminResponse } = req.body;
    
    const updateData = { status };
    if (notes) updateData.notes = notes;
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      updateData.respondedBy = req.user.id;
      updateData.respondedAt = new Date();
    }

    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('respondedBy', 'name email');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner application not found'
      });
    }

    res.json({
      success: true,
      message: 'Partner application status updated successfully',
      data: partner
    });
  } catch (error) {
    console.error('Update partner status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update partner application status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete partner application (admin only)
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner application not found'
      });
    }

    res.json({
      success: true,
      message: 'Partner application deleted successfully'
    });
  } catch (error) {
    console.error('Delete partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete partner application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get partner statistics (admin only)
exports.getPartnerStats = async (req, res) => {
  try {
    const stats = await Partner.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Partner.countDocuments();
    const pending = await Partner.countDocuments({ status: 'Pending' });
    const underReview = await Partner.countDocuments({ status: 'Under Review' });
    const approved = await Partner.countDocuments({ status: 'Approved' });
    const rejected = await Partner.countDocuments({ status: 'Rejected' });

    res.json({
      success: true,
      data: {
        total,
        pending,
        underReview,
        approved,
        rejected,
        breakdown: stats
      }
    });
  } catch (error) {
    console.error('Get partner stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}; 