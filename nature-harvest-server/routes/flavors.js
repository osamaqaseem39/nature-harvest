const express = require('express');
const router = express.Router();
const flavorController = require('../controllers/flavorController');
const { flavorValidation } = require('../middleware/validation');
const uploadFlavorImage = require('../middleware/uploadFlavorImage');


/**
 * @swagger
 * /api/flavors:
 *   get:
 *     summary: Get all flavors
 *     tags: [Flavors]
 *     responses:
 *       200:
 *         description: List of all flavors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flavor'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', flavorController.getAllFlavors);

/**
 * @swagger
 * /api/flavors/{id}:
 *   get:
 *     summary: Get flavor by ID
 *     tags: [Flavors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flavor ID
 *     responses:
 *       200:
 *         description: Flavor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flavor'
 *       404:
 *         description: Flavor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', flavorController.getFlavorById);

/**
 * @swagger
 * /api/flavors:
 *   post:
 *     summary: Create a new flavor
 *     tags: [Flavors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Flavor name
 *                 example: "Strawberry"
 *               description:
 *                 type: string
 *                 description: Flavor description
 *                 example: "Sweet and tangy strawberry flavor"
 *               imageUrl:
 *                 type: string
 *                 description: Flavor image URL
 *                 example: "https://example.com/image.jpg"
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: Flavor status
 *     responses:
 *       201:
 *         description: Flavor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flavor'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', uploadFlavorImage.single('image'), flavorValidation.create, flavorController.createFlavor);

/**
 * @swagger
 * /api/flavors/{id}:
 *   put:
 *     summary: Update a flavor
 *     tags: [Flavors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flavor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Flavor name
 *                 example: "Strawberry"
 *               description:
 *                 type: string
 *                 description: Flavor description
 *                 example: "Sweet and tangy strawberry flavor"
 *               imageUrl:
 *                 type: string
 *                 description: Flavor image URL
 *                 example: "https://example.com/image.jpg"
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: Flavor status
 *     responses:
 *       200:
 *         description: Flavor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flavor'
 *       404:
 *         description: Flavor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', uploadFlavorImage.single('image'), flavorValidation.update, flavorController.updateFlavor);

/**
 * @swagger
 * /api/flavors/{id}:
 *   delete:
 *     summary: Delete a flavor
 *     tags: [Flavors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flavor ID
 *     responses:
 *       200:
 *         description: Flavor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flavor deleted successfully"
 *       404:
 *         description: Flavor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', flavorController.deleteFlavor);

module.exports = router; 