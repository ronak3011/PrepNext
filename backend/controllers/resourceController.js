const Resource = require('../models/Resource');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');

// @desc    Get all resources (with optional subject filtering)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { subject, search, sort } = req.query;
    let query = {};
    
    if (subject) {
      query.subject = subject;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Default sort: newest first
    let sortObj = { createdAt: -1 };
    
    // Handle sorting query
    if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    } else if (sort === 'highest_rated') {
      sortObj = { averageRating: -1 };
    } else if (sort === 'most_downloaded') {
      sortObj = { downloads: -1 };
    }

    const resources = await Resource.find(query).populate('subject', 'title').populate('uploadedBy', 'name').sort(sortObj);
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
      .populate('uploadedBy', 'name')
      .populate('comments.user', 'name');
      
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

// @desc    Increment resource downloads
// @route   PUT /api/resources/:id/download
// @access  Public
const incrementDownloads = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download a resource file (increments counter and proxies file)
// @route   GET /api/resources/:id/download
// @access  Public
const downloadResourceFile = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (!resource.url.includes('cloudinary.com')) {
      return res.redirect(resource.url);
    }

    const response = await fetch(resource.url);
    if (!response.ok) return res.redirect(resource.url);

    // Force the browser to download it as an attachment with the correct title and .pdf extension!
    const cleanTitle = resource.title.replace(/[^a-zA-Z0-9 \-]/g, '_') + '.pdf';
    res.setHeader('Content-Disposition', `attachment; filename="${cleanTitle}"`);
    res.setHeader('Content-Type', 'application/pdf');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate a resource
// @route   POST /api/resources/:id/rate
// @access  Private
const rateResource = async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user already rated
    const alreadyRatedIndex = resource.ratings.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyRatedIndex !== -1) {
      // Update existing rating
      resource.ratings[alreadyRatedIndex].rating = Number(rating);
    } else {
      // Add new rating
      resource.ratings.push({
        user: req.user._id,
        rating: Number(rating)
      });
      resource.totalRatings = resource.ratings.length;
    }

    // Recalculate average rating
    const totalScore = resource.ratings.reduce((acc, item) => item.rating + acc, 0);
    resource.averageRating = totalScore / resource.ratings.length;

    await resource.save();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a resource
// @route   POST /api/resources/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.comments.push({
      user: req.user._id,
      text: text.trim()
    });

    await resource.save();
    
    // We need to return the updated comments array, populated with user names
    const updatedResource = await Resource.findById(req.params.id)
      .populate('comments.user', 'name');
      
    res.status(201).json(updatedResource.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/resources/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    // Find comment
    const comment = resource.comments.find(c => c._id.toString() === req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Verify user owns comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this comment' });
    }

    // Remove comment
    resource.comments = resource.comments.filter(c => c._id.toString() !== req.params.commentId);
    await resource.save();

    // Return updated populated comments
    const updatedResource = await Resource.findById(req.params.id).populate('comments.user', 'name');
    res.json(updatedResource.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resource completely (including comments/ratings and bookmarks)
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Verify user owns the resource
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this material' });
    }

    // Delete all bookmarks referencing this resource to prevent orphans
    await Bookmark.deleteMany({ resource: req.params.id });

    // Delete the resource itself (this cascades and destroys embedded comments/ratings)
    await resource.deleteOne();

    res.json({ message: 'Material permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  downloadResourceFile,
  rateResource,
  addComment,
  deleteComment,
  deleteResource
};
