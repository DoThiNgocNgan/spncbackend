const mongoose = require('mongoose');

const studentResultSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    total_exercises: { type: Number, default: 0 },
    total_correct: { type: Number, default: 0 }
});

module.exports = mongoose.model('StudentResult', studentResultSchema); 