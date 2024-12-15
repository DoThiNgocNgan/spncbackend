const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['multiple_choice', 'coding'], required: true },
    points: { type: Number, required: true },
    pdfFile: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);
