const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Offer name is required']
    }, docname: {
        type: String,
        required: [true, 'Doctor name is required']
    },
    courseLink: {
        type: String,
        required: [true, 'Course link is required']
    },
    pricebefore: {
        type: Number,
        required: [true, 'Original price is required']
    },
    priceafter: {
        type: Number,
        required: [true, 'Discounted price is required']
    },
    first: {
        type: String,
        required: [true, 'First feature is required']
    },
    second: {
        type: String,
        required: [true, 'Second feature is required']
    },
    third: {
        type: String,
        required: [true, 'Third feature is required']
    },
    fourth: {
        type: String,
        required: [true, 'Fourth feature is required']
    },
    fetures: {
        type: String,
        required: [true, 'Features list is required']
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