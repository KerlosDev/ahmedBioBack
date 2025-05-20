const express = require('express');
const router = express.Router();
const bookOrderService = require('../services/bookOrderService');
const { protect, isAllow, isAdmin } = require('../services/authService');

// Get all orders (admin only)
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const orders = await bookOrderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get order statistics (admin only)
router.get('/stats', protect, isAdmin, async (req, res) => {
    try {
        const stats = await bookOrderService.getOrderStats();
        res.json(stats);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get a specific order
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await bookOrderService.getOrder(req.params.id);
        // Check if the user is admin or the order belongs to them
        if (req.user.role !== 'admin' && order.userId !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not authorized to view this order'
            });
        }
        res.json(order);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Create a new order
router.post('/', protect, async (req, res) => {
    try {
        const id = req.user._id;
        const orderData = {
            ...req.body,
            userId: id,
        };
        const order = await bookOrderService.createOrder(orderData);
        res.status(201).json(order);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update order status (admin only)
router.patch('/:id/status', protect, isAdmin, async (req, res) => {
    try {
        const order = await bookOrderService.updateOrderStatus(req.params.id, req.body.status);
        res.json(order);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
