const Bookmark = require('../models/Bookmark');

// @desc    Get user's bookmarks
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'resource',
        populate: { path: 'subject' } // Populate subject inside resource
      });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a bookmark
// @route   POST /api/bookmarks
// @access  Private
const addBookmark = async (req, res) => {
  try {
    const { resourceId } = req.body;

    if (!resourceId) {
      return res.status(400).json({ message: 'Resource ID is required' });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({ user: req.user._id, resource: resourceId });
    if (existingBookmark) {
      return res.status(400).json({ message: 'Resource already bookmarked' });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      resource: resourceId
    });

    // Populate resource data before returning so frontend can display it immediately
    await bookmark.populate({
      path: 'resource',
      populate: { path: 'subject' }
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a bookmark
// @route   DELETE /api/bookmarks/:resourceId
// @access  Private
const removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ 
      user: req.user._id, 
      resource: req.params.resourceId 
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await bookmark.deleteOne();
    res.json({ message: 'Bookmark removed', id: req.params.resourceId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark
};
