const express = require('express');
const router = express.Router();
const estadosController = require('../controladores/estadosController');

// Ruta para crear un nuevo estado
router.post('/', estadosController.createEstado);

// Ruta para obtener todos los estados
router.get('/', estadosController.getEstados);

// Ruta para obtener un estado por ID
router.get('/:id', estadosController.getEstadoById);

// Ruta para actualizar un estado
router.put('/:id', estadosController.updateEstado);

// Ruta para eliminar un estado
router.delete('/:id', estadosController.deleteEstado);

module.exports = router;
