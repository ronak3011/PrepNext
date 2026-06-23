const express = require('express');
const router = express.Router();
const { getResources, getResourceById, createResource, downloadResourceFile, rateResource, addComment, deleteComment, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getResources)
  .post(protect, createResource);

router.route('/:id')
  .get(getResourceById)
  .delete(protect, deleteResource);

router.route('/:id/download')
  .get(downloadResourceFile);

router.route('/:id/rate')
  .post(protect, rateResource);

router.route('/:id/comments')
  .post(protect, addComment);

router.route('/:id/comments/:commentId')
  .delete(protect, deleteComment);

module.exports = router;
