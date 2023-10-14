const express = require('express');
const auth = require('../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

router
    .route('/')
    // for getting all reviews
    .get(auth.protect, reviewController.getReviews)
    // post request for creating a new review (allowing user to place review only)
    .post(auth.protect, auth.restrictTo('user'), reviewController.createReview);

router
    .route('/:id')
    // updating review
    .patch(auth.protect, auth.restrictTo('user'), reviewController.updateReview)


module.exports = router;
