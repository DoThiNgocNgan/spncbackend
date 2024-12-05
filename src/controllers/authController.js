const User = require("../models/User"); 
const crypto = require("crypto");// Import model User
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Đăng ký người dùng
const register = async (req, res) => {
  const { fullname, email, password, role, token } = req.body;

  console.log(req.body);

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Kiểm tra token nếu là giáo viên
    if (role === "teacher") {
      if (!token || token !== process.env.TEACHER_TOKEN) {
        return res
          .status(400)
          .json({ message: "Invalid token for teacher registration" });
      }
    }

    // Tạo người dùng mới
    const newUser = new User({
      username: crypto.randomUUID(),
      fullname: fullname,
      email: email,
      password: hashedPassword,
      role: role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({ 
      token, 
      role: user.role,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, login };
