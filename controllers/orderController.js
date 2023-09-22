const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Item = require('../models/itemModel');
const mongoose = require('mongoose');

exports.getAllOrders = catchAsync(async (req, res) => {
    const limit = req.query.limit || 30;
    const features = new APIFeatures(Order.find(), req.query).filter().sort().limit().paginate();
    const orders = await features.query.populate('placed_by');

    const totalCount = await Order.countDocuments();
    const pages = Math.ceil(totalCount / limit);

    res.status(200).json({
        status: 'success',
        pages,
        count: totalCount,
        results: orders.length,
        data: {
            orders,
        },
    });
});

exports.createOrder = catchAsync(async (req, res, next) => {
    if (!req.body.item) {
        return next(new AppError('No items found', 400));
    }

    let itemsToOrder = [];

    // Handle single item order
    if (req.body.item.id) {
        const itemId = req.body.item.id;
        const itemCount = req.body.item.count || 1; // Default to 1 if count is not provided

        if (itemCount < 1) {
            return next(new AppError('Quantity must be at least 1', 400));
        }

        itemsToOrder.push({ id: itemId, count: itemCount });
    }

    // Handle multiple items order
    if (Array.isArray(req.body.item)) {
        itemsToOrder = req.body.item.map((item) => {
            const itemId = item.id;
            const itemCount = item.count || 1; // Default to 1 if count is not provided

            if (itemCount < 1) {
                return next(new AppError('Quantity must be at least 1', 400));
            }

            return { id: itemId, count: itemCount };
        });
    }

    if (itemsToOrder.length === 0) {
        return next(new AppError('No items found', 400));
    }

    // Check if all items exist in the database
    const itemIds = itemsToOrder.map((item) => item.id);
    const itemsList = await Item.find({ _id: { $in: itemIds } });

    // Verify that all items exist
    if (itemsList.length !== itemsToOrder.length) {
        return next(new AppError('One or more items do not exist', 400));
    }

    // Calculate the total number of items in the order
    const totalItems = itemsToOrder.reduce((total, item) => total + item.count, 0);

    // Calculate the total amount
    const totalAmount = itemsToOrder.reduce((total, item) => {
        const itemWithCount = itemsList.find((dbItem) => dbItem._id.equals(item.id));
        return total + itemWithCount.price * item.count;
    }, 0);

    // Prepare the order data
    const orderData = {
        amount: totalAmount,
        items_count: totalItems,
        items: itemsToOrder.map((item, index) => ({
            item: itemsList[index],
            count: item.count,
        })),
        placed_by: req.user._id,
    };

    // Create the order
    const order = await Order.create(orderData);

    res.status(201).json({
        status: 'success',
        data: {
            order,
        },
    });
});

exports.getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('placed_by');

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            order,
        },
    });
});

// updating an order by ID
exports.updateOrder = async (req, res, next) => {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return the updated order
        runValidators: true, // running validators to check for schema validation
    }).populate('placed_by');
    if (!updatedOrder) {
        return next(new AppError('Order not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            order: updatedOrder,
        },
    });
};

// deleting an order by ID
exports.deleteOrder = async (req, res, next) => {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
        return next(new AppError('Order not found', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
};

exports.getRestaurantOrders = catchAsync(async (req, res) => {
    const restaurantId = req.params.id;
    const limit = req.query.limit || 30;

    const features = new APIFeatures(
        Order.find({ 'items.item.restaurant': new mongoose.Types.ObjectId(restaurantId) }),
        req.query
    )
        .filter()
        .sort()
        .limit()
        .paginate();
    const orders = await features.query.populate('placed_by');

    // Calculating sales and amount
    let totalSales = 0;
    let totalSalesBalance = 0;

    orders.forEach((order) => {
        const itemOrder = order.items.find((item) => item.item.restaurant.equals(restaurantId));
        if (itemOrder) {
            const itemPrice = itemOrder.item.price;
            const itemCount = itemOrder.count;
            const orderSales = itemPrice * itemCount;
            totalSales += itemOrder.count;
            totalSalesBalance += orderSales;
        }
    });

    const totalCount = await Order.countDocuments({
        'items.item.restaurant': new mongoose.Types.ObjectId(restaurantId),
    });

    const pages = Math.ceil(totalCount / limit);

    res.status(200).json({
        status: 'success',
        pages,
        count: totalCount,
        results: orders.length,
        data: {
            total_sales: totalSales,
            sales_amount: totalSalesBalance,
            orders,
        },
    });
});

exports.getItemOrders = catchAsync(async (req, res) => {
    const itemId = req.params.id;
    const limit = req.query.limit || 30;

    const features = new APIFeatures(Order.find({ 'items.item._id': new mongoose.Types.ObjectId(itemId) }), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();
    const orders = await features.query.populate('placed_by');

    // Calculating sales and amount generated
    let totalSales = 0;
    let totalSalesBalance = 0;

    orders.forEach((order) => {
        const itemOrder = order.items.find((item) => item.item._id.equals(itemId));
        if (itemOrder) {
            const itemPrice = itemOrder.item.price;
            const itemCount = itemOrder.count;
            const orderSales = itemPrice * itemCount;
            totalSales += itemOrder.count;
            totalSalesBalance += orderSales;
        }
    });

    const totalCount = await Order.countDocuments({
        'items.item._id': new mongoose.Types.ObjectId(itemId),
    });

    const pages = Math.ceil(totalCount / limit);

    res.status(200).json({
        status: 'success',
        pages,
        count: totalCount,
        results: orders.length,
        data: {
            total_sales: totalSales,
            sales_amount: totalSalesBalance,
            orders,
        },
    });
});
