const express = require('express');
const UserController = require('../controllers/usersController');
const router = express.Router();

router.get('/', UserController.getAllUser);
router.post('/', UserController.saveUser);
router.post('/login', UserController.loginUser);
router.put('/:id', UserController.updateUserById);
router.delete('/:id', UserController.deleteUserById);
router.get('/:id', UserController.getUserById);

module.exports = router;
