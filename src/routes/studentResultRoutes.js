const express = require('express');
const { updateStudentResult, getStudentResult } = require('../controllers/studentResultController');
const router = express.Router();

router.post('/', updateStudentResult);
router.get('/:user_id', getStudentResult);

module.exports = router; 