const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    points: { type: Number, required: true },
    type: { type: String, required: true },
    total_answers: { type: Number, default: 0 },
    correct_answers: { type: Number, default: 0 }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
