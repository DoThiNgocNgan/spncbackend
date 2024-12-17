const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    exercise_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: {
        type: Map,
        of: String
    },
    code: {
        type: String
    },
    score: {
        type: Number
    },
    type: {
        type: String,
        enum: ['quiz', 'coding'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);