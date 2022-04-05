const express = require('express');
const router = express.Router();

// import controller for index
const accessController = require('../controllers/access.controller');

// Get the login form
router.get('/login', accessController.loginForm);

// Login the user
router.post('/login', accessController.login);

// Get the register form
router.get('/register', accessController.registerForm);

// register the user
router.post('/register', accessController.register);

// Logout the user
router.get('/logout', accessController.logout);

module.exports = router;
