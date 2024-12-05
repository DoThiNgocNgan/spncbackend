const mongoose = require('mongoose');

const exerciseTestcaseSchema = new mongoose.Schema({
    exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    input: { type: String, required: true },
    expected_output: { type: String, required: true }
});

module.exports = mongoose.model('ExerciseTestcase', exerciseTestcaseSchema);
