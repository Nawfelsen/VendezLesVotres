const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentification.middleware');
const indexController = require('../controllers/index.controller');

router.get('/', authMiddleware, indexController.home);

module.exports = router;
