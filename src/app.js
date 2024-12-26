const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Cấu hình CORS với options cụ thể hơn
const corsOptions = {
    origin: 'http://34.142.187.24:5173', // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Áp dụng CORS cho tất cả routes
app.use(cors(corsOptions));

// Thêm preflight handler
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files từ thư mục public
app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Thêm headers cho phép truy cập PDF
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, '../uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

module.exports = app;
