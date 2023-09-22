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

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.end('API is running');
});

app.get('/api/overview', getOverView);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/items', itemRouter);
app.use('/api/orders', orderRouter);

app.use(globalErrorHandler);

module.exports = app;
