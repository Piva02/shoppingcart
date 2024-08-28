const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const productsController = require('../controladores/productsController');

// Create a product
router.post('/', productsController.createProduct);

// Get all products
router.get('/', productsController.getProducts);

// Get a product by ID
router.get('/:id', productsController.getProductById);

// Update a product
router.put('/:id', productsController.updateProduct);

// Delete a product
router.delete('/:id', productsController.deleteProduct);

module.exports = router;

