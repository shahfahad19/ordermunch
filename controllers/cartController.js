const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const Item = require('../models/itemModel');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');

exports.getCart = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({ path: 'cart.item', populate: 'restaurant' });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Filter out cart items with null item fields
    user.cart = user.cart.filter((cartItem) => cartItem.item !== null);

    // Calculate the total amount
    let amount = 0;

    user.cart.forEach((cartItem) => {
        if (cartItem.item) {
            amount += cartItem.item.price * cartItem.count;
        }
    });

    res.status(200).json({
        status: 'success',
        cart: user.cart,
        amount,
    });
});

exports.addItemToCart = catchAsync(async (req, res, next) => {
    // Extract the item ID and count from the request body
    const { item, count } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const itemExists = await Item.findById(item);

    if (!itemExists) return next(new AppError('Item not found', 404));

    // Check if the item is already in the cart
    const cartItem = user.cart.find((userCartItem) => userCartItem.item.toString() === item);

    if (cartItem) {
        // If the item is in the cart, update the count
        if (count) {
            cartItem.count += count;
        } else {
            // If count is not provided, increment the count by 1
            cartItem.count += 1;
        }
    } else {
        // If the item is not in the cart, add it with the provided count or 1 if count is not provided
        user.cart.push({
            item,
            count: count || 1,
        });
    }

    // Save the updated user document
    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(req.user._id).populate({ path: 'cart.item', populate: 'restaurant' });
    updatedUser.cart = updatedUser.cart.filter((cartItem) => cartItem.item !== null);

    let amount = 0;
    updatedUser.cart.forEach((cartItem) => {
        if (cartItem.item) {
            amount += cartItem.item.price * cartItem.count;
        }
    });

    res.status(200).json({
        status: 'success',
        cart: updatedUser.cart,
        amount,
    });
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
    // Extract the item ID and count from the request body
    const { item } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const itemExists = await Item.findById(item);

    if (!itemExists) return next(new AppError('Item not found', 404));

    // Check if the item is already in the cart
    const cartItemIndex = user.cart.findIndex((userCartItem) => userCartItem.item.toString() === item);

    if (cartItemIndex !== -1) {
        // If the item is in the cart, update the count
        if (user.cart[cartItemIndex].count > 1) {
            user.cart[cartItemIndex].count -= 1;
        } else {
            // If count is 1, remove the item from the cart
            user.cart.splice(cartItemIndex, 1);
        }

        // Save the updated user document
        await user.save({ validateBeforeSave: false });
    }

    const updatedUser = await User.findById(req.user._id).populate({ path: 'cart.item', populate: 'restaurant' });
    updatedUser.cart = updatedUser.cart.filter((cartItem) => cartItem.item !== null);

    let amount = 0;
    updatedUser.cart.forEach((cartItem) => {
        if (cartItem.item) {
            amount += cartItem.item.price * cartItem.count;
        }
    });

    res.status(200).json({
        status: 'success',
        cart: updatedUser.cart,
        amount,
    });
});

exports.deleteItemFromCart = catchAsync(async (req, res, next) => {
    // Extract the item ID and count from the request body
    const { item } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const itemExists = await Item.findById(item);

    if (!itemExists) return next(new AppError('Item not found', 404));

    // Check if the item is already in the cart
    const cartItemIndex = user.cart.findIndex((userCartItem) => userCartItem.item.toString() === item);

    if (cartItemIndex !== -1) {
        //remove the item from the cart
        user.cart.splice(cartItemIndex, 1);

        // Save the updated user document
        await user.save({ validateBeforeSave: false });
    }

    const updatedUser = await User.findById(req.user._id).populate({ path: 'cart.item', populate: 'restaurant' });
    updatedUser.cart = updatedUser.cart.filter((cartItem) => cartItem.item !== null);

    let amount = 0;
    updatedUser.cart.forEach((cartItem) => {
        if (cartItem.item) {
            amount += cartItem.item.price * cartItem.count;
        }
    });

    res.status(200).json({
        status: 'success',
        cart: updatedUser.cart,
        amount,
    });
});

exports.checkOutCart = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.phone === undefined || user.address === undefined)
        return next(new AppError('Update your contact details before placing order', 400));


    if (user.cart.length === 0) {
        return next(new AppError('No items found in cart', 400));
    }



    req.body.items = user.cart;

    // Extract item IDs and counts from the cart
    const cartItems = req.body.items;
    const itemIdsWithCounts = cartItems.map((cartItem) => ({
        id: new mongoose.Types.ObjectId(cartItem.item),
        count: cartItem.count || 1, // Default to 1 if count is not provided
    }));

    // Extract item IDs from the itemIdsWithCounts array
    const itemIds = itemIdsWithCounts.map((item) => item.id);

    // Check if all items exist in the database
    const existingItems = await Item.find({ _id: { $in: itemIds } });

    if (existingItems.length !== itemIds.length) {
        // Not all items exist in the database
        return next(new AppError('One or more items in the cart do not exist', 400));
    }

    // repalce item ids by item details
    let refactoredItems = user.cart;

    user.cart.forEach((item, index) => {
        refactoredItems[index].item = existingItems[index];
    });

    // set req.body.items to refactored items
    req.body.items = refactoredItems;

    // Calculate the total amount and total items
    const totalAmount = existingItems.reduce((total, item) => {
        const cartItem = itemIdsWithCounts.find((cartItem) => cartItem.id.equals(item._id));
        return total + item.price * cartItem.count;
    }, 0);

    const totalItems = cartItems.reduce((total, cartItem) => total + cartItem.count, 0);

    // Add the calculated total amount and total items to the request body
    req.body.amount = totalAmount;
    req.body.items_count = totalItems;

    // Add user id to placed_by field
    req.body.placed_by = req.user._id;

    // Create order
    const order = await Order.create(req.body);

    const newOrder = await Order.findById(order._id).populate({
        path: 'items.item', populate: {
            path: 'restaurant', model: 'Restaurant'
        }
    }).populate('placed_by');

    user.cart = [];
    await user.save({
        validateBeforeSave: false,
    });

    res.status(201).json({
        status: 'success',
        order: newOrder,
    });
});

exports.clearCart = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, { cart: [] }, { new: true });
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        cart: user.cart,
    });
});
