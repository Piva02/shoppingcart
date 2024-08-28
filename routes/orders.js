const express = require('express');
const router = express.Router();
const ordersController = require('../controladores/ordersController');

// Create an order
router.post('/', ordersController.createOrder);

// Get all orders
router.get('/', ordersController.getOrders);

// Get an order by ID
router.get('/:id', ordersController.getOrderById);

// Update an order
router.put('/:id', ordersController.updateOrder);

// Delete an order
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;

