const express = require('express');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Route lấy danh sách học sinh
router.get('/students', authMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('_id fullname')
      .lean();

    const studentsWithSubmissions = await Promise.all(
      students.map(async (student) => {
        // Lấy danh sách unique exercise_id từ submissions
        const uniqueSubmissions = await Submission.distinct('exercise_id', {
          user_id: student._id,
          type: 'coding'
        });

        return {
          ...student,
          assignments: uniqueSubmissions.length // Số lượng bài tập unique đã nộp
        };
      })
    );
    
    console.log('Students with unique submissions:', studentsWithSubmissions);
    res.json(studentsWithSubmissions);
  } catch (error) {
    console.error('Error in /students route:', error);
    res.status(500).json({ 
      message: 'Error fetching students', 
      error: error.message 
    });
  }
});

module.exports = router; 