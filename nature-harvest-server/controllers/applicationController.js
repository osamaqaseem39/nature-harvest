const Application = require('../models/Application');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const { validationResult } = require('express-validator');

// Submit job application
exports.submitApplication = async (req, res) => {
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
      jobId,
      candidateData,
      coverLetter,
      additionalDocuments
    } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Published') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications'
      });
    }

    if (new Date() > job.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    if (job.applications >= job.positions) {
      return res.status(400).json({
        success: false,
        message: 'All positions have been filled'
      });
    }

    // Check if candidate already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      'candidate.email': candidateData.email
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position'
      });
    }

    // Create or update candidate
    let candidate = await Candidate.findOne({ email: candidateData.email });
    
    if (candidate) {
      // Update existing candidate with new information
      Object.assign(candidate, candidateData);
      await candidate.save();
    } else {
      // Create new candidate
      candidate = new Candidate(candidateData);
      await candidate.save();
    }

    // Create application
    const application = new Application({
      jobId,
      candidateId: candidate._id,
      coverLetter,
      resume: candidate.resume,
      additionalDocuments,
      status: 'Applied',
      source: 'Website'
    });

    await application.save();

    // Add to timeline
    application.timeline.push({
      action: 'Application Submitted',
      description: 'Job application submitted successfully',
      performedAt: new Date()
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: application._id,
        candidateId: candidate._id,
        status: application.status
      }
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, jobId, search } = req.query;
    
    const query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by job
    if (jobId) {
      query.jobId = jobId;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { 'candidate.firstName': { $regex: search, $options: 'i' } },
        { 'candidate.lastName': { $regex: search, $options: 'i' } },
        { 'candidate.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('jobId', 'title department location')
      .populate('candidateId', 'firstName lastName email')
      .populate('screening.reviewedBy', 'name email');

    const total = await Application.countDocuments(query);
    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get application by ID (admin only)
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title department location description requirements')
      .populate('candidateId')
      .populate('screening.reviewedBy', 'name email')
      .populate('interviews.scheduledBy', 'name email')
      .populate('interviews.interviewers.userId', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update application status (admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('jobId', 'title department location')
     .populate('candidateId', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Add to timeline
    application.timeline.push({
      action: `Status Updated to ${status}`,
      description: notes || `Application status changed to ${status}`,
      performedBy: req.user.id,
      performedAt: new Date()
    });

    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Schedule interview (admin only)
exports.scheduleInterview = async (req, res) => {
  try {
    const {
      round,
      type,
      scheduledDate,
      duration,
      location,
      meetingLink,
      interviewers,
      notes
    } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Create new interview
    const interview = {
      round,
      type,
      scheduledDate: new Date(scheduledDate),
      duration,
      location,
      meetingLink,
      interviewers,
      notes,
      status: 'Scheduled',
      scheduledBy: req.user.id,
      scheduledAt: new Date()
    };

    application.interviews.push(interview);
    application.status = 'Interview Scheduled';

    // Add to timeline
    application.timeline.push({
      action: 'Interview Scheduled',
      description: `${type} interview scheduled for round ${round}`,
      performedBy: req.user.id,
      performedAt: new Date()
    });

    await application.save();

    res.json({
      success: true,
      message: 'Interview scheduled successfully',
      data: application
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update interview (admin only)
exports.updateInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const updateData = req.body;

    const application = await Application.findOneAndUpdate(
      { 
        _id: req.params.id,
        'interviews._id': interviewId
      },
      {
        $set: {
          'interviews.$': { ...updateData, _id: interviewId }
        }
      },
      { new: true, runValidators: true }
    ).populate('jobId', 'title department location')
     .populate('candidateId', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application or interview not found'
      });
    }

    // Add to timeline
    application.timeline.push({
      action: 'Interview Updated',
      description: 'Interview details updated',
      performedBy: req.user.id,
      performedAt: new Date()
    });

    await application.save();

    res.json({
      success: true,
      message: 'Interview updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Complete interview (admin only)
exports.completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { feedback, status = 'Completed' } = req.body;

    const application = await Application.findOneAndUpdate(
      { 
        _id: req.params.id,
        'interviews._id': interviewId
      },
      {
        $set: {
          'interviews.$.status': status,
          'interviews.$.feedback': feedback,
          'interviews.$.completedAt': new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate('jobId', 'title department location')
     .populate('candidateId', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application or interview not found'
      });
    }

    // Add to timeline
    application.timeline.push({
      action: 'Interview Completed',
      description: `Interview round ${application.interviews.find(i => i._id.toString() === interviewId).round} completed`,
      performedBy: req.user.id,
      performedAt: new Date()
    });

    await application.save();

    res.json({
      success: true,
      message: 'Interview completed successfully',
      data: application
    });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete interview',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Add screening feedback (admin only)
exports.addScreeningFeedback = async (req, res) => {
  try {
    const { isPassed, score, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        'screening.isPassed': isPassed,
        'screening.score': score,
        'screening.notes': notes,
        'screening.reviewedBy': req.user.id,
        'screening.reviewedAt': new Date()
      },
      { new: true, runValidators: true }
    ).populate('jobId', 'title department location')
     .populate('candidateId', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Add to timeline
    application.timeline.push({
      action: 'Screening Completed',
      description: `Screening ${isPassed ? 'passed' : 'failed'} with score ${score}`,
      performedBy: req.user.id,
      performedAt: new Date()
    });

    await application.save();

    res.json({
      success: true,
      message: 'Screening feedback added successfully',
      data: application
    });
  } catch (error) {
    console.error('Add screening feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add screening feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get application statistics (admin only)
exports.getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Application.countDocuments();
    const applied = await Application.countDocuments({ status: 'Applied' });
    const underReview = await Application.countDocuments({ status: 'Under Review' });
    const shortlisted = await Application.countDocuments({ status: 'Shortlisted' });
    const interviewScheduled = await Application.countDocuments({ status: 'Interview Scheduled' });
    const interviewCompleted = await Application.countDocuments({ status: 'Interview Completed' });
    const offerMade = await Application.countDocuments({ status: 'Offer Made' });
    const hired = await Application.countDocuments({ status: 'Hired' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });

    // Get upcoming interviews
    const upcomingInterviews = await Application.countDocuments({
      'interviews.scheduledDate': { $gt: new Date() },
      'interviews.status': 'Scheduled'
    });

    res.json({
      success: true,
      data: {
        total,
        applied,
        underReview,
        shortlisted,
        interviewScheduled,
        interviewCompleted,
        offerMade,
        hired,
        rejected,
        upcomingInterviews,
        breakdown: stats
      }
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete application (admin only)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}; 