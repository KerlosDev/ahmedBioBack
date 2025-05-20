const express = require("express");
const router = express.Router();
const { 
  createChapter, 
  updateChapter, 
  deleteChapter,
  updateChapterLessons
} = require("../services/chaperServise");
const { isAdmin } = require("../services/authService");

// Create new chapter
router.post("/", isAdmin, createChapter);

// Update chapter
router.put("/:id", isAdmin, updateChapter);

// Delete chapter
router.delete("/:id", isAdmin, deleteChapter);

// Update chapter lessons
router.put("/:id/lessons", isAdmin, updateChapterLessons);

module.exports = router;
