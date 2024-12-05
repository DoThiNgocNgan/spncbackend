const mongoose = require("mongoose");
const Document = require("../models/Document");
const path = require("path");

// Upload document
const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const lessonId = req.params.lessonId;
  const userId = req.user._id;

  // Validate lessonId
  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    return res.status(400).json({ message: "Invalid lesson ID" });
  }

  try {
    const newDocument = new Document({
      filename: req.file.filename,
      user_id: userId,
      lesson_id: lessonId,
    });

    await newDocument.save();
    res.status(201).json({
      message: "Document uploaded successfully",
      documentURL: `${req.protocol}://${req.get("host")}/api/documents/${
        newDocument._id
      }`,
    });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDocumentById = async (req, res) => {
  const { documentId } = req.params;
  const document = await Document.findById(documentId);
  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }
  const filePath = path.join(__dirname, "../../uploads", document.filename);
  res.sendFile(filePath);
};

// Lấy tài liệu theo bài học
const getDocumentsByLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const documents = await Document.find({ lesson_id: lessonId }); // Tìm tài liệu theo lesson_id
    res.status(200).json(documents); // Trả về danh sách tài liệu
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocumentById,
  getDocumentsByLesson // Xuất hàm này
};
