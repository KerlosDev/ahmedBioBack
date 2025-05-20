const WatchHistory = require('../modules/WatchHistory');
const Enrollment = require('../modules/enrollmentModel');
const ExamResult = require('../modules/examResultSchema');

const getStudentStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get total completed exams and average score
        const studentExamResult = await ExamResult.findOne({ studentId: userId });
        const examResults = studentExamResult ? studentExamResult.results : [];
        const totalExams = examResults.length;
        console.log('Total Exams:', examResults);

        const averageScore = examResults.length > 0
            ? (examResults.reduce((acc, curr) => {
                const percentage = (curr.correctAnswers / curr.totalQuestions) * 100;
                return acc + percentage;
            }, 0) / totalExams).toFixed(1)
            : 0;

        // Get platform activity (based on watch history in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); const watchHistory = await WatchHistory.find({
            studentId: userId,
            lastWatchedAt: { $gte: thirtyDaysAgo }
        });

        // Calculate activity percentage based on regular watching
        // If user watched content in at least 20 of the last 30 days, they get 100%
        const uniqueDaysWatched = new Set(
            watchHistory.map(h => h.lastWatchedAt.toISOString().split('T')[0])
        ).size;
        const activityPercentage = Math.min((uniqueDaysWatched / 20) * 100, 100).toFixed(0);        // Get enrolled courses count
        const enrolledCourses = await Enrollment.find({
            studentId: userId,
            paymentStatus: "paid" // Only count paid enrollments
        });
        const totalEnrollments = enrolledCourses.length;

        res.status(200).json({
            stats: {
                platformActivity: activityPercentage + '%', // نشاطك على المنصة
                averageScore: averageScore + '%',           // متوسط النتائج
                completedExams: {                           // الاختبارات المكتملة
                    value: totalExams,
                    subText: `${totalExams} من ${totalExams + 3}` // Adding 3 pending exams
                },
                enrolledCourses: {                         // الكورسات المسجلة
                    value: totalEnrollments,
                    subText: 'إجمالي الكورسات'
                }
            }
        });
    } catch (error) {
        console.error('Error fetching student stats:', error);
        res.status(500).json({
            message: 'حدث خطأ أثناء جلب الإحصائيات',
            error: error.message
        });
    }
};

module.exports = {
    getStudentStats
};
