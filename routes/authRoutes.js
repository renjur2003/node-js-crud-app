const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

// Register
router.get('/register', (req, res) => res.render('register', { title: 'Register' }));
router.post('/register', registerUser);

// Login
router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.post('/login', loginUser);

// Logout
router.get('/logout', logoutUser);

module.exports = router;
