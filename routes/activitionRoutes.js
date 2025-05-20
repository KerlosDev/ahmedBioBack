const express = require("express");
const router = express.Router();
const { 
    createEnrollStudent, 
    getEnrollById, 
    getAllUserErnollemnts, 
    getEnrlloments, 
    updatePaymentStatus,
    getAllEnrollments 
} = require("../services/enrollmentServise");
const { enrollmentValidation } = require("../validator/activeValid");
const { protect } = require("../services/authService");

// Routes ordered from most specific to least specific
router.get("/admin/enrollments", protect, getAllEnrollments);
router.put("/payment/:id", protect, updatePaymentStatus);
 router.get("/:courseId", protect, getEnrollById);
router.get("/", protect, getAllUserErnollemnts);
router.post("/", protect, enrollmentValidation, createEnrollStudent);

module.exports = router;
