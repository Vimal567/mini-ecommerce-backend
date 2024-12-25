const express = require('express');
const { createCart, getCart } = require('../controllers/cartController');
const router = express.Router();

router.route('/cart').get(getCart);
router.route('/cart').post(createCart);

module.exports = router;