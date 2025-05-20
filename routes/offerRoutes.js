const express = require('express');
const router = express.Router();
const offerService = require('../services/offerService');
const { protect, isAllow } = require('../services/authService');
const validaorMiddlewere = require('../middleware/validMiddleware');
const {
    createOfferValidator,
    updateOfferValidator,
    changeStageValidator
} = require('../validator/offerValid');

// Public routes
router.get('/published', async (req, res, next) => {
    try {
        const offer = await offerService.getPublishedOffer();
        res.status(200).json({
            status: 'success',
            offer
        });
    } catch (error) {
        next(error);
    }
});

// Protected routes (admin only)
router.use(protect);

router.route('/')
    .get(async (req, res, next) => {
        try {
            const offers = await offerService.getAllOffers();
            res.status(200).json({
                status: 'success',
                results: offers.length,
                offers
            });
        } catch (error) {
            next(error);
        }
    }).post(createOfferValidator, validaorMiddlewere, async (req, res, next) => {
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

router.route('/:id').patch(updateOfferValidator, validaorMiddlewere, async (req, res, next) => {
    try {
        const offer = await offerService.updateOffer(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            offer
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

router.patch('/:id/stage', changeStageValidator, validaorMiddlewere, async (req, res, next) => {
    try {
        const offer = await offerService.changeOfferStage(req.params.id, req.body.stage);
        res.status(200).json({
            status: 'success',
            offer
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
