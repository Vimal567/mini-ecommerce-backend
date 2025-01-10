const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');

// Load environment variables from the .env file
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Set the port from environment variables or default to 3000
const port = process.env.PORT || 3000;

// Import routes
const orders = require('./routes/order');
const products = require('./routes/product');
const cart = require('./routes/cart');
const users = require('./routes/user');

// Connect to the database
connectDatabase();

// Configure CORS to allow requests from any origin
const corsOptions = {
    origin: '*',  // This allows requests from any domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Use the CORS middleware with the configured options
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the API routes
app.use('/api', orders);
app.use('/api', products);
app.use('/api', cart);
app.use('/api', users);

// Start the server
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
