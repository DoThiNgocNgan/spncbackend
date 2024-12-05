const mongoose = require('mongoose');

const studentResultsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    total_exercises: { type: Number },
    total_correct: { type: Number }
});

module.exports = mongoose.model('StudentResults', studentResultsSchema); 