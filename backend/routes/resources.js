const express = require('express');
const router = express.Router();
const { getResources, getResourceById, createResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getResources)
  .post(protect, createResource);

router.route('/:id')
  .get(getResourceById);

module.exports = router;
