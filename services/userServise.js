const enrollmentModel = require("../modules/enrollmentModel");
const User = require("../modules/userModule");
const expressAsyncHandler = require("express-async-handler");
const WatchHistory = require("../modules/WatchHistory");

const getUserByIdService = async (req, res) => {
    const studentId = req.user._id.toHexString();

    const user = await User.findById(studentId);
    if (!user) {
        throw new Error("المستخدم غير موجود.");
    }
    res.status(200).json(user);
};

// Get all students with pagination and search
const getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        // Create search query
        const searchQuery = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
                { government: { $regex: search, $options: 'i' } },
                { level: { $regex: search, $options: 'i' } }
            ]
        } : {};

        // Get total count for pagination
        const total = await User.countDocuments(searchQuery);

        // Get students with pagination
        const students = await User.find(searchQuery)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: 'success',
            results: students.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'خطأ في استرجاع بيانات الطلاب'
        });
    }
};

// Toggle ban status
const toggleBanStatus = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { banReason } = req.body;

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({
                status: 'error',
                message: 'الطالب غير موجود'
            });
        }

        student.isBanned = !student.isBanned;
        student.banReason = student.isBanned ? banReason : null;
        student.status = student.isBanned ? 'inactive' : 'active';

        await student.save();

        res.status(200).json({
            status: 'success',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'خطأ في تحديث حالة الحظر'
        });
    }
};

const updateUserbyId = async (req, res) => {
    try {
        const { id } = req.user;
        const updateData = { ...req.body };

        // Prevent email and phone number updates
        delete updateData.email;
        delete updateData.parentPhoneNumber;

        // Update last active time
        updateData.lastActive = new Date();

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update last active time
const updateLastActive = async (req, res) => {
    try {
        const { id } = req.user;
        const updatedUser = await User.findByIdAndUpdate(id,
            { lastActive: new Date() },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating last active time" });
    }
};

// Get all data for a user by ID
const getUserAllDataById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user and exclude password
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'المستخدم غير موجود'
            });
        }

        // Get user's enrollments
        const enrollments = await enrollmentModel.find({ studentId: userId })
            .populate('courseId', 'name');

        // Get user's watch history
        const watchHistory = await  WatchHistory.find({ studentId: userId })
            .sort({ lastWatchedAt: -1 });

        res.status(200).json({
            status: 'success',
            data: {
                userInfo: user,
                enrollments: enrollments.map(enrollment => ({
                    courseName: enrollment.courseId ? enrollment.courseId.name : 'Unknown Course',
                    enrollmentDate: enrollment.createdAt,
                    paymentStatus: enrollment.paymentStatus
                })),
                activity: {
                    totalWatchedLessons: watchHistory.length,
                    lastActivity: watchHistory.length > 0 ? watchHistory[0].lastWatchedAt : null,
                    watchHistory
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'خطأ في استرجاع بيانات المستخدم'
        });
    }
};

module.exports = {
    getUserByIdService: expressAsyncHandler(getUserByIdService),
    updateUserbyId: expressAsyncHandler(updateUserbyId),
    getAllStudents: expressAsyncHandler(getAllStudents),
    toggleBanStatus: expressAsyncHandler(toggleBanStatus),
    updateLastActive: expressAsyncHandler(updateLastActive),
    getUserAllDataById: expressAsyncHandler(getUserAllDataById)
};
