const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const FormData = require("form-data");
const fs = require('fs');
const axios = require("axios"); // Added axios import

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

// /api/upload
router.post("/", upload.single("image"), async (req, res) => { // Added async keyword
  try {
    if (!req.file) {
      // If no file is received in the request
      return res.status(400).json({ message: "No file uploaded" });
    }

    // If file upload is successful
    const form = new FormData();
    form.append('image', fs.createReadStream(req.file.path)); // Fixed the file path
    const PyResponse = await axios.post("http://127.0.0.1:8000/upload-image", form); // Corrected the URL
    // Send response
    res.status(200).json({ message: "Image uploaded", response: PyResponse.data });
  } catch (error) {
    // If an error occurs during the upload process
    console.error("Error uploading image:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
