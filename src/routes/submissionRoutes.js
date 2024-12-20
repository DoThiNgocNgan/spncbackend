const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { submitCode, getSubmissionHistory } = require('../controllers/submissionController');

// Route submit code
router.post('/code', authMiddleware, submitCode);

// Route lấy lịch sử submission
router.get('/history/:exercise_id', authMiddleware, getSubmissionHistory);

// Route lấy submissions của một học sinh
router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({
      user_id: req.params.studentId,
      type: 'coding'
    })
    .populate({
      path: 'exercise_id',
      select: 'title'
    })
    .sort({ createdAt: -1 });

    console.log('Found submissions:', submissions);
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ 
      message: 'Error fetching submissions', 
      error: error.message 
    });
  }
});

// Route cập nhật feedback
router.post('/feedback/:submissionId', authMiddleware, async (req, res) => {
  try {
    const { feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      { feedback },
      { new: true }
    );
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback', error: error.message });
  }
});

// Route lấy feedback của user
router.get('/feedback/:userId', authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      user_id: req.params.userId,
      feedback: { $exists: true, $ne: null }
    })
    .populate('exercise_id', 'title')
    .select('feedback createdAt exercise_id')
    .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Thêm route để lấy thông tin user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('fullname');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
});

module.exports = router;