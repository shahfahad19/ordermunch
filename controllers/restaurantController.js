const Restaurant = require('../models/restaurantModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const Item = require('../models/itemModel');
const mongoose = require('mongoose');
const Order = require('../models/orderModel');

exports.getAllRestaurants = catchAsync(async (req, res) => {
    const limit = req.query.limit || 30;

    const features = new APIFeatures(Restaurant.find(), req.query).filter().sort().limit().paginate();
    const restaurants = await features.query;

    const totalCount = await Restaurant.countDocuments();
    const pages = Math.ceil(totalCount / limit);
    res.status(200).json({
        status: 'success',
        pages,
        count: totalCount,
        results: restaurants.length,
        data: {
            restaurants,
        },
    });
});

exports.createRestaurant = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            restaurant,
        },
    });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return next(new AppError('Restaurant not found', 404));

    const orders = await Order.find({ 'items.item.restaurant': new mongoose.Types.ObjectId(restaurantId) });
    const items = await Item.find({ restaurant: new mongoose.Types.ObjectId(restaurantId) }).countDocuments();

    // Calculating sales and amount
    let totalSales = 0;
    let totalAmount = 0;

    orders.forEach((order) => {
        const itemOrder = order.items.find((item) => item.item.restaurant.equals(restaurantId));
        if (itemOrder) {
            const itemPrice = itemOrder.item.price;
            const itemCount = itemOrder.count;
            const orderSales = itemPrice * itemCount;
            totalSales += itemOrder.count;
            totalAmount += orderSales;
        }
    });

    res.status(200).json({
        status: 'success',
        data: {
            items: items,
            sales: totalSales,
            amount: totalAmount,
            restaurant,
        },
    });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return updated restaurant
        runValidators: true, // Run validators to check for schema validation
    });
    if (!updatedRestaurant) {
        return next(new AppError('Item not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            restaurant: updatedRestaurant,
        },
    });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
        return next(new AppError('Restaurant not found', 404));
    }

    await Item.deleteMany({ restaurant: new mongoose.Types.ObjectId(req.params.id) });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
