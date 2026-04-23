const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getCurrentUser } = require('../Controllers/AuthController');
const { auth } = require('../Middleware/auth');

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/me', auth, getCurrentUser);

module.exports = router;

