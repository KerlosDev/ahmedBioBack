const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Offer title is required']
    },
    subtitle: {
        type: String,
        required: [true, 'Offer subtitle is required']
    },
    description: {
        type: String,
        required: [true, 'Offer description is required']
    },
    originalPrice: {
        type: Number,
        required: [true, 'Original price is required']
    },
    discountPrice: {
        type: Number,
        required: [true, 'Discount price is required']
    },
    discountPercentage: {
        type: Number,
        required: [true, 'Discount percentage is required']
    },
    courses: {
        type: Number,
        required: [true, 'Number of courses is required']
    },
    students: {
        type: Number,
        required: [true, 'Number of students is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    features: [{
        type: String,
        required: [true, 'Features are required']
    }],
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    isLimited: {
        type: Boolean,
        default: false
    },
    spotsLeft: {
        type: Number,
        min: [0, 'Spots left cannot be negative']
    },
    section: {
        type: String,
        required: [true, 'Section is required'],
        enum: ['FIRST_SEC', 'SECOND_SEC', 'THIRD_SEC'],
        default: 'FIRST_SEC'
    },
    stage: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        default: 'DRAFT'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

offerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;