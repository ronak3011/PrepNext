const express = require('express');
const router = express.Router();
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBookmarks)
  .post(protect, addBookmark);

router.route('/:resourceId')
  .delete(protect, removeBookmark);

module.exports = router;
