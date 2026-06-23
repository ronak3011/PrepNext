const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractPdfText, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer to store uploaded files entirely in memory (RAM)
// This is perfect because we just want to extract the text and then throw the file away,
// instead of saving it to the server's hard drive and cluttering it.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to extract text from an uploaded PDF
router.post('/extract-pdf', protect, upload.single('file'), extractPdfText);

// Route to send a message to the AI
router.post('/message', protect, sendMessage);

module.exports = router;
