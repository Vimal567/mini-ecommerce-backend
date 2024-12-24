const orderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');

exports.getOrders = async (req, res, next) => {
    const {account_id} = req.query;
    const orders = await orderModel.find({accountId: account_id});
    res.json({
        success: true,
        data: orders
    });
}

exports.createOrder = async (req, res, next) => {

    const { cart_items, account_id } = req.body;
    const amount = Number(cart_items.reduce((acc, item) => {
        return acc + item.product.price * item.qty;
    }, 0)).toFixed(2);
    const status = 'pending';

    const order = await orderModel.create({accountId: account_id, cartltems: cart_items, amount, status});

    //Update product stocks
    cart_items.forEach(async (item) => {
        const product = await ProductModel.findById(item.product._id);
        product.stock = product.stock - item.qty;
        await product.save();
    });

    res.json({
        success: true,
        data: order
    });
};
