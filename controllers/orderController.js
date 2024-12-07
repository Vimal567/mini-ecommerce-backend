const orderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');

exports.createOrder = async (req, res, next) => {

    const cartltems = req.body;
    const amount = Number(cartltems.reduce((acc, item) => {
        return acc + item.product.price * item.qty;
    }, 0)).toFixed(2);
    const status = 'pending';

    const order = await orderModel.create({cartltems, amount, status});

    //Update product stocks
    cartltems.forEach(async (item) => {
        const product = await ProductModel.findById(item.product._id);
        product.stock = product.stock - item.qty;
        await product.save();
    });

    res.json({
        sucess: true,
        order
    });
};
