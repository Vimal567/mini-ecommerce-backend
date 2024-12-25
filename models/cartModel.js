const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    accountId: String,
    cartItems: Array,
    amount: Number,
    status: String,
    createdAt: Date
});

const cartModel = mongoose.model('Order', orderSchema);

module.exports = cartModel;