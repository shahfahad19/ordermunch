const express = require('express');
const app = express();
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');

// Overview
const { getOverView } = require('./controllers/overview');

// Routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const restaurantRouter = require('./routes/restaurantRoutes');
const itemRouter = require('./routes/itemRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const path = require('path');

app.use(cors());
app.use(express.json());

app.get('/api/overview', getOverView);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/items', itemRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);


// Serve static files from the "frontend/dist" directory
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// For any other route, send the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.use(globalErrorHandler);

module.exports = app;
