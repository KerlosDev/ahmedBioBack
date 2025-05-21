const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { createCourseWithImage, getCourses, getCourseById, updateCourse, deleteCourse, getAllCoursesForAdmin, getCourseByIdAdmin } = require("../services/coursesService");
const { isAdmin, protect } = require("../services/authService");

router.post("/create",protect, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const course = await createCourseWithImage(req.body, req.file || null);
    res.status(201).json({
      message: "تم إنشاء الكورس بنجاح",
      course,
    });
  } catch (error) {
    console.error("Course Creation Error:", error);
    res.status(500).json({ message: error.message || "فشل إنشاء الكورس." });
  }
});

router.put("/:id", protect, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const course = await updateCourse(req.params.id, req.body, req.file || null);
    res.status(200).json({
      message: "تم تحديث الكورس بنجاح",
      course,
    });
  } catch (error) {
    console.error("Course Update Error:", error);
    res.status(500).json({ message: error.message || "فشل تحديث الكورس." });
  }
});

router.delete("/:id",protect, isAdmin, async (req, res) => {
  try {
    await deleteCourse(req.params.id);
    res.status(200).json({ message: "تم حذف الكورس بنجاح" });
  } catch (error) {
    console.error("Course Deletion Error:", error);
    res.status(500).json({ message: error.message || "فشل حذف الكورس." });
  }
});

router.get("/", getCourses);
router.get("/allCourses", protect, isAdmin, getAllCoursesForAdmin);
router.get("/:id", getCourseById);
router.get("/admin/:id", getCourseByIdAdmin);

module.exports = router;
