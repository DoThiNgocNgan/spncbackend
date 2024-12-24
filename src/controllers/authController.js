const User = require("../models/User"); 
const crypto = require("crypto");// Import model User
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require('nodemailer');

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Thêm hàm kiểm tra kết nối
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
  } catch (error) {
    console.error('Email service error:', error);
  }
};

// Gọi hàm kiểm tra khi khởi động server
verifyEmailConfig();

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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    // Tạo token reset password
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token hết hạn sau 1 giờ
    await user.save();

    // Tạo link reset password
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Gửi email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: `
        <h1>Yêu cầu đặt lại mật khẩu</h1>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetLink}">Đặt lại mật khẩu</a>
        <p>Link này sẽ hết hạn sau 1 giờ.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email đặt lại mật khẩu đã được gửi' });

  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Cập nhật mật khẩu và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Mật khẩu đã được đặt lại thành công' });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
