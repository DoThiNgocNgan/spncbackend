// file: models/Lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;