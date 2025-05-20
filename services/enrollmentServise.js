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
            price: req.body.price,
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
        const studentId = req.user._id;

        const enrollment = await enrollmentModel.findOne({
            studentId,
            paymentStatus: "paid"
        }).populate({
            path: 'courseId',
            populate: [
                { path: 'chapters' },
                { path: 'exams' }
            ]
        });

        // Always return a consistent response structure
        return res.status(200).json({
            success: true,
            isHeEnrolled: !!enrollment,
            enrollment: enrollment || null,
            message: enrollment ? "الطالب مشترك في هذا الكورس" : "الطالب غير مشترك بالكورس"
        });
    } catch (error) {
        console.error("Enrollment Check Error:", error);
        res.status(500).json({
            success: false,
            isHeEnrolled: false,
            enrollment: null,
            message: "حدث خطأ أثناء التحقق من الاشتراك"
        });
    }
};

exports.getAllUserErnollemnts = async (req, res) => {
    try {
        const studentId = req.user._id;
        const coursesAreEnrolled = await enrollmentModel.find({
            studentId,
            paymentStatus: "paid"
        }).populate('courseId');

        // Always return an array, even if empty
        return res.status(200).json({
            coursesAreEnrolled: coursesAreEnrolled || [],
            isHeEnrolled: coursesAreEnrolled && coursesAreEnrolled.length > 0
        });
    } catch (error) {
        console.error("Enrollment Check Error:", error);
        res.status(500).json({
            message: "حدث خطأ أثناء التحقق من الاشتراك",
            coursesAreEnrolled: [],
            isHeEnrolled: false
        });
    }
}

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        // Validate status
        if (!['paid', 'failed', 'pending'].includes(paymentStatus)) {
            return res.status(400).json({
                message: "حالة الدفع غير صالحة. يجب أن تكون 'paid' أو 'failed' أو 'pending'"
            });
        }

        // Find enrollment without updating it first
        const enrollment = await enrollmentModel.findById(id)
            .populate('courseId')
            .populate('studentId', 'email phoneNumber');

        if (!enrollment) {
            return res.status(404).json({ message: "لم يتم العثور على التسجيل" });
        }

        // Keep the existing price when updating
        const updatedEnrollment = await enrollmentModel.findByIdAndUpdate(
            id,
            {
                paymentStatus,
                price: enrollment.price || 0 // Ensure price is maintained
            },
            {
                new: true,
                runValidators: false // Skip validation since we're keeping existing data
            }
        ).populate('courseId')
            .populate('studentId', 'email phoneNumber');

        const formattedEnrollment = {
            _id: updatedEnrollment._id,
            userEmail: updatedEnrollment.studentId.email,
            phoneNumber: updatedEnrollment.studentId.phoneNumber,
            courseName: updatedEnrollment.courseId.name,
            courseId: updatedEnrollment.courseId._id,
            price: updatedEnrollment.price,
            paymentStatus: updatedEnrollment.paymentStatus,
            createdAt: updatedEnrollment.createdAt
        };

        res.status(200).json({
            success: true,
            message: "تم تحديث حالة الدفع بنجاح",
            enrollment: formattedEnrollment
        });
    } catch (error) {
        console.error("Payment Update Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء تحديث حالة الدفع",
            error: error.message
        });
    }
};

exports.getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await enrollmentModel.find()
            .populate('courseId')
            .populate('studentId', 'email phoneNumber')
            .sort({ createdAt: -1 });

        const formattedEnrollments = enrollments.map(enrollment => ({
            _id: enrollment._id,
            userEmail: enrollment.studentId?.email || 'N/A',
            phoneNumber: enrollment.phoneNumber,
            courseName: enrollment.courseId?.name || 'N/A', // Changed from nameofcourse to name
            courseId: enrollment.courseId?._id || null,
            price: enrollment.price,
            paymentStatus: enrollment.paymentStatus,
            createdAt: enrollment.createdAt
        }));

        res.status(200).json({
            success: true,
            enrollments: formattedEnrollments
        });
    } catch (error) {
        console.error("Get Enrollments Error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
    }
};