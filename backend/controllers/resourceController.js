const Resource = require('../models/Resource');

// @desc    Get all resources (with optional subject filtering)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { subject } = req.query;
    let query = {};
    
    if (subject) {
      query.subject = subject;
    }

    const resources = await Resource.find(query).populate('subject', 'title').populate('uploadedBy', 'name');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('subject', 'title')
      .populate('uploadedBy', 'name');
      
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
  try {
    const { title, description, type, url, subject } = req.body;

    if (!title || !description || !type || !url || !subject) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const resource = await Resource.create({
      title,
      description,
      type,
      url,
      subject,
      uploadedBy: req.user._id // Comes from authMiddleware
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource
};
