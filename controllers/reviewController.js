const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
    const { item, review, stars, order } = req.body;

    // Check if the order is completed and not reviewed already
    const existingOrder = await Order.findById(order);

    if (!existingOrder) return next(new AppError('Order not found', 404));

    // Ensure that the item exists in the order
    const itemExistsInOrder = existingOrder.items.some((orderedItem) => orderedItem.item._id.toString() === item);

    if (!itemExistsInOrder) return next(new AppError('The specified item does not exist in the order.', 400))

    const existingReview = await Review.findOne({ order, item });
    if (existingReview) return next(new AppError("Item is already reviewed", 400));

    if (existingOrder.status !== 'Completed') return next(new AppError("Order not completed yet", 400));


    // Create the review
    const newReview = await Review.create({
        item,
        review,
        stars,
        order,
        posted_by: req.user._id,
    });

    // Mark the order as reviewed
    existingOrder.reviewed = true;

    await existingOrder.save();

    res.status(201).json({
        status: 'success',
        data: newReview,
    });
});


exports.getReviews = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Review.find(), req.query).filter().sort().limit().paginate();
    const reviews = await features.query.populate({ path: 'posted_by', select: 'name' }).populate('item');

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        reviews,
    });
});


// Update a review
exports.updateReview = catchAsync(async (req, res, next) => {
    const reviewId = req.params.id;
    const { review, stars } = req.body;

    // Find the review by ID
    const existingReview = await Review.findById(reviewId);

    if (!existingReview) return next(new AppError('Review not found', 404));

    // Ensure that the user updating the review is the same user who posted it
    if (existingReview.posted_by.toString() !== req.user._id.toString()) return next(new AppError('You are not authorized to update this review.', 400));

    // Update review content and star rating
    existingReview.review = review || existingReview.review;
    existingReview.stars = stars || existingReview.stars;

    await existingReview.save();

    res.status(200).json({
        status: 'success',
        data: existingReview,
    });
});
