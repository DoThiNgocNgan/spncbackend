// file: models/Course.js
require('dotenv').config()
const {connectDB} = require('../configs/db')
const Course = require('./Course')

// Dữ liệu mẫu cho 3 khóa học với hình ảnh
const sampleCourses = [
    { 
        title: 'Ngăn xếp và hàng đợi', 
        description: 'Khóa học về cấu trúc dữ liệu ngăn xếp và hàng đợi.',
        image: 'Stack_Queue.png'
    },
    { 
        title: 'Cây nhị phân', 
        description: 'Khóa học về cây nhị phân và các thuật toán liên quan.',
        image: 'binary_tree.png'
    },
    { 
        title: 'Lý thuyết đồ thị', 
        description: 'Khóa học về lý thuyết đồ thị và ứng dụng của nó.',
        image: 'grapth.png'
    }
];

(async () => {
    try {
        await connectDB();
        
        // Cập nhật từng khóa học thay vì xóa và tạo mới
        for (const courseData of sampleCourses) {
            await Course.findOneAndUpdate(
                { title: courseData.title }, // tìm theo title
                { $set: { image: courseData.image } }, // chỉ cập nhật trường image
                { new: true, upsert: true } // tạo mới nếu không tìm thấy
            );
        }
        
        console.log('Sample courses updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating courses:', error);
        process.exit(1);
    }
})();