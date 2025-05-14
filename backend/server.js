const express = require('express');
const cors = require("cors");
const { startCronJobs } = require('./cronJobs');
require('mongoose');
const dotenv = require('dotenv');

// Définir le fuseau horaire de l'application
process.env.TZ = 'UTC';

//Routes
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

// Middleware
const {errorHandler} = require('./middleware/errorMiddleware');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//Connect to MongoDB
require('./config/db')();

//Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/reminders', reminderRoutes);

// Error handler
app.use(errorHandler);

//Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startCronJobs();
});

