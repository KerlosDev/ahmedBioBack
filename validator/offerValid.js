const { check } = require('express-validator');

exports.createOfferValidator = [
    check('courseLink')
        .notEmpty()
        .withMessage('Course link is required')
        .isURL()
        .withMessage('Please provide a valid URL'),

    check('name')
        .notEmpty()
        .withMessage('Offer name is required')
        .isString()
        .withMessage('Offer name must be a string'),

    check('docname')
        .notEmpty()
        .withMessage('Doctor name is required')
        .isString()
        .withMessage('Doctor name must be a string'),

    check('pricebefore')
        .notEmpty()
        .withMessage('Original price is required')
        .isNumeric()
        .withMessage('Original price must be a number')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('Original price must be greater than 0');
            }
            return true;
        }),

    check('priceafter')
        .notEmpty()
        .withMessage('Discounted price is required')
        .isNumeric()
        .withMessage('Discounted price must be a number')
        .custom((value, { req }) => {
            if (value <= 0) {
                throw new Error('Discounted price must be greater than 0');
            }
            if (value >= req.body.pricebefore) {
                throw new Error('Discounted price must be less than original price');
            }
            return true;
        }),

    check('first')
        .notEmpty()
        .withMessage('First feature is required')
        .isString()
        .withMessage('First feature must be a string'),

    check('second')
        .notEmpty()
        .withMessage('Second feature is required')
        .isString()
        .withMessage('Second feature must be a string'),

    check('third')
        .notEmpty()
        .withMessage('Third feature is required')
        .isString()
        .withMessage('Third feature must be a string'),

    check('fourth')
        .notEmpty()
        .withMessage('Fourth feature is required')
        .isString()
        .withMessage('Fourth feature must be a string'),

    check('fetures')
        .notEmpty()
        .withMessage('Features list is required')
        .isString()
        .withMessage('Features list must be a string'),

    check('stage')
        .optional()
        .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
        .withMessage('Stage must be either DRAFT, PUBLISHED, or ARCHIVED')
];

exports.updateOfferValidator = [
    check('name')
        .optional()
        .isString()
        .withMessage('Offer name must be a string'),

    check('docname')
        .optional()
        .isString()
        .withMessage('Doctor name must be a string'),

    check('pricebefore')
        .optional()
        .isNumeric()
        .withMessage('Original price must be a number')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('Original price must be greater than 0');
            }
            return true;
        }),

    check('priceafter')
        .optional()
        .isNumeric()
        .withMessage('Discounted price must be a number')
        .custom((value, { req }) => {
            if (value <= 0) {
                throw new Error('Discounted price must be greater than 0');
            }
            if (req.body.pricebefore && value >= req.body.pricebefore) {
                throw new Error('Discounted price must be less than original price');
            }
            return true;
        }),

    check('first')
        .optional()
        .isString()
        .withMessage('First feature must be a string'),

    check('second')
        .optional()
        .isString()
        .withMessage('Second feature must be a string'),

    check('third')
        .optional()
        .isString()
        .withMessage('Third feature must be a string'),

    check('fourth')
        .optional()
        .isString()
        .withMessage('Fourth feature must be a string'),

    check('fetures')
        .optional()
        .isString()
        .withMessage('Features list must be a string'),

    check('stage')
        .optional()
        .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
        .withMessage('Stage must be either DRAFT, PUBLISHED, or ARCHIVED')
];

exports.changeStageValidator = [
    check('stage')
        .notEmpty()
        .withMessage('Stage is required')
        .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
        .withMessage('Stage must be either DRAFT, PUBLISHED, or ARCHIVED')
];
