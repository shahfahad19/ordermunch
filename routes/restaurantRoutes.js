const express = require('express');
const auth = require('../controllers/authController');
const restaurantController = require('./../controllers/restaurantController');

const router = express.Router();

router
    .route('/')
    // for getting all restaurants
    .get(auth.protect, restaurantController.getAllRestaurants)
    // post request for creating a new restaurant
    .post(auth.protect, auth.restrictTo('admin'), restaurantController.createRestaurant);

router
    .route('/:id')
    // getting restaurant
    .get(auth.protect, restaurantController.getRestaurant)
    // updating restaurant
    .patch(auth.protect, auth.restrictTo('admin'), restaurantController.updateRestaurant)
    // deleting restaurant
    .delete(auth.protect, auth.restrictTo('admin'), restaurantController.deleteRestaurant);

module.exports = router;
