const express = require('express');
const { register, login } = require('../controllers/userController');
const router = express.Router();

router.route('/login').get(login);
router.route('/register').post(register);

module.exports = router;