const User = require("../modules/userModule");
const expressAsyncHandler = require("express-async-handler");

const getUserByIdService = async (req, res) => {
    const studentId = req.user._id.toHexString();

    const user = await User.findById(studentId);
    if (!user) {
        throw new Error("المستخدم غير موجود.");
    }
    res.status(200).json(user);
};

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            status: 'success',
            results: students.length,
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

module.exports = {
    getUserByIdService: expressAsyncHandler(getUserByIdService),
    updateUserbyId: expressAsyncHandler(updateUserbyId),
    getAllStudents: expressAsyncHandler(getAllStudents),
    toggleBanStatus: expressAsyncHandler(toggleBanStatus),
    updateLastActive: expressAsyncHandler(updateLastActive)
};
