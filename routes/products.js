const { verifyAdmin, verifyToken } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const productsController = require('../controladores/productsController');

// Crear un producto (Solo administradores)
router.post('/', verifyToken, verifyAdmin, productsController.createProduct);

// Obtener todos los productos (Cualquier usuario o no)
router.get('/', productsController.getProducts);

// Actualizar un producto (Solo administradores)
router.put('/:id', verifyToken, verifyAdmin, productsController.updateProduct);

// Eliminar un producto (Solo administradores)
router.delete('/:id', verifyToken, verifyAdmin, productsController.deleteProduct);

module.exports = router;

