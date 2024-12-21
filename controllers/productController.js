const ProductModel = require('../models/productModel');

exports.getProducts = async (req, res, next) => {

    const query = req.query.name ? { name : { 
        $regex: req.query.name,
        $options: 'i'
    }} : {};

    const products = await ProductModel.find(query);

    res.json({
        sucess: true,
        data:  products
    });
};

exports.getSingleProduct = async (req, res, next) => {

    try {
        const product = await ProductModel.findById(req.params.id);
    
        res.json({
            sucess: true,
            data:  product
        });
    } catch (error) {
        res.status(404).json({
            sucess: false,
            message: 'Unable to get Product'
        });
    }

};
