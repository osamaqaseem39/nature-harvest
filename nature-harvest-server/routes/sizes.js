const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/sizeController');
const { sizeValidation } = require('../middleware/validation');


/**
 * @swagger
 * /api/sizes:
 *   get:
 *     summary: Get all sizes
 *     tags: [Sizes]
 *     responses:
 *       200:
 *         description: List of all sizes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Size'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', sizeController.getAllSizes);

/**
 * @swagger
 * /api/sizes/{id}:
 *   get:
 *     summary: Get size by ID
 *     tags: [Sizes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *     responses:
 *       200:
 *         description: Size retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       404:
 *         description: Size not found
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
router.get('/:id', sizeController.getSizeById);

/**
 * @swagger
 * /api/sizes:
 *   post:
 *     summary: Create a new size
 *     tags: [Sizes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Size name
 *                 example: "Large"
 *               description:
 *                 type: string
 *                 description: Size description
 *                 example: "Large size for family consumption"
 *               imageUrl:
 *                 type: string
 *                 description: Size image URL
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: Size status
 *     responses:
 *       201:
 *         description: Size created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
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
router.post('/', sizeValidation.create, sizeController.createSize);

/**
 * @swagger
 * /api/sizes/{id}:
 *   put:
 *     summary: Update a size
 *     tags: [Sizes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Size name
 *                 example: "Large"
 *               description:
 *                 type: string
 *                 description: Size description
 *                 example: "Large size for family consumption"
 *               imageUrl:
 *                 type: string
 *                 description: Size image URL
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: Size status
 *     responses:
 *       200:
 *         description: Size updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       404:
 *         description: Size not found
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
router.put('/:id', sizeValidation.update, sizeController.updateSize);

/**
 * @swagger
 * /api/sizes/{id}:
 *   delete:
 *     summary: Delete a size
 *     tags: [Sizes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *     responses:
 *       200:
 *         description: Size deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Size deleted successfully"
 *       404:
 *         description: Size not found
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
router.delete('/:id', sizeController.deleteSize);

module.exports = router; 