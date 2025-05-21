const express = require('express');
const { protect, isAdmin } = require('../services/authService');
const {
    createNotification,
    getUserNotifications,
    deleteNotification,
    deleteAllNotifications
} = require('../services/notificationService');

const router = express.Router();

// Protect all routes
router.use(protect);

// Create a new notification
router.post('/', isAdmin, async (req, res) => {
    try {
        const { message } = req.body;
        const notification = await createNotification({
            userId: req.user._id,
            message
        });

        res.status(201).json({
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
});

// Get user notifications with pagination and filters
router.get('/', async (req, res) => {
    try {
        const result = await getUserNotifications(req.user._id, req.query);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete a notification
router.delete('/:notificationId',   isAdmin, async (req, res) => {
    try {
        const notification = await deleteNotification(req.user._id, req.params.notificationId);
        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete all notifications
router.delete('/',  isAdmin, async (req, res) => {
    try {
        const result = await deleteAllNotifications(req.user._id);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
