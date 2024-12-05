const StudentResult = require('../models/StudentResult');

// Update student result
const updateStudentResult = async (req, res) => {
    const { user_id, total_exercises, total_correct } = req.body;

    try {
        const result = await StudentResult.findOneAndUpdate(
            { user_id },
            { total_exercises, total_correct },
            { new: true, upsert: true }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get student result
const getStudentResult = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await StudentResult.findOne({ user_id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { updateStudentResult, getStudentResult };