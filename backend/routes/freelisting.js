const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upload = require("../modules/Freelisting")

const router = express.Router();

// File upload setup
const uploadDir = path.join(__dirname, "../freelisting");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Ensure uploads directory exists
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Freelisting API - Handles file upload and other form data
router.post("/", upload.array("files"), async (req, res) => {
  try {
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("Please upload one or more files");
    }

    // Process uploaded files
    const filesArray = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
      contentType: file.mimetype,
    }));

    // Create a new Upload document
    const newUpload = new Upload({
      files: filesArray,
      businessname: req.body.businessname,
      description: req.body.description,
      firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      email: req.body.email,
      number: req.body.number,
      location: req.body.location,
      pincode: req.body.pincode,
    });

    // Save the upload details to the database
    await newUpload.save();

    // Send success response
    res.send("Files uploaded successfully and data saved.");
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).send("Failed to upload files and save data.");
  }
});

module.exports = router;
