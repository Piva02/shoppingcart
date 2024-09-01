const express = require('express');
const router = express.Router();
const usersController = require('../controladores/usersController');

// Ruta para iniciar sesión
router.post('/login', usersController.loginUser);

// Ruta para registrar un nuevo usuario
router.post('/register', usersController.createUser);

// Ruta para confirmar el token
router.post('/confirm', usersController.confirmUser);


// Otras rutas como actualizar, eliminar, etc.
module.exports = router;

