const express = require('express');
const router = express.Router();
const offerService = require('../services/offerService');
const { protect, isAllow, isAdmin } = require('../services/authService');
const validatorMiddleware = require('../middleware/validMiddleware');
const {
    createOfferValidator,
    updateOfferValidator,
    changeStageValidator
} = require('../validator/offerValid');

// Public routes
router.get('/published', async (req, res, next) => {
    try {
        const offers = await offerService.getPublishedOffer();
        res.status(200).json({
            status: 'success',
            offers
        });
    } catch (error) {
        next(error);
    }
});

// Protected routes (admin only)
router.use(protect, isAdmin);

router.route('/')
    .get(async (req, res, next) => {
        try {
            // Extract query parameters for filtering
            const { stage, isLimited, endDate } = req.query;
            const filters = {};

            if (stage) {
                filters.stage = stage.toUpperCase();
            }
            if (isLimited !== undefined) {
                filters.isLimited = isLimited === 'true';
            }
            if (endDate) {
                // Filter offers that haven't ended yet
                filters.endDate = { $gte: new Date() };
            }

            const offers = await offerService.getAllOffers(filters);
            res.status(200).json({
                status: 'success',
                results: offers.length,
                offers
            });
        } catch (error) {
            next(error);
        }
    }).post(createOfferValidator, validatorMiddleware, async (req, res, next) => {
        try {
            const offer = await offerService.createOffer(req.body);
            res.status(201).json({
                status: 'success',
                offer
            });
        } catch (error) {
            next(error);
        }
    });

router.route('/:id').patch(updateOfferValidator, validatorMiddleware, async (req, res, next) => {
    try {
        const offer = await offerService.updateOffer(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            offer,
            updatedAt: offer.updatedAt
        });
    } catch (error) {
        next(error);
    }
})
    .delete(async (req, res, next) => {
        try {
            await offerService.deleteOffer(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            next(error);
        }
    });

router.patch('/:id/stage', changeStageValidator, validatorMiddleware, async (req, res, next) => {
    try {
        const offer = await offerService.changeOfferStage(req.params.id, req.body.stage);
        res.status(200).json({
            status: 'success',
            offer,
            message: req.body.stage === 'PUBLISHED' ? 'Offer published successfully. Any previously published offers have been archived.' : `Offer ${req.body.stage.toLowerCase()} successfully.`
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
