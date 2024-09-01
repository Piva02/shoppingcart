const express = require('express');
const router = express.Router();
const cartController = require('../controladores/cartController');
const { verifyToken } = require('../middleware/auth');

// Ruta para agregar un producto al carrito
router.post('/add', verifyToken, cartController.addToCart);

// Ruta para eliminar un producto del carrito
router.post('/remove', verifyToken, cartController.removeFromCart);

// Ruta para confirmar el carrito
router.post('/confirm', verifyToken, cartController.confirmCart);

module.exports = router;
