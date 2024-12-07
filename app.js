const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');
dotenv.config({path: path.join(__dirname, 'config', 'config.env')});
const port = process.env.PORT || 3000;

const products = require('./routes/product');
const orders = require('./routes/order');
const users = require('./routes/user');

connectDatabase();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use('/api', products);
app.use('/api', orders);
app.use('/api', users);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});