const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');
dotenv.config({path: path.join(__dirname, 'config', 'config.env')});
const port = process.env.PORT || 3000;

const orders = require('./routes/order');
const products = require('./routes/product');
const cart = require('./routes/cart');
const users = require('./routes/user');

connectDatabase();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use('/api', orders);
app.use('/api', products);
app.use('/api', cart);
app.use('/api', users);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});