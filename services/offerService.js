const Offer = require('../modules/offerModel');
const ApiError = require('../utils/apiError');

class OfferService {
    // Create a new offer
    async createOffer(offerData) {
        try {
            // Calculate discount percentage if not provided
            if (!offerData.discountPercentage && offerData.originalPrice && offerData.discountPrice) {
                offerData.discountPercentage = Math.round(((offerData.originalPrice - offerData.discountPrice) / offerData.originalPrice) * 100);
            }

            // Ensure features is an array
            if (typeof offerData.features === 'string') {
                offerData.features = offerData.features.split(',').map(f => f.trim());
            }

            // Set default end date if not provided (24 hours from now)
            if (!offerData.endDate) {
                offerData.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            }

            // Ensure courseLinks is an array
            if (offerData.courseLinks && !Array.isArray(offerData.courseLinks)) {
                offerData.courseLinks = [offerData.courseLinks];
            }

            // Update courses count based on courseLinks
            if (offerData.courseLinks) {
                offerData.courses = offerData.courseLinks.length;
            }

            const offer = await Offer.create(offerData);
            return offer;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApiError(`Validation error: ${error.message}`, 400);
            }
            throw new ApiError('Failed to create offer', 400);
        }
    }    // Get published offers
    async getPublishedOffer() {
        try {
            const offers = await Offer.find({ stage: 'PUBLISHED' })
                .populate('courseLinks', 'name description imageUrl price')
                .sort({ createdAt: -1 })
                .select('-__v');
            return offers;
        } catch (error) {
            throw new ApiError('Failed to fetch offers', 400);
        }
    }

    // Get all offers
    async getAllOffers() {
        try {
            const offers = await Offer.find()
                .populate('courseLinks', 'name description imageUrl price')
                .sort({ createdAt: -1 })
                .select('-__v');
            return offers;
        } catch (error) {
            throw new ApiError('Failed to fetch offers', 400);
        }
    }

    // Update offer
    async updateOffer(offerId, updateData) {
        try {
            // Handle features array
            if (typeof updateData.features === 'string') {
                updateData.features = updateData.features.split(',').map(f => f.trim());
            }

            // Recalculate discount percentage if prices changed
            if ((updateData.originalPrice || updateData.discountPrice) && !updateData.discountPercentage) {
                const currentOffer = await Offer.findById(offerId);
                const originalPrice = updateData.originalPrice || currentOffer.originalPrice;
                const discountPrice = updateData.discountPrice || currentOffer.discountPrice;
                updateData.discountPercentage = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
            }

            const offer = await Offer.findByIdAndUpdate(
                offerId,
                updateData,
                { new: true, runValidators: true }
            ).select('-__v');

            if (!offer) {
                throw new ApiError('Offer not found', 404);
            }
            return offer;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApiError(`Validation error: ${error.message}`, 400);
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
    }    // Change offer stage
    async changeOfferStage(offerId, stage) {
        try {
            // If publishing an offer, archive any other published offer for the same section
            if (stage === 'PUBLISHED') {
                const offerToPublish = await Offer.findById(offerId);
                if (!offerToPublish) {
                    throw new ApiError('Offer not found', 404);
                }

                await Offer.updateMany(
                    {
                        _id: { $ne: offerId },
                        section: offerToPublish.section,
                        stage: 'PUBLISHED'
                    },
                    { stage: 'ARCHIVED' }
                );
            }

            const offer = await Offer.findByIdAndUpdate(
                offerId,
                { stage },
                { new: true, runValidators: true }
            ).select('-__v');

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
