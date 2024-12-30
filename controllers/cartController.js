const cartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

exports.getCart = async (req, res, next) => {
    const { account_id } = req.query;
    const cart = await cartModel.find({ accountId: account_id });

    if (!cart || cart.length === 0) {
        return res.json({
            success: false,
            message: "Cart is empty"
        });
    }
    
    res.json({
        success: true,
        data: cart[0]
    });
}

exports.createCart = async (req, res, next) => {

    const { cart_item, account_id } = req.body;

    let cartData = await cartModel.findOne({ accountId: account_id });
    const product = await ProductModel.findById({ _id: cart_item.product.id });

    if (!cartData) {
        const amount = cart_item.product.price * cart_item.qty;
        product.stock = product.stock - cart_item.qty;
        if (product.stock < 0) {
            res.json({
                success: false,
                message: "Product stock not available"
            });
            return;
        }
        await product.save();
        cartData = await cartModel.create({ accountId: account_id, cartItems: cart_item, amount });
    } else {
        //Update product stocks
        // If the cart exists, check if the product is already in the cart
        const existingItem = cartData.cartItems.find(item => item.product.id === cart_item.product.id);
        if (!existingItem) {
            product.stock = product.stock - cart_item.qty;
        } else if (existingItem.qty < cart_item.qty) {
            product.stock = product.stock - cart_item.qty;
        } else {
            product.stock = product.stock + cart_item.qty;
        }
        // If stock is insufficient, return an error
        if (product.stock < 0) {
            res.json({
                success: false,
                message: "Product stock not available"
            });
            return;
        }
        await product.save();

        if (existingItem) {
            if (cart_item.qty === 0) {
                // If quantity is 0, remove the product
                cartData.cartItems = cartData.cartItems.filter(item => item.product.id !== cart_item.product.id);
            } else {
                // Update quantity for existing item
                existingItem.qty = cart_item.qty;
                cartData.cartItems = cartData.cartItems.map(item => {
                    if (item.product.id === cart_item.product.id) {
                        return existingItem;
                    } else {
                        return item;
                    }
                });
            }
        } else if (cart_item.qty > 0) {
            // If product doesn't exist in the cart and quantity is greater than 0, add it
            cartData.cartItems.push(cart_item);
        }

        // Recalculate the total amount
        cartData.amount = cartData.cartItems ? cartData.cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0).toFixed(2) : 0;
        cartData.markModified('cartItems');
        await cartData.save();
    }

    res.json({
        success: true,
        data: cartData
    });
};