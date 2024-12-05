const express = require('express');
const cors = require('cors');
const app = express();

// Cấu hình CORS với options cụ thể hơn
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Cho phép cả localhost và 127.0.0.1
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Áp dụng CORS cho tất cả routes
app.use(cors(corsOptions));

// Thêm preflight handler
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

module.exports = app;