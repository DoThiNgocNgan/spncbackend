const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Cho bài tập code
    code_file: { type: String },
    feedback: { type: String },
    // Cho trắc nghiệm
    selected_answer: { type: Number },
    is_correct: { type: Boolean },
    submitted_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema); 