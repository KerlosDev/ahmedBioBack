const Chapter = require("../modules/chapterModel");

exports.createChapter = async (req, res) => {
  try {
    const { title, lessons } = req.body;

    // Basic validation (اختياري لو معندكش validation layer)
    if (!title || !Array.isArray(lessons) || lessons.length === 0) {
      return res.status(400).json({ message: "يجب إدخال عنوان الفصل ودروس بداخله." });
    }

    const chapter = await Chapter.create({ title, lessons });

    res.status(201).json({
      message: "تم إنشاء الفصل بنجاح.",
      chapter,
    });
  } catch (error) {
    console.error("خطأ أثناء إنشاء الفصل:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الفصل." });
  }
};
