const Exercise = require('../models/Exercise');
const fs = require('fs').promises;
const path = require('path');

const createExercise = async (req, res) => {
    try {
        const {
            course_id,
            lesson_id,
            code,
            title,
            type,
            points,
        } = req.body;

        const user_id = req.user._id;

        // Validate required fields
        if (!course_id || !lesson_id || !code || !title || !type || !points) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        let pdfFilePath = null;
        if (req.file) {
            pdfFilePath = `/uploads/exercises/${req.file.filename}`;
            console.log('PDF file path:', pdfFilePath);
        }

        const exercise = new Exercise({
            course_id,
            lesson_id,
            user_id,
            code,
            title,
            type,
            points,
            pdfFile: pdfFilePath,
        });

        await exercise.save();
        console.log('Saved exercise:', exercise);
        res.status(201).json(exercise);
    } catch (error) {
        console.error('Error creating exercise:', error);
        res.status(500).json({ message: 'Error creating exercise' });
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