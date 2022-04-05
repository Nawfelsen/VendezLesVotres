const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authentification.middleware');

// import controller for index
const userController = require('../controllers/user.controller');

// Get the home page
router.get('/', authMiddleware, userController.home);

// Get the user
router.get('/me', authMiddleware, userController.me);

// Buy the item
router.put('/buy/:itemId', userController.buying);

// Get the user by the item id
router.get('/:itemId', userController.getUser);

// Update the money of the user
router.put('/money', userController.updateMoney);

module.exports = router;
