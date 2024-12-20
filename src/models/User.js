const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
  xp: { type: Number, default: 0 },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentExercise' }]
});

// Kiểm tra xem mô hình đã tồn tại chưa
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;