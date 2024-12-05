const ExerciseTestcase = require('../models/ExerciseTestcase');

// Tạo testcase cho bài tập
const createTestcase = async (req, res) => {
    const { exercise_id, input, expected_output } = req.body;

    try {
        const newTestcase = new ExerciseTestcase({ exercise_id, input, expected_output });
        await newTestcase.save();
        res.status(201).json({ message: 'Testcase created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy testcase theo bài tập
const getTestcasesByExercise = async (req, res) => {
    const { exercise_id } = req.params;

    try {
        const testcases = await ExerciseTestcase.find({ exercise_id });
        res.status(200).json(testcases);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createTestcase, getTestcasesByExercise }; 