const Offer = require('../modules/offerModel');
const ApiError = require('../utils/apiError');

class OfferService {
    // Create a new offer
    async createOffer(offerData) {
        try {
            const offer = await Offer.create(offerData);
            return offer;
        } catch (error) {
            throw new ApiError('Failed to create offer', 400);
        }
    }

    // Get published offer
    async getPublishedOffer() {
        try {
            const offer = await Offer.findOne({ stage: 'PUBLISHED' }).sort({ createdAt: -1 });
            return offer;
        } catch (error) {
            throw new ApiError('Failed to fetch offer', 400);
        }
    }

    // Get all offers
    async getAllOffers() {
        try {
            const offers = await Offer.find().sort({ createdAt: -1 });
            return offers;
        } catch (error) {
            throw new ApiError('Failed to fetch offers', 400);
        }
    }    // Update offer
    async updateOffer(offerId, updateData) {
        try {
            // If courseLink is empty string, set it to null to trigger proper validation
            if (updateData.courseLink === '') {
                updateData.courseLink = null;
            }
            
            const offer = await Offer.findByIdAndUpdate(
                offerId,
                updateData,
                { new: true, runValidators: true }
            );
            if (!offer) {
                throw new ApiError('Offer not found', 404);
            }
            return offer;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApiError('Validation error: Please fill in all required fields', 400);
            }
            throw new ApiError(error.message, error.statusCode || 400);
        }
    }

    // Delete offer
    async deleteOffer(offerId) {
        try {
            const offer = await Offer.findByIdAndDelete(offerId);
            if (!offer) {
                throw new ApiError('Offer not found', 404);
            }
            return offer;
        } catch (error) {
            throw new ApiError(error.message, error.statusCode || 400);
        }
    }

    // Change offer stage
    async changeOfferStage(offerId, stage) {
        try {
            const offer = await Offer.findByIdAndUpdate(
                offerId,
                { stage },
                { new: true, runValidators: true }
            );
            if (!offer) {
                throw new ApiError('Offer not found', 404);
            }
            return offer;
        } catch (error) {
            throw new ApiError(error.message, error.statusCode || 400);
        }
    }
}

module.exports = new OfferService();
