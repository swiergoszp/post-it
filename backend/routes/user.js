// Express router set-up
const express = require('express');
const router = express.Router();

// Controller
const UserController = require('../controllers/user');

// Routing for Signup page
router.post('/signup', UserController.createUser);

// Routing for Login page
router.post('/login', UserController.getUser);

module.exports = router;
