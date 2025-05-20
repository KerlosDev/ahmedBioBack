const Exam = require("../modules/examModel");
const axios = require("axios");

// ✅ رفع صورة واحدة إلى Imgur
const uploadToImgur = async (buffer) => {
  try {
    const clientId = process.env.IMGUR_CLIENT_ID || '0298d92f449079f';

    const response = await axios.post("https://api.imgur.com/3/image", buffer, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
        "Content-Type": "application/octet-stream",
      },
    });

    return response.data.data.link;
  } catch (error) {
    console.error("Imgur Upload Error:", error.response?.data || error.message);
    throw new Error("فشل رفع الصورة إلى Imgur");
  }
};

// ✅ إنشاء امتحان جديد مع رفع الصور (إن وجدت)
const createExamWithImages = async (body, filesMap = {}) => {
  const { title, duration } = body;

  let questions = [];
  try {
    questions = JSON.parse(body.questions);
  } catch (error) {
    throw new Error("صيغة الأسئلة غير صحيحة. يجب أن تكون JSON.");
  }

  const processedQuestions = await Promise.all(
    questions.map(async (q, index) => {
      let imageUrl = null;
      const file = filesMap[String(index)];

      if (file) {
        imageUrl = await uploadToImgur(file.buffer);
      }

      return {
        title: q.title,
        options: q.options,
        correctAnswer: q.correctAnswer,
        imageUrl,
      };
    })
  );

  const exam = await Exam.create({
    title,
    duration,
    questions: processedQuestions,
  });

  return exam;
};

// ✅ جلب جميع الامتحانات مع التصفح والبحث
const getAllExams = async (page = 1, limit = 10, searchTerm = '') => {
  try {
    const skip = (page - 1) * limit;

    // Create search query if searchTerm exists
    const searchQuery = searchTerm
      ? { title: { $regex: searchTerm, $options: 'i' } }
      : {};

    // Get total count for pagination
    const totalExams = await Exam.countDocuments(searchQuery);

    // Get paginated and filtered exams
    const exams = await Exam.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      exams,
      currentPage: page,
      totalPages: Math.ceil(totalExams / limit),
      totalExams
    };
  } catch (error) {
    console.error("Get Exams Error:", error.message);
    throw new Error("فشل في جلب الامتحانات");
  }
};

// ✅ جلب امتحان حسب الـ ID
const getExamById = async (examId) => {
  try {
    const exam = await Exam.findById(examId);
    if (!exam) throw new Error("الامتحان غير موجود");
    return exam;
  } catch (error) {
    console.error("Get Exam By ID Error:", error.message);
    throw new Error("فشل في جلب الامتحان");
  }
};

// ✅ حذف امتحان حسب الـ ID
const deleteExamById = async (examId) => {
  try {
    const exam = await Exam.findByIdAndDelete(examId);
    if (!exam) throw new Error("الامتحان غير موجود");
    return exam;
  } catch (error) {
    console.error("Delete Exam Error:", error.message);
    throw new Error("فشل في حذف الامتحان");
  }
};

// ✅ تحديث امتحان حسب الـ ID
const updateExamById = async (examId, examData, filesMap = {}) => {
  try {
    const { title, duration } = examData;
    let questions = [];

    try {
      questions = JSON.parse(examData.questions);
    } catch (error) {
      throw new Error("صيغة الأسئلة غير صحيحة. يجب أن تكون JSON.");
    }

    const processedQuestions = await Promise.all(
      questions.map(async (q, index) => {
        let imageUrl = q.imageUrl; // Keep existing image if no new one
        const file = filesMap[String(index)];

        if (file) {
          imageUrl = await uploadToImgur(file.buffer);
        }

        return {
          title: q.title,
          options: q.options,
          correctAnswer: q.correctAnswer,
          imageUrl,
        };
      })
    );

    const exam = await Exam.findByIdAndUpdate(
      examId,
      {
        title,
        duration,
        questions: processedQuestions,
      },
      { new: true }
    );

    if (!exam) throw new Error("الامتحان غير موجود");
    return exam;
  } catch (error) {
    console.error("Update Exam Error:", error.message);
    throw new Error("فشل في تحديث الامتحان");
  }
};

module.exports = {
  uploadToImgur,
  createExamWithImages,
  getAllExams,
  getExamById,
  deleteExamById,
  updateExamById
};
