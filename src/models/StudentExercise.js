const mongoose = require('mongoose');

const studentExerciseSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    submission_date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    score: { type: Number },
    correct_testcases: { type: Number },
    total_testcases: { type: Number }
});

module.exports = mongoose.model('StudentExercise', studentExerciseSchema);
