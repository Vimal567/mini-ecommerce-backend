const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    accountId: String,
    cartItems: Array,
    amount: Number,
    status: String,
    createdAt: Date
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;