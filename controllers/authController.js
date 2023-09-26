const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createSendToken = (user, statusCode, res) => {
    // create jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove password from output
    user.password = undefined;
    user.confirmationToken = undefined;

    // Send response
    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
};

// Function for signup
exports.signup = catchAsync(async (req, res, next) => {
    // if someone is trying to signup as admin, return an error
    if (req.body.role && req.body.role !== 'user') {
        return next(new AppError('You cannot signup with this role'));
    }

    // create user
    const user = await User.create(req.body);

    // save user
    await user.save({ validateBeforeSave: false });

    // send jwt token
    createSendToken(user, 201, res);
});

// Function for login
exports.login = catchAsync(async (req, res, next) => {
    // getting email and password from body
    const { email, password } = req.body;

    // checking if email and password both exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // check if user exist with this email
    const user = await User.findOne({ email }).select('+password');

    // if user doesn't exist or password don't match, return this error
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // if everything ok, send token to client
    createSendToken(user, 200, res);
});

// protecting routes so only logged in users access them
exports.protect = catchAsync(async (req, res, next) => {
    // checking token
    let token;

    // get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // if token doesn't exists, it means user isn't logged in
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user to whom this token belong exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // check if user has changed password after this token was generated
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// restricting routes to user role
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

// changing password
exports.updatePassword = catchAsync(async (req, res, next) => {
    // getting user
    const user = await User.findById(req.user.id).select('+password');

    // check if password entered is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // check if new password is entered correctly
    if (req.body.password !== req.body.passwordConfirm) {
        return next(new AppError('New passwords do not match.', 401));
    }

    // updated the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    // save user
    await user.save();

    // login and send token
    createSendToken(user, 200, res);
});
