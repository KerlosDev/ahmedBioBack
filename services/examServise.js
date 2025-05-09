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

// ✅ جلب جميع الامتحانات
const getAllExams = async () => {
  try {
    const exams = await Exam.find().select("title duration createdAt");
    return exams;
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

module.exports = {
  uploadToImgur,
  createExamWithImages,
  getAllExams,
  getExamById
};
