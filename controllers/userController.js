const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const validator = require('validator');
const APIFeatures = require('./../utils/apiFeatures');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');

exports.getAllUsers = catchAsync(async (req, res) => {
    const limit = req.query.limit || 30;
    const features = new APIFeatures(User.find({ role: 'user' }), req.query).filter().sort().limit().paginate();
    const users = await features.query;

    const totalCount = await User.countDocuments({ role: 'user' });
    const pages = Math.ceil(totalCount / limit);

    res.status(200).json({
        status: 'success',
        count: totalCount,
        pages,
        results: users.length,
        data: {
            users,
        },
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates.', 400));
    }

    if (req.body.email) {
        if (!validator.isEmail(req.body.email)) return next(new AppError('Email is invalid'), 400);

        const existingUserWithEmail = await User.findOne({ email: req.body.email });
        if (existingUserWithEmail) return next(new AppError('Email is already in use'), 400);
    }

    // Removing fields
    delete req.body.role;

    // updating user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
    const customerId = req.params.id;
    const customer = await User.findById(customerId);
    if (!customer) return next(new AppError('Customer not found', 404));

    // getting all orders of this user
    const orders = await Order.find({ placed_by: new mongoose.Types.ObjectId(customerId) });

    // Calculating sales and amount
    let totalOrders = 0;
    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.amount;
        totalOrders += 1;
    });

    res.status(200).json({
        status: 'success',
        data: {
            orders: totalOrders,
            amount: totalAmount,
            customer,
        },
    });
});
