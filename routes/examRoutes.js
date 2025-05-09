const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { createExamWithImages, getAllExams, getExamById } = require("../services/examServise");

// ✅ Controller لإنشاء الامتحان
const createExam = async (req, res) => {
  try {
    const filesMap = {};
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        const index = file.fieldname.match(/questions\[(\d+)\]/)?.[1];
        if (index !== undefined) {
          filesMap[index] = file;
        }
      });
    }

    const exam = await createExamWithImages(req.body, filesMap);
    res.status(201).json({ message: "تم إنشاء الامتحان بنجاح", exam });
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({ message: error.message || "فشل إنشاء الامتحان" });
  }
};

// ✅ POST /api/exams
router.post("/", upload.any(), createExam);

// ✅ GET all exams
router.get("/", async (req, res) => {
  try {
    const exams = await getAllExams();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET exam by ID
router.get("/:id", async (req, res) => {
  try {
    const exam = await getExamById(req.params.id);
    res.json(exam);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
