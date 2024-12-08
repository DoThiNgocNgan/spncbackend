require("dotenv").config()
const express = require("express")
const cors = require("cors")
const {connectDB} = require("./src/configs/db")
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const lessonRoutes = require('./src/routes/lessonRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const exerciseRoutes = require('./src/routes/exerciseRoutes');
const exerciseTestcaseRoutes = require('./src/routes/exerciseTestcaseRoutes');
const studentExerciseRoutes = require('./src/routes/studentExerciseRoutes');
const studentResultRoutes = require('./src/routes/studentResultRoutes');
const User = require('./src/models/User'); // Import model User
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express()
app.use(cors())
app.use(express.json()); // Để parse JSON body

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exercise-testcases', exerciseTestcaseRoutes);
app.use('/api/student-exercises', studentExerciseRoutes);
app.use('/api/student-results', studentResultRoutes);

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsPath = path.join(__dirname, 'uploads');
const exercisesPath = path.join(uploadsPath, 'exercises');

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
    console.log('Created uploads directory');
}

if (!fs.existsSync(exercisesPath)) {
    fs.mkdirSync(exercisesPath);
    console.log('Created exercises directory');
}

// Serve static files với logging
app.use('/uploads', (req, res, next) => {
    console.log('Accessing uploads:', req.url); // Debug log
    express.static(path.join(__dirname, 'uploads'))(req, res, next);
});

// Specific route for exercises
app.use('/uploads/exercises', (req, res, next) => {
    console.log('Accessing exercises:', req.url); // Debug log
    express.static(path.join(__dirname, 'uploads/exercises'))(req, res, next);
});

const createAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL; // Đảm bảo bạn đã thiết lập biến môi trường này
    const adminPassword = process.env.ADMIN_PASSWORD; // Đảm bảo bạn đã thiết lập biến môi trường này

    if (!adminEmail || !adminPassword) {
        console.error('Admin email or password is not set in environment variables.');
        return;
    }

    try {
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = bcrypt.hashSync(adminPassword, 10);
            const newAdmin = new User({
                username: 'admin', // Thêm username cho admin
                fullname: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
            });

            await newAdmin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    }
};

const port = process.env.PORT || 5000
app.listen(port, async () => {
    await connectDB()
    await createAdminUser()
    console.log(`Server running on http://localhost:${port}`)
})