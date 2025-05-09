const { body } = require('express-validator');
const validaorMiddlewere = require('../middleware/validMiddleware');
const egyptGovernments = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة",
    "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية",
    "الوادي الجديد", "السويس", "أسوان", "أسيوط", "بني سويف", "بورسعيد",
    "دمياط", "الشرقية", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر",
    "قنا", "شمال سيناء", "سوهاج"
];

exports.validateUser = [
    body('name').notEmpty().withMessage('الاسم مطلوب'),
    body('phoneNumber').matches(/^[0-9]{10,15}$/).withMessage('رقم الهاتف غير صحيح'),
    body('email').isEmail().withMessage('البريد الإلكتروني غير صالح'),
    body('password').isLength({ min: 6 }).withMessage('كلمة السر يجب أن تكون 6 أحرف على الأقل'),
    body('gender').isIn(['ذكر', 'انثي']).withMessage('النوع يجب أن يكون ذكر أو انثي'),
    body('level').isIn(["الصف الثالث الثانوي","الصف الثاني الثانوي", "الصف الأول الثانوي"]).withMessage('المرحلة غير صحيحة'),
    body('government').isIn(egyptGovernments).withMessage('المحافظة غير مدرجة'),
    validaorMiddlewere
];
