const express = require('express');
const auth = require('../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.get('/', auth.protect, userController.getUser);
router.patch('/updateProfile', auth.protect, userController.updateMe);

router.get('/customers', auth.protect, auth.restrictTo('admin'), userController.getAllUsers);

router.get('/customers/:id', auth.protect, auth.restrictTo('admin'), userController.getCustomer);

module.exports = router;
