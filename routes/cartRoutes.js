const express = require('express');
const auth = require('../controllers/authController');
const cartController = require('./../controllers/cartController');

const router = express.Router();

router.get('/', auth.protect, cartController.getCart);

router.patch('/add', auth.protect, cartController.addItemToCart);

router.patch('/remove', auth.protect, cartController.removeItemFromCart);

router.patch('/delete', auth.protect, cartController.deleteItemFromCart);

router.get('/checkout', auth.protect, cartController.checkOutCart);

router.delete('/clear', auth.protect, cartController.clearCart);

module.exports = router;
