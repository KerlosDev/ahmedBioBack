const express = require("express");
const router = express.Router();
const {
    createEnrollStudent,
    getEnrollById,
    getAllUserErnollemnts,
    getEnrlloments,
    updatePaymentStatus,
    getAllEnrollments,
    getAllActiveForUser
} = require("../services/enrollmentServise");
const { enrollmentValidation } = require("../validator/activeValid");
const { protect, isAdmin } = require("../services/authService");

// Routes ordered from most specific to least specific
router.get("/admin/enrollments", protect, isAdmin, getAllEnrollments);
router.put("/payment/:id", protect, isAdmin, updatePaymentStatus);
router.get("/:courseId", protect, getEnrollById); 
router.get("/allActiv/:userid", protect, getAllActiveForUser); 
router.get("/", protect, getAllUserErnollemnts);
router.post("/", protect, enrollmentValidation, createEnrollStudent);

module.exports = router;
