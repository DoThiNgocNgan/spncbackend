const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
