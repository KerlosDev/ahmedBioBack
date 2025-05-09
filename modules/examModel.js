const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  options: {
    a: { type: String, required: true },
    b: { type: String, required: true },
    c: { type: String, required: true },
    d: { type: String, required: true },
  },
  correctAnswer: {
    type: String,
    enum: ["a", "b", "c", "d"],
    required: true,
  },
  imageUrl: {
    type: String, // رابط الصورة من Imgur
    default: null,
  }
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // بالدقايق مثلاً
    required: true,
  },
  questions: [questionSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Exam", examSchema);
