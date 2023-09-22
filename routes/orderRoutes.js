const express = require('express');
const auth = require('../controllers/authController');
const orderController = require('./../controllers/orderController');

const router = express.Router();

router
    .route('/')
    // for getting all orders
    .get(auth.protect, orderController.getAllOrders)
    // post request for creating a new order (allowing user to place order only)
    .post(auth.protect, auth.restrictTo('user'), orderController.createOrder);

router
    .route('/:id')
    // getting order
    .get(auth.protect, orderController.getOrder)
    // updating order
    .patch(auth.protect, orderController.updateOrder)
    // deleting order
    .delete(auth.protect, auth.restrictTo('admin'), orderController.deleteOrder);

router.get('/restaurant/:id', orderController.getRestaurantOrders);
router.get('/item/:id', orderController.getItemOrders);

module.exports = router;
