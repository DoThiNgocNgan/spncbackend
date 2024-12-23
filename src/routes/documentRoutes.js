const express = require("express");
const router = express.Router();
const upload = require("../config/upload"); // Ensure this is correctly configured
const {
  uploadDocument,
  getDocumentById,
  getDocumentsByLesson,
  deleteDocument
} = require("../controllers/documentController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware"); // If you are using this, ensure it's applied where needed

// Route for uploading documents
router.post(
  "/upload/:lessonId",
  auth, // Ensure the user is authenticated
  upload.single("fileUpload"), // Ensure this matches the frontend field name
  uploadDocument // Call the controller function to handle the upload
);

// Route for getting a document by ID
router.get("/:documentId", getDocumentById);

// Route for getting documents by lesson
router.get("/lesson/:lessonId", getDocumentsByLesson);

// Thêm route xóa tài liệu
router.delete(
  "/:documentId",
  auth,
  role(['admin', 'teacher']),
  deleteDocument
);

module.exports = router;