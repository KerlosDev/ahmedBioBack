const Chapter = require("../modules/chapterModel");
const Course = require("../modules/courseModule");

exports.createChapter = async (req, res) => {
  try {
    const { title, lessons, courseId } = req.body;

    const chapter = await Chapter.create({ title, lessons: lessons || [] });
    
    // Add chapter to course
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, {
        $push: { chapters: chapter._id }
      });
    }

    res.status(201).json({
      message: "تم إنشاء الفصل بنجاح.",
      chapter,
    });
  } catch (error) {
    console.error("خطأ أثناء إنشاء الفصل:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الفصل." });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const { title, lessons } = req.body;
    const { id } = req.params;

    const chapter = await Chapter.findByIdAndUpdate(
      id,
      { title, lessons },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json({ message: "الفصل غير موجود." });
    }

    res.status(200).json({
      message: "تم تحديث الفصل بنجاح.",
      chapter,
    });
  } catch (error) {
    console.error("خطأ أثناء تحديث الفصل:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث الفصل." });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.body;

    const chapter = await Chapter.findByIdAndDelete(id);

    if (!chapter) {
      return res.status(404).json({ message: "الفصل غير موجود." });
    }

    // Remove chapter from course
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { chapters: id }
      });
    }

    res.status(200).json({
      message: "تم حذف الفصل بنجاح.",
      chapter,
    });
  } catch (error) {
    console.error("خطأ أثناء حذف الفصل:", error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الفصل." });
  }
};

exports.updateChapterLessons = async (req, res) => {
  try {
    const { id } = req.params;
    const { lessons } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      id,
      { lessons },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json({ message: "الفصل غير موجود." });
    }

    res.status(200).json({
      message: "تم تحديث دروس الفصل بنجاح.",
      chapter,
    });
  } catch (error) {
    console.error("خطأ أثناء تحديث دروس الفصل:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث دروس الفصل." });
  }
};
