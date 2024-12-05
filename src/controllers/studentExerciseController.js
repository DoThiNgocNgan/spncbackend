const StudentExercise = require('../models/StudentExercise');

// Nộp bài tập
const submitExercise = async (req, res) => {
    const { user_id, exercise_id, content } = req.body;
    const newSubmission = new StudentExercise({ user_id, exercise_id, content });
    try {
        await newSubmission.save();
        res.status(201).json({ message: 'Exercise submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xem kết quả làm bài tập
const getStudentExercises = async (req, res) => {
    const { user_id } = req.params;
    try {
        const submissions = await StudentExercise.find({ user_id });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { submitExercise, getStudentExercises }; 