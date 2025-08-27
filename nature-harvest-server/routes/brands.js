const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// POST /api/brands
router.post('/', brandController.createBrand);
// GET /api/brands
router.get('/', brandController.getBrands);
// GET /api/brands/:id
router.get('/:id', brandController.getBrand);
// PUT /api/brands/:id
router.put('/:id', brandController.updateBrand);
// DELETE /api/brands/:id
router.delete('/:id', brandController.deleteBrand);

module.exports = router; 