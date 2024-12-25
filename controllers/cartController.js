const cartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

exports.getCart = async (req, res, next) => {
    const { account_id } = req.query;
    const cart = await cartModel.find({ accountId: account_id });
    res.json({
        success: true,
        data: cart
    });
}

exports.createCart = async (req, res, next) => {

    const { cart_items, account_id } = req.body;
    const amount = Number(cart_items.reduce((acc, item) => {
        return acc + item.product.price * item.qty;
    }, 0)).toFixed(2);
    const status = 'pending';

    let cartData = await cartModel.findOne({ accountId: account_id });

    if (!cartData) {
        cartData = await cartModel.create({ accountId: account_id, cartItems: cart_items, amount, status });
    } else {
        // If the cart exists, check if the product is already in the cart
        const existingItem = cartData.cartItems.find(item => item.product.id === cart_items[0].product.id);
        if (existingItem) {
            // If product already in cart no changes
            res.json({
                success: true,
                data: cartData
            });
            return;
        } else {
            // If product is not in cart, add it
            cartData.cartItems.push(...cart_items);
            cartData.amount += amount;
        }
        await cartData.save();
    }

    //Update product stocks
    const updateStockPromises = cart_items.map(async (item) => {
        const product = await ProductModel.findById(item.product._id);
        if (product) {
            product.stock = product.stock - item.qty;
            await product.save();
        }
    });

    await Promise.all(updateStockPromises);

    res.json({
        success: true,
        data: cartData
    });
};
