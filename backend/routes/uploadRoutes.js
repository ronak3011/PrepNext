const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/upload
// @desc    Upload a PDF to Cloudinary
// @access  Private (Only logged in users can upload)

// We use 'upload.single("file")' because the frontend will send the PDF inside a field named "file"
router.post('/', protect, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Cloudinary automatically gives us the secure URL of the uploaded file
    res.status(200).json({
      message: 'File uploaded successfully',
      pdfUrl: req.file.path, 
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

module.exports = router;
