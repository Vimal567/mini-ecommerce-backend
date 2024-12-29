const orderModel = require('../models/orderModel');

exports.getOrders = async (req, res, next) => {

    const { account_id } = req.query;

    const orders = await orderModel.find({ accountId: account_id });

    if (orders && orders.length) {
        res.json({
            success: true,
            data:  orders
        });
    } else {
        res.json({
            success: false,
            message:  "No orders placed"
        });
    }
};

exports.placeOrder = async (req, res, next) => {
    const { account_id, orderItems } = req.body;

    try {
        let existingOrder = await orderModel.findOne({ accountId: account_id });

        if (existingOrder) {
            // If an existing order is found, push new items to the existing order
            existingOrder.orderItems.push(...orderItems);
            
            const updatedOrder = await existingOrder.save();
            
            res.json({
                success: true,
                message: 'Order updated successfully!',
                data: updatedOrder
            });
        } else {
            // If no existing order, create a new order
            const newOrder = new orderModel({
                accountId: account_id,
                orderItems: orderItems
            });
            
            const savedOrder = await newOrder.save();
            
            res.json({
                success: true,
                message: 'New order placed successfully!',
                data: savedOrder  // Return the newly created order
            });
        }
    } catch (error) {
        // Error handling
        res.status(500).json({
            success: false,
            message: 'Error processing the order',
            error: error.message
        });
    }
};