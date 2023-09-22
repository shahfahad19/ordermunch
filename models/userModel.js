const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name!'],
        validate: {
            validator: function (value) {
                return validator.matches(value, /^[a-zA-Z\s]+$/);
            },
            message: 'Invalid name. Only alphabets and spaces are allowed.',
        },
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: [true, 'User role must be defined'],
        default: 'user',
        lowercase: true,
    },
    address: {
        type: 'String',
    },

    contact: {
        type: 'String',
        validate: {
            validator: function (value) {
                return validator.matches(value, /^[0-9\s+-]+$/);
            },
            message: 'Invalid name. Only alphabets and spaces are allowed.',
        },
    },
    cart: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: [true, 'An order must have an item field.'],
            },
            count: {
                type: Number,
                required: [true, 'An order must specify the quantity of the item.'],
                min: [1, 'Quantity must be at least 1.'],
            },
        },
    ],
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
    passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    // if password isn't modified, return from this method
    if (!this.isModified('password') || this.isNew) return next();

    // if password changed, modify the passwordChangedAt field
    this.passwordChangedAt = Date.now() - 1000;

    next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    // Checking if user has changed password after a jwt token was generated
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
