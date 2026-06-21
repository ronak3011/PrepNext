const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Public
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a subject (Utility endpoint for setting up mock data easily)
// @route   POST /api/subjects
// @access  Public (or Private ideally, but keeping open for internship project setup)
const createSubject = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const subjectExists = await Subject.findOne({ title });
    if (subjectExists) {
      return res.status(400).json({ message: 'Subject already exists' });
    }

    const subject = await Subject.create({ title, description });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject
};
