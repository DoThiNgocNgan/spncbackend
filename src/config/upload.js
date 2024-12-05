const multer = require("multer");
const path = require("path");

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/`); // Thư mục lưu trữ
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Lấy phần mở rộng của tệp
    cb(null, `${req.user.username}-${file.originalname}`); // Đặt tên tệp
  },
});

const upload = multer({ storage: storage });

// Xuất hàm upload
module.exports = upload;
