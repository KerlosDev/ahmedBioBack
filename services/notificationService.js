const Notification = require('../modules/notifictionModel');
const ApiError = require('../utils/apiError');

exports.createNotification = async ({ userId, message }) => {
    try {
        const notification = await Notification.create({
            userId,
            message
        });
        return notification;
    } catch (error) {
        throw new ApiError('Error creating notification', 500);
    }
};

exports.getUserNotifications = async (userId, query = {}) => {
    try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { userId };

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments(filter);

        return {
            notifications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            }
        };
    } catch (error) {
        throw new ApiError('Error fetching notifications', 500);
    }
};

exports.markAsRead = async (userId, notificationId) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            throw new ApiError('Notification not found', 404);
        }

        return notification;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError('Error marking notification as read', 500);
    }
};

exports.markAllAsRead = async (userId) => {
    try {
        const result = await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );
        return result;
    } catch (error) {
        throw new ApiError('Error marking notifications as read', 500);
    }
};

exports.deleteNotification = async (userId, notificationId) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            userId
        });

        if (!notification) {
            throw new ApiError('Notification not found', 404);
        }

        return notification;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError('Error deleting notification', 500);
    }
};

exports.deleteAllNotifications = async (userId) => {
    try {
        const result = await Notification.deleteMany({ userId });
        return result;
    } catch (error) {
        throw new ApiError('Error deleting notifications', 500);
    }
};
