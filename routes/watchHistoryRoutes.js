const WatchHistory = require('../modules/WatchHistory');
const {protect} = require('../services/authService')
const express = require('express')
const router = express.Router();


// ✅ [GET] سجل المستخدم الحالي
router.get('/my', protect, async (req, res) => {
    try {
        const studentId = req.user.id;

        const history = await WatchHistory.find({ studentId })
            .populate('courseId', 'name')
            .populate('chapterId', 'title')
            .sort({ lastWatchedAt: -1 });

        res.json({ success: true, data: history });
    } catch (err) {
        console.error('Error fetching user history:', err);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب السجل' });
    }
});


// ✅ [GET] سجل جميع المستخدمين (Admin)
router.get('/all', protect, async (req, res) => {
    try {
        // تحقق لو المستخدم عنده صلاحية Admin (لو حابب تضيفها لاحقًا)
    /*     if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'غير مصرح' });
        } */

        const allHistory = await WatchHistory.find()
            .populate('studentId', 'name email')
            .populate('courseId', 'name')
            .populate('chapterId', 'title')
            .sort({ lastWatchedAt: -1 });

        res.json({ success: true, data: allHistory });
    } catch (err) {
        console.error('Error fetching all history:', err);
        res.status(500).json({ success: false, message: 'حدث خطأ في السجل العام' });
    }
});


router.post('/', protect, async (req, res) => {
    const { courseId, chapterId, lessonId, lessonTitle } = req.body;
    const studentId = req.user._id;

    try {
        let history = await WatchHistory.findOne({ studentId, lessonId });

        if (history) {
            history.watchedCount += 1;
            history.lastWatchedAt = new Date();
            await history.save();
        } else {
            history = new WatchHistory({
                studentId,
                courseId,
                chapterId,
                lessonId,
                lessonTitle
            });
            await history.save();
        }

        res.status(200).json({ success: true, history });
    } catch (err) {
        console.error('Error saving watch history:', err);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء حفظ تاريخ المشاهدة' });
    }
});

module.exports = router;