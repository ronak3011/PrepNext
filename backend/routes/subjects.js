const express = require('express');
const router = express.Router();
const { getSubjects, getSubjectById, createSubject } = require('../controllers/subjectController');

router.route('/')
  .get(getSubjects)
  .post(createSubject);

router.route('/:id')
  .get(getSubjectById);

module.exports = router;
