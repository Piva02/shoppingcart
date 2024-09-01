const express = require('express');
const router = express.Router();
const ordersController = require('../controladores/ordersController');

// Ruta para crear una orden
router.post('/', ordersController.createOrder);

// Ruta para confirmar el carrito
router.post('/confirm', ordersController.confirmCart);

// Ruta para rechazar el carrito
router.post('/reject', ordersController.rejectCart);

// Ruta para obtener todas las órdenes
router.get('/', ordersController.getOrders);

// Ruta para obtener una orden por ID
router.get('/:id', ordersController.getOrderById);

// Ruta para actualizar una orden
router.put('/:id', ordersController.updateOrder);

// Ruta para eliminar una orden
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;



