const multer = require('multer');
const path = require('path');

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/exercises/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file PDF!'), false);
    }
};

// Tăng giới hạn kích thước file lên 10MB
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // Giới hạn 100MB
    }
});

// Middleware xử lý lỗi Multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File quá lớn. Kích thước tối đa là 10MB'
            });
        }
    }
    next(error);
};

module.exports = {
    upload,
    handleMulterError
}; 