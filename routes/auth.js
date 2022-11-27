const express = require('express');

const router = express.Router();

const { login, register } = require('../controllers/auth');

// register
router.post('/register', register);

// login
router.post('/login', login);

module.exports = router;
