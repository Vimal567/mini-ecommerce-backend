const mongoose = require('mongoose');

const productSchema =  new mongoose.Schema({
    name: String,
    price: String,
    description: [String],
    ratings: String,
    images: [
        {
            image: String
        }
    ],
    category: String,
    seller: String,
    stock: Number,
    ratings: String
});

// Define the schema for an individual order item
const orderItemSchema = new mongoose.Schema({
    product: productSchema,
    qty: Number
}, { 
    timestamps: true,
    _id: false  // Disable _id generation for items in the array
});

// Define the schema for the order
const orderSchema = new mongoose.Schema({
    accountId: String,
    orderItems: [orderItemSchema]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;