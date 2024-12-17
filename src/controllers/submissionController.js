const Submission = require('../models/Submission');

const submitQuiz = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing'
      });
    }

    console.log('Request body:', req.body);

    const { exercise_id, answers, score } = req.body;
    
    if (!exercise_id || !answers || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const user_id = req.user._id;

    const submission = new Submission({
      exercise_id,
      user_id,
      answers,
      score,
      type: 'quiz'
    });

    await submission.save();
    
    res.status(201).json({
      success: true,
      message: 'Nộp bài thành công',
      submission
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi nộp bài',
      error: error.message
    });
  }
};

const submitCode = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing'
      });
    }

    const { exercise_id, code } = req.body;
    const user_id = req.user._id;
    
    if (!exercise_id || !code) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const submission = new Submission({
      exercise_id,
      user_id,
      code,
      type: 'coding'
    });

    await submission.save();
    
    res.status(201).json({
      success: true,
      message: 'Nộp bài thành công',
      submission
    });
  } catch (error) {
    console.error('Error submitting code:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi nộp bài',
      error: error.message
    });
  }
};

const getSubmissionHistory = async (req, res) => {
  try {
    const { exercise_id } = req.params;
    const user_id = req.user._id;

    const submissions = await Submission.find({
      exercise_id,
      user_id
    })
    .sort({ createdAt: -1 })
    .populate('exercise_id', 'title');

    res.status(200).json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error getting submission history:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử làm bài',
      error: error.message
    });
  }
};

module.exports = { submitQuiz, submitCode, getSubmissionHistory }; 