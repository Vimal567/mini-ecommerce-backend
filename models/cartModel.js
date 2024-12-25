const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    accountId: String,
    cartItems: Array,
    amount: Number,
    status: String,
    createdAt: Date
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;