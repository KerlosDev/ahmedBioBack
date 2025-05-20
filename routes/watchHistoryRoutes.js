const WatchHistory = require('../modules/WatchHistory');
const { protect } = require('../services/authService')
const express = require('express')
const router = express.Router();


// ✅ [GET] سجل المستخدم الحالي
router.get('/my', protect, async (req, res) => {
    try {
        const studentId = req.user.id;

        console.log('User object:', req.user);
        console.log('Fetching history for student ID:', studentId);
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

// Add this new route for getting watch history by student ID
router.get('/student/:studentId', protect, async (req, res) => {
    try {
        const { studentId } = req.params;

        const history = await WatchHistory.find({ studentId })
            .populate('courseId', 'name')
            .populate('chapterId', 'title')
            .sort({ lastWatchedAt: -1 });

        res.json({ success: true, data: history });
    } catch (err) {
        console.error('Error fetching student history:', err);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب سجل المشاهدة'
        });
    }
});

module.exports = router;