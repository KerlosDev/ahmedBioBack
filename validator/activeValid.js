const { check, body } = require("express-validator");
const mongoose = require("mongoose");
const validatorMiddleware = require("../middleware/validMiddleware");
const Course = require("../modules/courseModule"); // تأكد من المسار الصحيح

exports.enrollmentValidation = [
  // تحقق من courseId
  check("courseId")
    .notEmpty().withMessage("courseId مطلوب.")
    .isLength({ min: 24, max: 24 }).withMessage("courseId لازم يكون ObjectId صحيح.")
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("courseId غير صالح.");
      }

      const courseExists = await Course.findById(value);
      if (!courseExists) {
        throw new Error("الكورس غير موجود.");
      }

      return true;
    }),

  // تحقق من رقم الهاتف
  check("phoneNumber")
    .notEmpty().withMessage("رقم الهاتف مطلوب.")
    .isMobilePhone('ar-EG').withMessage("رقم الهاتف غير صالح.")
    .matches(/^01[0125][0-9]{8}$/).withMessage("رقم الهاتف يجب أن يكون 11 رقم ويبدأ بكود مصري."),

  validatorMiddleware,
];
