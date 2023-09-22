const mongoose = require('mongoose');
const validator = require('validator');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name required'],
    },
    image: {
        type: String,
        required: [true, 'Item image required'],
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: [true, 'Item category required'],
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'An order must have an restaurant field.'],
    },
    price: {
        type: Number,
        required: [true, 'An order must have a price field.'],
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    rated_by: {
        type: Number,
        default: 0,
    },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
