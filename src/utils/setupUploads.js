const fs = require('fs');
const path = require('path');

const setupUploadsDirectory = () => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const exercisesDir = path.join(uploadsDir, 'exercises');

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
        console.log('Created uploads directory');
    }

    if (!fs.existsSync(exercisesDir)) {
        fs.mkdirSync(exercisesDir);
        console.log('Created exercises directory');
    }
};

module.exports = setupUploadsDirectory; 