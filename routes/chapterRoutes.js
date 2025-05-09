const express = require("express");
const router = express.Router();
const { createChapter } = require("../services/chaperServise");

// POST /api/chapters
router.post("/", createChapter);
module.exports = router;
