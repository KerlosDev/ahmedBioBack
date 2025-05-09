const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  examTitle: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  examDate: { type: Date, default: Date.now },
  attemptNumber: { type: Number, required: true }
});

const studentExamResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  results: [examResultSchema]
});

module.exports = mongoose.model('StudentExamResult', studentExamResultSchema);
