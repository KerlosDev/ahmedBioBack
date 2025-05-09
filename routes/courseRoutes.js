const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { createCourseWithImage, getCourses, getCourseById } = require("../services/coursesService");

router.post("/create", upload.single("image"), async (req, res) => {
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


router.get("/",getCourses)
router.get("/:id", getCourseById)

module.exports = router;
