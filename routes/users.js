const express = require('express');
const router = express.Router();
const usersController = require('../controladores/usersController');
const { verifyToken } = require('../middleware/auth');

// Create a user
router.post('/', usersController.createUser);

// Get all users
router.get('/', usersController.getUsers);

// Get a user by ID
router.get('/:id', usersController.getUserById);

// Update a user
router.put('/:id', usersController.updateUser);

// Delete a user
router.delete('/:id', usersController.deleteUser);

//Token during user registration

router.post('/register', usersController.createUser);

module.exports = router;

