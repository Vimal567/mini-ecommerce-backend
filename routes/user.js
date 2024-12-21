const express = require('express');
const { register, login, updateUser } = require('../controllers/userController');
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/updateUser').patch(updateUser);

module.exports = router;