const express = require('express');
const { getOrders, placeOrder } = require('../controllers/orderController');
const router = express.Router();

router.route('/order').get(getOrders);
router.route('/order').post(placeOrder);

module.exports = router;