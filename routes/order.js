const express = require('express');
const { createOrder, getOrders } = require('../controllers/orderController');
const router = express.Router();

router.route('/order').get(getOrders);
router.route('/order').post(createOrder);


module.exports = router;