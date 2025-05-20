const axios = require("axios");
const Course = require("../modules/courseModule");
const expressAsyncHandler = require("express-async-handler");

// ✅ رفع صورة إلى Imgur
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
    throw new Error("فشل رفع صورة الكورس إلى Imgur");
  }
};

// ✅ إنشاء كورس جديد
const createCourseWithImage = async (body, imageFile = null) => {
  let imageUrl = body.imageUrl || null;

  if (imageFile) {
    imageUrl = await uploadToImgur(imageFile.buffer);
  }

  const chapters = body.chapters ? JSON.parse(body.chapters) : [];
  const exams = body.exams ? JSON.parse(body.exams) : [];

  const course = await Course.create({
    name: body.name,
    description: body.description,
    imageUrl,
    price: body.isFree === "true" ? 0 : Number(body.price),
    isFree: body.isFree === "true",
    level: body.level,
    chapters,
    exams,
    isDraft: body.isDraft === "true" || body.isDraft === true // <-- Add this line
  });

  return course;
};

// ✅ جلب كل الكورسات أو كورس واحد
const getCourses = async (req, res) => {

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const courses = await Course.find().skip(skip).limit(parseInt(limit));
  res.status(200).json({
    results: courses.length,
    page: +page,
    courses,
  });


};

const getAllCoursesForAdmin = async (req, res) => {

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;


  const course = await Course.find().populate('chapters')
    .populate('exams');;
  console.log(course)
  if (!course) {
    return res.status(404).json({ message: "الكورس غير موجود." });
  }

  res.status(200).json(course);
};

// ✅ تحديث كورس
const updateCourse = async (courseId, body, imageFile = null) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("الكورس غير موجود");

  let imageUrl = course.imageUrl;

  if (imageFile) {
    imageUrl = await uploadToImgur(imageFile.buffer);
  }

  const chapters = body.chapters ? JSON.parse(body.chapters) : course.chapters;
  const exams = body.exams ? JSON.parse(body.exams) : course.exams;

  course.name = body.name || course.name;
  course.description = body.description || course.description;
  course.imageUrl = imageUrl;
  course.price = body.isFree === "true" ? 0 : Number(body.price);
  course.isFree = body.isFree === "true";
  course.level = body.level || course.level;
  course.chapters = chapters;
  course.exams = exams;
  if (typeof body.isDraft !== "undefined") {
    course.isDraft = body.isDraft === "true" || body.isDraft === true; // <-- Add this line
  }

  await course.save();

  return course;
};

// ✅ حذف كورس
const deleteCourse = async (courseId) => {
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) throw new Error("فشل حذف الكورس، الكورس غير موجود");
  return course;
};


const getCourseById = async (req, res) => {
  const { id } = req.params;
  

  const course = await Course.findById(id).populate({
      path: 'chapters',
      select: 'title', // only include the title field
    }).populate({
      path: 'exams',
      select: 'title', // only include the title field
    });

  console.log(course)
  if (!course) {
    return res.status(404).json({ message: "الكورس غير موجود." });
  }

  res.status(200).json(course);
};


module.exports = {
  uploadToImgur,
  createCourseWithImage: expressAsyncHandler(createCourseWithImage),
  getCourses: expressAsyncHandler(getCourses),
  updateCourse: expressAsyncHandler(updateCourse),
  getCourseById: expressAsyncHandler(getCourseById),
  deleteCourse: expressAsyncHandler(deleteCourse),
  getAllCoursesForAdmin: expressAsyncHandler(getAllCoursesForAdmin),
};
