const Lesson = require('../models/Lesson');
const Document = require('../models/Document');
const Exercise = require('../models/Exercise');

const createLesson = async (req, res) => {
    try {
        const { course_id, title, content, description } = req.body;
        const newLesson = new Lesson({ 
            course_id, 
            title, 
            content,
            description: description || title // Nếu không có description thì dùng title
        });
        await newLesson.save();
        res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
    } catch (error) {
        console.error('Error creating lesson:', error); // Thêm log để debug
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: error.stack 
        });
    }
};

const getLessonsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const lessons = await Lesson.find({ course_id: courseId })
            .select('_id title content');
        
        // Fetch documents for each lesson
        const lessonsWithDocs = await Promise.all(lessons.map(async (lesson) => {
            const documents = await Document.find({ lesson_id: lesson._id })
                .select('_id filename');
            return {
                ...lesson.toObject(),
                documents
            };
        }));

        res.status(200).json(lessonsWithDocs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        
        const documents = await Document.find({ lesson_id: lesson._id })
            .select('_id filename');
            
        res.status(200).json({
            ...lesson.toObject(),
            documents
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { title, content } = req.body;

        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { 
                title, 
                content,
                updated_at: Date.now()
            },
            { new: true }
        );

        if (!updatedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.status(200).json({
            message: 'Lesson updated successfully',
            lesson: updatedLesson
        });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        
        // Xóa bài học
        const deletedLesson = await Lesson.findByIdAndDelete(lessonId);
        
        if (!deletedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Xóa các tài liệu liên quan
        await Document.deleteMany({ lesson_id: lessonId });
        
        // Xóa các bài tập liên quan
        await Exercise.deleteMany({ lesson_id: lessonId });

        res.status(200).json({ 
            message: 'Lesson and related content deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

module.exports = { createLesson, getLessonsByCourse, getLessonById, updateLesson, deleteLesson };