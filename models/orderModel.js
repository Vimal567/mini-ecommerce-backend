const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    accountId: String,
    orderItems: Array
}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;