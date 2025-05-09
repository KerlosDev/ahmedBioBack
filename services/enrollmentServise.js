const { default: mongoose } = require("mongoose");
const Enrollment = require("../modules/enrollmentModel");
const User = require("../modules/userModule");
const enrollmentModel = require("../modules/enrollmentModel");

exports.createEnrollStudent = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user._id.toHexString();

        console.log(studentId)


        // Check if already enrolled
        const alreadyEnrolled = await Enrollment.findOne({ studentId, courseId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "الطالب مشترك بالفعل في الكورس." });
        }

        const user = await User.findOne({ _id: studentId });
        if (!user) {
            return res.status(404).json({ message: "الطالب غير موجود." });
        }

        const phoneNumber = user.phoneNumber

        const enrollment = await Enrollment.create({
            studentId,
            courseId,
            phoneNumber,
            paymentStatus: "pending", // لو فيه بايمنت حقيقي هتغيره حسب اللوجيك
        });

        res.status(201).json({
            message: "تم الاشتراك بنجاح",
            enrollment,
        });
    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ message: "حصل خطأ أثناء الاشتراك" });
    }
};
exports.getEnrollById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id;

        const isHeEnrolled = await enrollmentModel.findOne({
            courseId,
            studentId,
            paymentStatus: "paid"
        });
        console.log(studentId)
        console.log(courseId)
        console.log(isHeEnrolled)
        if (!isHeEnrolled) {
            return res.json({
                message: "الطالب غير مشترك بالكورس",
                isHeEnrolled: false
            });
        }

        return res.status(200).json({
            message: "الطالب مشترك في هذا الكورس",
            isHeEnrolled: true
        });
    } catch (error) {
        console.error("Enrollment Check Error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء التحقق من الاشتراك" });
    }
};

exports.getAllUserErnollemnts = async (req, res) => {
    try {
        const studentId = req.user._id;
        const coursesAreEnrolled = await enrollmentModel.find({

            studentId,
            paymentStatus: "paid"
        }).populate('courseId');
        if (!coursesAreEnrolled) {
            return res.json({
                message: "الطالب غير مشترك باي كورسات",
                isHeEnrolled: false
            });
        }
        console.log(coursesAreEnrolled)

        return res.status(200).json({
            coursesAreEnrolled, isHeEnrolled: true
        });
    } catch (error) {
        console.error("Enrollment Check Error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء التحقق من الاشتراك" });
    }


}