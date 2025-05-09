const User = require("../modules/userModule"); // تأكد من المسار
const expressAsyncHandler = require("express-async-handler");

const getUserByIdService = async (req, res) => {
    const studentId = req.user._id.toHexString();

    const user = await User.findById(studentId);
    if (!user) {
        throw new Error("المستخدم غير موجود.");
    }
    res.status(200).json(user);
};

const updateUserbyId = async (req, res) => {
    try {
      const { id } = req.user; // بنجيب الـ id من التوكن أو الريكوست
      const updateData = { ...req.body }; // انسخ البيانات
  
      // امنع تعديل البريد ورقم الهاتف
      delete updateData.email;
      delete updateData.parentPhoneNumber;
  
      console.log(id, updateData);
  
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
  

module.exports = {
    getUserByIdService: expressAsyncHandler(getUserByIdService),
    updateUserbyId: expressAsyncHandler(updateUserbyId),
};
