const express = require('express');
const router = express.Router();
const categoriesController = require('../controladores/categoriesController');

// Create a category
router.post('/', categoriesController.createCategory);

// Get all categories
router.get('/', categoriesController.getCategories);

// Get a category by ID
router.get('/:id', categoriesController.getCategoryById);

// Update a category
router.put('/:id', categoriesController.updateCategory);

// Delete a category
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;

