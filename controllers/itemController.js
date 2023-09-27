const Item = require('../models/itemModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');

exports.getAllItems = catchAsync(async (req, res) => {
    const limit = req.query.limit || 30;
    const features = new APIFeatures(Item.find(), req.query).filter().sort().limit().paginate();
    const items = await features.query.populate('restaurant');

    const totalCount = await Item.countDocuments();
    const pages = Math.ceil(totalCount / limit);

    res.status(200).json({
        status: 'success',
        pages,
        count: totalCount,
        results: items.length,
        items,
    });
});

exports.createItem = catchAsync(async (req, res, next) => {
    const item = await Item.create(req.body);
    res.status(201).json({
        status: 'success',
        item,
    });
});

exports.getItem = catchAsync(async (req, res, next) => {
    const itemId = req.params.id;
    const item = await Item.findById(itemId).populate('restaurant');
    if (!item) return next(new AppError('Item not found', 404));

    // getting all orders of this item
    const orders = await Order.find({ 'items.item._id': new mongoose.Types.ObjectId(itemId) });

    // Calculating sales and amount
    let totalSales = 0;
    let totalAmount = 0;

    orders.forEach((order) => {
        const itemOrder = order.items.find((item) => item.item._id.equals(itemId));
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
        sales: totalSales,
        amount: totalAmount,
        item,
    });
});

// updating an item by ID
exports.updateItem = catchAsync(async (req, res, next) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return updated item
        runValidators: true, // Run validators to check for schema validation
    });
    if (!item) {
        return next(new AppError('Item not found', 404));
    }
    res.status(200).json({
        status: 'success',
        item,
    });
});

// deleting an item by ID
exports.deleteItem = async (req, res, next) => {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
        return next(new AppError('Item not found', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
