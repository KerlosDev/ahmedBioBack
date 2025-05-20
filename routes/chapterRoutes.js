const express = require("express");
const router = express.Router();
const { 
  createChapter, 
  updateChapter, 
  deleteChapter,
  updateChapterLessons
} = require("../services/chaperServise");
const { isAdmin, protect } = require("../services/authService");

// Create new chapter
router.post("/", protect,isAdmin, createChapter);

// Update chapter
router.put("/:id",protect, isAdmin, updateChapter);

// Delete chapter
router.delete("/:id", protect, isAdmin, deleteChapter);

// Update chapter lessons
router.put("/:id/lessons",protect, isAdmin, updateChapterLessons);

module.exports = router;
