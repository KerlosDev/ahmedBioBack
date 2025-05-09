const mongoose = require('mongoose');


const WatchHistorySchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId, // ID داخل مصفوفة lessons
        required: true
    },
    lessonTitle: {
        type: String // اختياري – لسهولة العرض بدون join
    },
    watchedCount: {
        type: Number,
        default: 1
    },
    lastWatchedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('WatchHistory', WatchHistorySchema);

