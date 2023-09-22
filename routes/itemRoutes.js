const express = require('express');
const auth = require('../controllers/authController');
const itemController = require('./../controllers/itemController');

const router = express.Router();

router
    .route('/')
    // for getting all items
    .get(auth.protect, itemController.getAllItems)
    // post request for creating a new item (allowing user to place item only)
    .post(auth.protect, auth.restrictTo('admin'), itemController.createItem);

router
    .route('/:id')
    // getting item
    .get(auth.protect, itemController.getItem)
    // updating item
    .patch(auth.protect, auth.restrictTo('admin'), itemController.updateItem)
    // deleting item
    .delete(auth.protect, auth.restrictTo('admin'), itemController.deleteItem);

module.exports = router;
