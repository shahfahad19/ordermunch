const mongoose = require('mongoose');
const validator = require('validator');
const Item = require('./itemModel');

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Restaurant name required'],
            unique: true,
            validate: {
                validator: function (value) {
                    return validator.matches(value, /^[a-zA-Z\s.-/']+$/);
                },
                message: 'Invalid name. Only alphabets and spaces are allowed.',
            },
        },
        image: {
            type: String,
            required: [true, 'Restaurant image required'],
        },
        description: {
            type: String,
        },
    },
    {
        toJSON: { virtuals: true },
    }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
