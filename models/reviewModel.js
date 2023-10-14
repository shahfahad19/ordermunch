const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: [true, 'Review must have an item field.'],
        },
        review: {
            type: String,
            default: '',
        },
        stars: {
            type: Number,
            min: 1,
            max: 5,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: [true, 'Review must have an order field.'],
        },
        date: {
            type: Date,
            default: Date.now,
        },
        posted_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must have a user id.'],
        }
    },
    {
        toJSON: { virtuals: true },
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
