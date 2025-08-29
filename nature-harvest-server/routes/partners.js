const express = require('express');
const router = express.Router();
const { 
  createPartner, 
  getAllPartners, 
  getPartnerById, 
  updatePartnerStatus, 
  deletePartner, 
  getPartnerStats 
} = require('../controllers/partnerController');
const { partnerValidation } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Submit a new partner application
 *     tags: [Partners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - contactPerson
 *               - email
 *               - phone
 *               - companyType
 *               - businessDescription
 *               - partnershipType
 *               - targetMarkets
 *               - annualRevenue
 *               - employeeCount
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: Company name
 *               contactPerson:
 *                 type: string
 *                 description: Contact person name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *               companyType:
 *                 type: string
 *                 enum: [Distributor, Retailer, Wholesaler, Restaurant, Cafe, Hotel, Supermarket, Other]
 *                 description: Type of company
 *               businessDescription:
 *                 type: string
 *                 description: Description of the business
 *               partnershipType:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Distribution, Retail, Wholesale, Co-branding, Joint Marketing, Product Development, Other]
 *                 description: Types of partnership interested in
 *               targetMarkets:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Target markets
 *               annualRevenue:
 *                 type: string
 *                 enum: [Under $100K, $100K - $500K, $500K - $1M, $1M - $5M, $5M - $10M, Over $10M, Prefer not to say]
 *                 description: Annual revenue range
 *               employeeCount:
 *                 type: string
 *                 enum: [1-10, 11-50, 51-100, 101-500, 500+, Prefer not to say]
 *                 description: Number of employees
 *               website:
 *                 type: string
 *                 format: uri
 *                 description: Company website
 *               socialMedia:
 *                 type: object
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                   facebook:
 *                     type: string
 *                   instagram:
 *                     type: string
 *                   twitter:
 *                     type: string
 *               additionalInfo:
 *                 type: string
 *                 description: Additional information
 *     responses:
 *       201:
 *         description: Partner application submitted successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', partnerValidation.create, createPartner);

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Get all partner applications (admin only)
 *     tags: [Partners]
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
 *           enum: [Pending, Under Review, Approved, Rejected, Contacted, all]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in company name, contact person, or email
 *     responses:
 *       200:
 *         description: List of partner applications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, getAllPartners);

/**
 * @swagger
 * /api/partners/stats:
 *   get:
 *     summary: Get partner application statistics (admin only)
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partner statistics
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/stats', authenticate, getPartnerStats);

/**
 * @swagger
 * /api/partners/{id}:
 *   get:
 *     summary: Get partner application by ID (admin only)
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner application ID
 *     responses:
 *       200:
 *         description: Partner application details
 *       404:
 *         description: Partner application not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, getPartnerById);

/**
 * @swagger
 * /api/partners/{id}/status:
 *   put:
 *     summary: Update partner application status (admin only)
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Under Review, Approved, Rejected, Contacted]
 *                 required: true
 *               notes:
 *                 type: string
 *                 description: Admin notes
 *               adminResponse:
 *                 type: string
 *                 description: Response to the partner
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Partner application not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id/status', authenticate, updatePartnerStatus);

/**
 * @swagger
 * /api/partners/{id}:
 *   delete:
 *     summary: Delete partner application (admin only)
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner application ID
 *     responses:
 *       200:
 *         description: Partner application deleted successfully
 *       404:
 *         description: Partner application not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, deletePartner);

module.exports = router; 