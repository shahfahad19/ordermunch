const Item = require('../models/itemModel');
const Order = require('../models/orderModel');
const Restaurant = require('../models/restaurantModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverView = catchAsync(async (req, res) => {
    const restaurants = await Restaurant.find().countDocuments();

    const orders = await Order.find();
    const items = await Item.find().countDocuments();
    const customers = await User.find({ role: 'user' }).countDocuments();

    // Calculating sales and amount
    let totalSales = 0;
    let totalAmount = 0;

    orders.forEach((order) => {
        order.items.forEach((item) => {
            const itemPrice = item.item.price || 0;
            const itemCount = item.count;
            const orderSales = itemPrice * itemCount;
            totalSales += item.count;
            totalAmount += orderSales;
        });
    });

    res.status(200).json({
        status: 'success',
        data: {
            items: items,
            sales: totalSales,
            amount: totalAmount,
            restaurants,
            customers,
        },
    });
});
