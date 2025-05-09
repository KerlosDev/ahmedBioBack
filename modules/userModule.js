const mongoose = require('mongoose');

const egyptGovernments = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", 
    "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", 
    "الوادي الجديد", "السويس", "أسوان", "أسيوط", "بني سويف", "بورسعيد", 
    "دمياط", "الشرقية", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", 
    "قنا", "شمال سيناء", "سوهاج"
];


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10,15}$/
    },
    parentPhoneNumber: {
        type: String,
        required: false,
        match: /^[0-9]{10,15}$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minlength: 6

    },
    gender: {
        type: String,
        required: true,
        enum: ['ذكر', 'انثي']
    },
    level: {
        type: String,
        required: true,
        enum: ["الصف الثالث الثانوي","الصف الثاني الثانوي", "الصف الأول الثانوي"]
    },
    government: {
        type: String,
        required: true,
        enum: egyptGovernments
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
