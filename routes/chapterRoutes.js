const express = require("express");
const router = express.Router();
const { 
  createChapter, 
  updateChapter, 
  deleteChapter,
  updateChapterLessons
} = require("../services/chaperServise");

// Create new chapter
router.post("/", createChapter);

// Update chapter
router.put("/:id", updateChapter);

// Delete chapter
router.delete("/:id", deleteChapter);

// Update chapter lessons
router.put("/:id/lessons", updateChapterLessons);

module.exports = router;
