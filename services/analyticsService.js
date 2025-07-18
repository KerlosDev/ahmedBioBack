const WatchHistory = require('../modules/WatchHistory');
const StudentExamResult = require('../modules/examResultSchema');
const User = require('../modules/userModule');
const Course = require('../modules/courseModule');
const Chapter = require('../modules/chapterModel');
const Enrollment = require('../modules/enrollmentModel'); // Assuming this is the correct path for Enrollment

exports.getStudentProgress = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.user._id;

        // Fetch watch history with populated references
        const watchHistory = await WatchHistory.find({ studentId })
            .populate({
                path: 'courseId',
                select: 'name description imageUrl level'
            })
            .populate({
                path: 'chapterId',
                select: 'title lessons'
            })
            .sort({ lastWatchedAt: -1 });

        // Fetch exam results
        const examResults = await StudentExamResult.findOne({ studentId })
            .populate('studentId', 'name email');

        // Group lessons by chapter
        const groupedLessons = {};
        watchHistory.forEach(entry => {
            if (!entry.chapterId) return;

            const chapterId = entry.chapterId._id;
            if (!groupedLessons[chapterId]) {
                groupedLessons[chapterId] = {
                    chapterInfo: entry.chapterId,
                    courseInfo: entry.courseId,
                    lessons: []
                };
            }

            // Check if lesson already exists
            const existingLesson = groupedLessons[chapterId].lessons.find(
                l => l.lessonId.toString() === entry.lessonId.toString()
            );

            if (!existingLesson) {
                groupedLessons[chapterId].lessons.push({
                    lessonId: entry.lessonId,
                    lessonTitle: entry.lessonTitle,
                    watchedCount: entry.watchedCount,
                    lastWatchedAt: entry.lastWatchedAt
                });
            }
        });

        // Calculate statistics
        const stats = {
            totalViews: watchHistory.reduce((sum, entry) => sum + entry.watchedCount, 0),
            uniqueLessons: new Set(watchHistory.map(entry => entry.lessonId)).size,
            lastActivity: watchHistory[0]?.lastWatchedAt || null,
            examStats: examResults ? {
                totalExams: examResults.results.length,
                averageScore: examResults.results.reduce((sum, exam) =>
                    sum + (exam.correctAnswers / exam.totalQuestions), 0) / examResults.results.length || 0,
                lastExamDate: examResults.results[examResults.results.length - 1]?.examDate
            } : null
        };

        res.status(200).json({
            success: true,
            data: {
                watchHistory,
                groupedLessons,
                examResults: examResults?.results || [],
                stats
            }
        });

    } catch (error) {
        console.error('Error fetching student progress:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب تقدم الطالب'
        });
    }
};

exports.getAllStudentsProgress = async (req, res) => {
    try {
        // Get all students who have watch history
        const studentsWithHistory = await WatchHistory.distinct('studentId');

        const studentsProgress = await Promise.all(studentsWithHistory.map(async (studentId) => {
            const student = await User.findById(studentId).select('name email lastActive');
            const watchHistory = await WatchHistory.find({ studentId })
                .populate('courseId', 'name')
                .populate('chapterId', 'title');
            const examResults = await StudentExamResult.findOne({ studentId });

            return {
                student,
                stats: {
                    totalViews: watchHistory.reduce((sum, entry) => sum + entry.watchedCount, 0),
                    uniqueLessons: new Set(watchHistory.map(entry => entry.lessonId)).size,
                    lastActivity: student.lastActive,
                    examsTaken: examResults?.results.length || 0,
                    averageScore: examResults ?
                        examResults.results.reduce((sum, exam) =>
                            sum + (exam.correctAnswers / exam.totalQuestions), 0) / examResults.results.length : 0
                }
            };
        }));

        res.status(200).json({
            success: true,
            data: studentsProgress
        });

    } catch (error) {
        console.error('Error fetching all students progress:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب تقدم الطلاب'
        });
    }
};

exports.getNewStudentsCount = async (days = 7) => {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const newStudents = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: date }
    });

    return newStudents;
};

exports.calculateTotalRevenue = async () => {
    const totalRevenue = await Enrollment.aggregate([
        {
            $match: { paymentStatus: 'paid' }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$price' }
            }
        }
    ]);

    return totalRevenue[0]?.total || 0;
};

exports.getPendingEnrollments = async () => {
    return await Enrollment.countDocuments({ paymentStatus: 'pending' });
};

exports.getStudentsAnalytics = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Get total counts
        const totalStudents = await User.countDocuments({ role: 'user' });
        const bannedStudents = await User.countDocuments({ role: 'user', isBanned: true });
        const activeStudents = await User.countDocuments({ role: 'user', isBanned: false });
        const lastWeekActive = await User.countDocuments({
            role: 'user',
            lastActive: { $gte: oneWeekAgo }
        });

        // Get government distribution
        const governmentDistribution = await User.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: '$government', value: { $sum: 1 } } },
            { $project: { id: '$_id', value: 1, _id: 0 } },
            { $sort: { value: -1 } }
        ]);

        // Get level distribution
        const levelDistribution = await User.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: '$level', value: { $sum: 1 } } },
            { $project: { id: '$_id', value: 1, _id: 0 } },
            { $sort: { value: -1 } }
        ]);

        return {
            totalStudents,
            activeStudents,
            bannedStudents,
            lastWeekActive,
            governmentDistribution,
            levelDistribution
        };
    } catch (error) {
        console.error('Error getting students analytics:', error);
        throw error;
    }
};