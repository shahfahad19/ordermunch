const express = require('express');
const auth = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Account Controls
router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.patch('/updateProfile', auth.protect, userController.updateMe);
router.patch('/updatePassword', auth.protect, auth.updatePassword);

module.exports = router;
