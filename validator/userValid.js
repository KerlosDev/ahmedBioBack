const { body } = require('express-validator');
const validaorMiddlewere = require('../middleware/validMiddleware');
const egyptGovernments = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة",
    "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية",
    "الوادي الجديد", "السويس", "أسوان", "أسيوط", "بني سويف", "بورسعيد",
    "دمياط", "الشرقية", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر",
    "قنا", "شمال سيناء", "سوهاج"
];

exports.validateSignUp = [
    body('name')
        .notEmpty().withMessage('الاسم مطلوب')
        .isLength({ min: 3 }).withMessage('الاسم يجب أن يكون 3 أحرف على الأقل'),

    body('phoneNumber')
        .notEmpty().withMessage('رقم الهاتف مطلوب')
        .matches(/^01[0125][0-9]{8}$/).withMessage('رقم الهاتف غير صحيح'),

    body('parentPhoneNumber')
        .notEmpty().withMessage('رقم هاتف ولي الأمر مطلوب')
        .matches(/^01[0125][0-9]{8}$/).withMessage('رقم الهاتف غير صحيح')
        .custom((value, { req }) => {
            if (value === req.body.phoneNumber) {
                throw new Error('رقم هاتف ولي الأمر يجب أن يكون مختلف عن رقم هاتف الطالب');
            }
            return true;
        }),

    body('email')
        .notEmpty().withMessage('البريد الإلكتروني مطلوب')
        .isEmail().withMessage('البريد الإلكتروني غير صالح'),

    body('password')
        .notEmpty().withMessage('كلمة المرور مطلوبة')
        .isLength({ min: 8 }).withMessage('كلمة السر يجب أن تكون 8 أحرف على الأقل')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .withMessage('كلمة المرور يجب أن تحتوي على أحرف وأرقام'),

    body('gender')
        .notEmpty().withMessage('النوع مطلوب')
        .isIn(['ذكر', 'انثي']).withMessage('النوع يجب أن يكون ذكر أو انثي'),

    body('level')
        .notEmpty().withMessage('المرحلة مطلوبة')
        .isIn(["الصف الثالث الثانوي", "الصف الثاني الثانوي", "الصف الأول الثانوي"])
        .withMessage('المرحلة غير صحيحة'),

    body('government')
        .notEmpty().withMessage('المحافظة مطلوبة')
        .isIn(egyptGovernments).withMessage('المحافظة غير مدرجة'),

    validaorMiddlewere
];

exports.validateSignIn = [
    body('email')
        .notEmpty().withMessage('البريد الإلكتروني مطلوب')
        .isEmail().withMessage('البريد الإلكتروني غير صالح'),

    body('password')
        .notEmpty().withMessage('كلمة المرور مطلوبة'),

    validaorMiddlewere
];
