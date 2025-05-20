const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const User = require('../modules/userModule');

exports.signUp = expressAsyncHandler(async (req, res) => {
    const { name, phoneNumber, parentPhoneNumber, email, password, gender, level, government } = req.body;

    console.log('📥 Received signup request with data:', req.body);

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userExists) {
        console.log('⚠️ User already exists with email or phone:', email, phoneNumber);
        return res.status(400).json({ message: 'المستخدم موجود بالفعل' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed successfully');

    const newUser = new User({
        name,
        phoneNumber,
        parentPhoneNumber,
        email,
        password: hashedPassword,
        gender,
        level,
        government
    });

    await newUser.save();
    console.log('✅ New user saved to database:', newUser._id);

    // Generate JWT token
    const token = jwt.sign(
        { 
            id: newUser._id,
            role: newUser.role 
        },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: '7d' }
    );

    console.log('🎟️ JWT Token generated:', token);

    res.status(201).json({
        message: 'تم إنشاء الحساب بنجاح',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role
        },
        token
    });
});

exports.signIn = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

 
    // ابحث عن المستخدم بالإيميل أو رقم الهاتف
    const user = await User.findOne({ email });

    if (!user) { 
        return res.status(400).json({ message: 'البريد الإلكتروني أو رقم الهاتف غير صحيح' });
    }

    // تحقق من الباسورد
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
         return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
    }

    // توليد التوكن
    const token = jwt.sign(
        { 
            id: user._id,
            role: user.role 
        },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: '7d' }
    );

 
    res.status(200).json({
        message: 'تم تسجيل الدخول بنجاح',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
        },
        token
    });
});



exports.protect = expressAsyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
 
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = {
            ...user.toObject(),
            role: user.role
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized or token failed" });
    }
});

exports.isAllow = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "No user info available" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }

        next();
    };
};

exports.isAdmin = exports.isAllow('admin');
