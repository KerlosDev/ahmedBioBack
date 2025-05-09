const express = require("express");
const router = express.Router();
const { createEnrollStudent, getEnrollById, getAllUserErnollemnts } = require("../services/enrollmentServise");
const { enrollmentValidation } = require("../validator/activeValid");
const { protect } = require("../services/authService");

// POST /api/enrollments
router.post("/", protect, enrollmentValidation, createEnrollStudent);
router.get("/:courseId", protect, getEnrollById);
router.get("/", protect, getAllUserErnollemnts);

module.exports = router;
