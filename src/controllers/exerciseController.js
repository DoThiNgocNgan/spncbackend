const Exercise = require('../models/Exercise');
const fs = require('fs').promises;
const path = require('path');

const createExercise = async (req, res) => {
    try {
        const { course_id, lesson_id, title, type, points } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        const generateCode = () => {
            return 'EX' + Math.random().toString(36).substr(2, 6).toUpperCase();
        };

        const exercise = new Exercise({
            course_id,
            lesson_id,
            title,
            type,
            points,
            pdfFile: `uploads/exercises/${req.file.filename}`,
            code: generateCode(),
            user_id: req.user._id
        });

        await exercise.save();
        res.status(201).json(exercise);
    } catch (error) {
        console.error('Error in createExercise:', error);
        res.status(500).json({ 
            message: 'Error creating exercise',
            error: error.message 
        });
    }
};

const getExercisesByCourse = async (req, res) => {
    try {
        const exercises = await Exercise.find({ course_id: req.params.courseId })
            .populate('user_id', 'username email')
            .populate('course_id', 'title')
            .populate('lesson_id', 'title');
        res.json(exercises);
    } catch (error) {
        console.error('Error in getExercisesByCourse:', error);
        res.status(500).json({ message: 'Error fetching exercises' });
    }
};

const getExercisesByLesson = async (req, res) => {
    try {
        console.log('Fetching exercises for lesson:', req.params.lessonId);
        const exercises = await Exercise.find({ 
            lesson_id: req.params.lessonId 
        }).populate('user_id', 'username email');
        
        console.log('Found exercises:', exercises);
        res.json(exercises);
    } catch (error) {
        console.error('Error in getExercisesByLesson:', error);
        res.status(500).json({ 
            message: 'Error fetching exercises',
            error: error.message 
        });
    }
};

const getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id)
            .populate('user_id', 'username email')
            .populate('course_id', 'title')
            .populate('lesson_id', 'title');

        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        res.json(exercise);
    } catch (error) {
        console.error('Error in getExerciseById:', error);
        res.status(500).json({ message: 'Error fetching exercise' });
    }
};

const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        // Delete PDF file if exists
        if (exercise.pdfFile) {
            const filePath = path.join(__dirname, '../../', exercise.pdfFile);
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Error deleting PDF file:', error);
            }
        }

        await exercise.remove();
        res.json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        console.error('Error in deleteExercise:', error);
        res.status(500).json({ message: 'Error deleting exercise' });
    }
};

module.exports = {
    createExercise,
    getExercisesByCourse,
    getExercisesByLesson,
    getExerciseById,
    deleteExercise
}; 