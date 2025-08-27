const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, getAllProducts, getProduct, deleteProduct } = require('../controllers/productController');
const { productValidation } = require('../middleware/validation');

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - brandId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "Organic Apple Juice"
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: "Fresh organic apple juice made from hand-picked apples"
 *               brandId:
 *                 type: string
 *                 description: Brand ID
 *                 example: "507f1f77bcf86cd799439011"
 *               sizeId:
 *                 type: string
 *                 description: Size ID (optional)
 *                 example: "507f1f77bcf86cd799439012"
 *               flavorId:
 *                 type: string
 *                 description: Flavor ID (optional)
 *                 example: "507f1f77bcf86cd799439013"
 *               imageUrl:
 *                 type: string
 *                 description: Product image URL
 *                 example: "https://example.com/image.jpg"
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product gallery image URLs
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               nutrients:
 *                 type: object
 *                 description: Nutritional information
 *                 properties:
 *                   calories:
 *                     type: number
 *                     description: Calories per serving
 *                     example: 120
 *                   protein:
 *                     type: number
 *                     description: Protein in grams
 *                     example: 2.5
 *                   carbohydrates:
 *                     type: number
 *                     description: Carbohydrates in grams
 *                     example: 25.0
 *                   fat:
 *                     type: number
 *                     description: Fat in grams
 *                     example: 0.5
 *                   fiber:
 *                     type: number
 *                     description: Fiber in grams
 *                     example: 3.0
 *                   sugar:
 *                     type: number
 *                     description: Sugar in grams
 *                     example: 20.0
 *                   sodium:
 *                     type: number
 *                     description: Sodium in milligrams
 *                     example: 15
 *                   vitaminC:
 *                     type: number
 *                     description: Vitamin C in milligrams
 *                     example: 45.0
 *                   vitaminA:
 *                     type: number
 *                     description: Vitamin A in IU
 *                     example: 500
 *                   calcium:
 *                     type: number
 *                     description: Calcium in milligrams
 *                     example: 20
 *                   iron:
 *                     type: number
 *                     description: Iron in milligrams
 *                     example: 0.5
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 default: Active
 *                 description: Product status
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
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
router.post('/', productValidation.create, createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     pages:
 *                       type: integer
 *                       example: 3
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
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
router.get('/:id', getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "Organic Apple Juice"
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: "Fresh organic apple juice made from hand-picked apples"
 *               brandId:
 *                 type: string
 *                 description: Brand ID
 *                 example: "507f1f77bcf86cd799439011"
 *               sizeId:
 *                 type: string
 *                 description: Size ID (optional)
 *                 example: "507f1f77bcf86cd799439012"
 *               flavorId:
 *                 type: string
 *                 description: Flavor ID (optional)
 *                 example: "507f1f77bcf86cd799439013"
 *               imageUrl:
 *                 type: string
 *                 description: Product image URL
 *                 example: "https://example.com/image.jpg"
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product gallery image URLs
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               nutrients:
 *                 type: object
 *                 description: Nutritional information
 *                 properties:
 *                   calories:
 *                     type: number
 *                     description: Calories per serving
 *                   protein:
 *                     type: number
 *                     description: Protein in grams
 *                   carbohydrates:
 *                     type: number
 *                     description: Carbohydrates in grams
 *                   fat:
 *                     type: number
 *                     description: Fat in grams
 *                   fiber:
 *                     type: number
 *                     description: Fiber in grams
 *                   sugar:
 *                     type: number
 *                     description: Sugar in grams
 *                   sodium:
 *                     type: number
 *                     description: Sodium in milligrams
 *                   vitaminC:
 *                     type: number
 *                     description: Vitamin C in milligrams
 *                   vitaminA:
 *                     type: number
 *                     description: Vitamin A in IU
 *                   calcium:
 *                     type: number
 *                     description: Calcium in milligrams
 *                   iron:
 *                     type: number
 *                     description: Iron in milligrams
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: Product status
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
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
router.put('/:id', productValidation.update, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
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
router.delete('/:id', deleteProduct);

module.exports = router; 