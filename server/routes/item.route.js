const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authentification.middleware');

// import controller for item
const itemController = require('../controllers/item.controller');

// Get all the items of the user
router.get('/', authMiddleware, itemController.getMyItems);

// Get all the items of the other users
router.get('/others',authMiddleware, itemController.getOtherItems);

// Create an item
router.post('/create', authMiddleware, itemController.create);

// Get the item
router.get('/:itemId', itemController.getItem);

// remove item document
router.delete('/delete/:itemId', itemController.delete);

// export item route
module.exports = router;

