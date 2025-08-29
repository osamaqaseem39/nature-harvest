const express = require('express');
const router = express.Router();
const { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  deleteJob, 
  publishJob, 
  closeJob, 
  getJobStats, 
  getJobsByDepartment, 
  searchJobs 
} = require('../controllers/jobController');
const { 
  submitApplication, 
  getAllApplications, 
  getApplicationById, 
  updateApplicationStatus, 
  scheduleInterview, 
  updateInterview, 
  completeInterview, 
  addScreeningFeedback, 
  getApplicationStats, 
  deleteApplication 
} = require('../controllers/applicationController');
const { careerValidation } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/careers/jobs:
 *   post:
 *     summary: Create a new job posting (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - department
 *               - location
 *               - type
 *               - experience
 *               - description
 *               - requirements
 *               - responsibilities
 *               - education
 *               - applicationDeadline
 *               - positions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *               department:
 *                 type: string
 *                 description: Department
 *               location:
 *                 type: string
 *                 description: Job location
 *               type:
 *                 type: string
 *                 enum: [Full-time, Part-time, Contract, Internship, Temporary]
 *                 description: Job type
 *               experience:
 *                 type: string
 *                 enum: [Entry Level, Mid Level, Senior Level, Executive]
 *                 description: Experience level
 *               description:
 *                 type: string
 *                 description: Job description
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job requirements
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job responsibilities
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job benefits
 *               salary:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *                   period:
 *                     type: string
 *                     enum: [Hourly, Monthly, Yearly]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required skills
 *               education:
 *                 type: string
 *                 enum: [High School, Associate, Bachelor, Master, PhD, Any]
 *                 description: Education requirement
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *                 description: Application deadline
 *               positions:
 *                 type: integer
 *                 description: Number of positions
 *               isRemote:
 *                 type: boolean
 *                 description: Remote work option
 *               isUrgent:
 *                 type: boolean
 *                 description: Urgent hiring
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job tags
 *     responses:
 *       201:
 *         description: Job posting created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/jobs', authenticateToken, careerValidation.job.create, createJob);

/**
 * @swagger
 * /api/careers/jobs:
 *   get:
 *     summary: Get all jobs (public)
 *     tags: [Careers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by job type
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: Filter by experience level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, requirements
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: Published
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of jobs
 *       500:
 *         description: Server error
 */
router.get('/jobs', getAllJobs);

/**
 * @swagger
 * /api/careers/jobs/search:
 *   get:
 *     summary: Search jobs (public)
 *     tags: [Careers]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by job type
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: Filter by experience level
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Search results
 *       500:
 *         description: Server error
 */
router.get('/jobs/search', searchJobs);

/**
 * @swagger
 * /api/careers/jobs/department/{department}:
 *   get:
 *     summary: Get jobs by department (public)
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *         description: Department name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of jobs to return
 *     responses:
 *       200:
 *         description: Jobs by department
 *       500:
 *         description: Server error
 */
router.get('/jobs/department/:department', getJobsByDepartment);

/**
 * @swagger
 * /api/careers/jobs/{id}:
 *   get:
 *     summary: Get job by ID (public)
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.get('/jobs/:id', getJobById);

/**
 * @swagger
 * /api/careers/jobs/{id}:
 *   put:
 *     summary: Update job posting (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               department:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *               experience:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: array
 *               responsibilities:
 *                 type: array
 *               benefits:
 *                 type: array
 *               salary:
 *                 type: object
 *               skills:
 *                 type: array
 *               education:
 *                 type: string
 *               applicationDeadline:
 *                 type: string
 *               positions:
 *                 type: integer
 *               isRemote:
 *                 type: boolean
 *               isUrgent:
 *                 type: boolean
 *               tags:
 *                 type: array
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.put('/jobs/:id', authenticateToken, careerValidation.job.update, updateJob);

/**
 * @swagger
 * /api/careers/jobs/{id}/publish:
 *   put:
 *     summary: Publish job posting (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job published successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.put('/jobs/:id/publish', authenticateToken, publishJob);

/**
 * @swagger
 * /api/careers/jobs/{id}/close:
 *   put:
 *     summary: Close job posting (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job closed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.put('/jobs/:id/close', authenticateToken, closeJob);

/**
 * @swagger
 * /api/careers/jobs/{id}:
 *   delete:
 *     summary: Delete job posting (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.delete('/jobs/:id', authenticateToken, deleteJob);

/**
 * @swagger
 * /api/careers/jobs/stats:
 *   get:
 *     summary: Get job statistics (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job statistics
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/jobs/stats', authenticateToken, getJobStats);

/**
 * @swagger
 * /api/careers/applications:
 *   post:
 *     summary: Submit job application (public)
 *     tags: [Careers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - candidateData
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: Job ID
 *               candidateData:
 *                 type: object
 *                 description: Candidate information
 *               coverLetter:
 *                 type: object
 *                 description: Cover letter
 *               additionalDocuments:
 *                 type: array
 *                 description: Additional documents
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.post('/applications', careerValidation.application.submit, submitApplication);

/**
 * @swagger
 * /api/careers/applications:
 *   get:
 *     summary: Get all applications (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         description: Filter by job
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in candidate name or email
 *     responses:
 *       200:
 *         description: List of applications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/applications', authenticateToken, getAllApplications);

/**
 * @swagger
 * /api/careers/applications/{id}:
 *   get:
 *     summary: Get application by ID (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.get('/applications/:id', authenticateToken, getApplicationById);

/**
 * @swagger
 * /api/careers/applications/{id}/status:
 *   put:
 *     summary: Update application status (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Applied, Under Review, Shortlisted, Interview Scheduled, Interview Completed, Offer Made, Hired, Rejected, Withdrawn]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.put('/applications/:id/status', authenticateToken, updateApplicationStatus);

/**
 * @swagger
 * /api/careers/applications/{id}/interview:
 *   post:
 *     summary: Schedule interview (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - round
 *               - type
 *               - scheduledDate
 *               - duration
 *               - interviewers
 *             properties:
 *               round:
 *                 type: integer
 *                 description: Interview round number
 *               type:
 *                 type: string
 *                 enum: [Phone, Video, In-Person, Technical, Panel, Final]
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *               location:
 *                 type: string
 *               meetingLink:
 *                 type: string
 *               interviewers:
 *                 type: array
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interview scheduled successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.post('/applications/:id/interview', authenticateToken, scheduleInterview);

/**
 * @swagger
 * /api/careers/applications/{id}/interview/{interviewId}:
 *   put:
 *     summary: Update interview (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Interview updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application or interview not found
 *       500:
 *         description: Server error
 */
router.put('/applications/:id/interview/:interviewId', authenticateToken, updateInterview);

/**
 * @swagger
 * /api/careers/applications/{id}/interview/{interviewId}/complete:
 *   put:
 *     summary: Complete interview (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
 *                 type: object
 *               status:
 *                 type: string
 *                 default: Completed
 *     responses:
 *       200:
 *         description: Interview completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application or interview not found
 *       500:
 *         description: Server error
 */
router.put('/applications/:id/interview/:interviewId/complete', authenticateToken, completeInterview);

/**
 * @swagger
 * /api/careers/applications/{id}/screening:
 *   put:
 *     summary: Add screening feedback (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isPassed
 *               - score
 *             properties:
 *               isPassed:
 *                 type: boolean
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Screening feedback added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.put('/applications/:id/screening', authenticateToken, addScreeningFeedback);

/**
 * @swagger
 * /api/careers/applications/stats:
 *   get:
 *     summary: Get application statistics (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application statistics
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/applications/stats', authenticateToken, getApplicationStats);

/**
 * @swagger
 * /api/careers/applications/{id}:
 *   delete:
 *     summary: Delete application (admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.delete('/applications/:id', authenticateToken, deleteApplication);

module.exports = router;