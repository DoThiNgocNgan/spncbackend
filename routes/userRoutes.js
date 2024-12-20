// GET /api/users/students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('username xp assignments')
      .populate('assignments');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
}); 