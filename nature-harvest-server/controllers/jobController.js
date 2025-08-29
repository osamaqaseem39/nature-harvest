const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// Create job posting
exports.createJob = async (req, res) => {
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
      title,
      department,
      location,
      type,
      experience,
      description,
      requirements,
      responsibilities,
      benefits,
      salary,
      skills,
      education,
      applicationDeadline,
      positions,
      isRemote,
      isUrgent,
      tags
    } = req.body;

    // Create new job
    const job = new Job({
      title,
      department,
      location,
      type,
      experience,
      description,
      requirements,
      responsibilities,
      benefits,
      salary,
      skills,
      education,
      applicationDeadline,
      positions,
      isRemote,
      isUrgent,
      tags,
      createdBy: req.user.id,
      status: 'Draft'
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job posting',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all jobs (public)
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, location, type, experience, search, status = 'Published' } = req.query;
    
    const query = { status };
    
    // Filter by department
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    
    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Filter by job type
    if (type) {
      query.type = type;
    }
    
    // Filter by experience level
    if (experience) {
      query.experience = experience;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await Job.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name');

    const total = await Job.countDocuments(query);
    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get job by ID (public)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count for public access
    if (req.user?.role !== 'admin') {
      job.views += 1;
      await job.save();
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update job posting (admin only)
exports.updateJob = async (req, res) => {
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

    const updateData = { ...req.body };
    
    // Handle status changes
    if (updateData.status === 'Published' && !req.body.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (updateData.status === 'Closed' && !req.body.closedAt) {
      updateData.closedAt = new Date();
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job posting updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job posting',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete job posting (admin only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job posting deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job posting',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Publish job posting (admin only)
exports.publishJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Published',
        publishedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job posting published successfully',
      data: job
    });
  } catch (error) {
    console.error('Publish job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish job posting',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Close job posting (admin only)
exports.closeJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Closed',
        closedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job posting closed successfully',
      data: job
    });
  } catch (error) {
    console.error('Close job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close job posting',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get job statistics (admin only)
exports.getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalApplications: { $sum: '$applications' }
        }
      }
    ]);

    const total = await Job.countDocuments();
    const published = await Job.countDocuments({ status: 'Published' });
    const draft = await Job.countDocuments({ status: 'Draft' });
    const closed = await Job.countDocuments({ status: 'Closed' });
    const archived = await Job.countDocuments({ status: 'Archived' });

    const totalViews = await Job.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const totalApplications = await Job.aggregate([
      { $group: { _id: null, total: { $sum: '$applications' } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        published,
        draft,
        closed,
        archived,
        totalViews: totalViews[0]?.total || 0,
        totalApplications: totalApplications[0]?.total || 0,
        breakdown: stats
      }
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get jobs by department (public)
exports.getJobsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const { limit = 5 } = req.query;

    const jobs = await Job.find({ 
      department: { $regex: department, $options: 'i' },
      status: 'Published'
    })
    .sort({ publishedAt: -1 })
    .limit(parseInt(limit))
    .populate('createdBy', 'name');

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs by department error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs by department',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Search jobs (public)
exports.searchJobs = async (req, res) => {
  try {
    const { q, department, location, type, experience, page = 1, limit = 10 } = req.query;
    
    const query = { status: 'Published' };
    
    // Text search
    if (q) {
      query.$text = { $search: q };
    }
    
    // Filters
    if (department) query.department = { $regex: department, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (experience) query.experience = experience;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await Job.find(query)
      .sort({ publishedAt: -1, score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name');

    const total = await Job.countDocuments(query);
    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}; 