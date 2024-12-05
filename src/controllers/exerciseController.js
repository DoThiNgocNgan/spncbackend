const Exercise = require('../models/Exercise');
const ExerciseTestcase = require('../models/ExerciseTestcase');

// Tạo bài tập
const createExercise = async (req, res) => {
    try {
        const { lesson_id, user_id, code, title, difficulty, points, type, testCases } = req.body;

        // Tạo bài tập
        const newExercise = new Exercise({
            lesson_id,
            user_id,
            code,
            title,
            difficulty,
            points,
            type
        });
        const savedExercise = await newExercise.save();

        // Nếu có test cases, tạo chúng
        if (testCases && Array.isArray(testCases)) {
            const testCasePromises = testCases.map(tc => {
                const newTestCase = new ExerciseTestcase({
                    exercise_id: savedExercise._id,
                    input: tc.input,
                    expected_output: tc.output
                });
                return newTestCase.save();
            });
            await Promise.all(testCasePromises);
        }

        res.status(201).json(savedExercise);
    } catch (error) {
        console.error('Error in createExercise:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: error.stack 
        });
    }
};

// Lấy danh sách bài tập theo bài học
const getExercisesByLesson = async (req, res) => {
    const { lesson_id } = req.params;
    try {
        const exercises = await Exercise.find({ lesson_id });
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa bài tập
const deleteExercise = async (req, res) => {
    const { exercise_id } = req.params;
    try {
        await Exercise.findByIdAndDelete(exercise_id);
        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật bài tập
const updateExercise = async (req, res) => {
    const { exercise_id } = req.params;
    const { title, difficulty, points, type } = req.body;
    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(exercise_id, { title, difficulty, points, type }, { new: true });
        res.status(200).json(updatedExercise);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createExercise, getExercisesByLesson, deleteExercise, updateExercise }; 