const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            item: {
                type: Object,
                required: [true, 'An order must have an item field.'],
            },
            count: {
                type: Number,
                required: [true, 'An order must specify the quantity of the item.'],
                min: [1, 'Quantity must be at least 1.'],
            },
        },
    ],
    items_count: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    placed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'An order must have a user id.'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Dispatched', 'Completed', 'Cancelled'],
        required: true,
        default: 'Pending',
    },
    amount: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        default: '',
    },
    rated: {
        type: Boolean,
        default: false,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
