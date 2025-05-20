const express = require('express');
const router = express.Router();
const bookService = require('../services/bookService');
const { protect, isAllow, isAdmin } = require('../services/authService');


// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get a specific book
router.get('/:id', async (req, res) => {
    try {
        const book = await bookService.getBook(req.params.id);
        res.json(book);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Create a new book (admin only)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const book = await bookService.createBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update a book (admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const book = await bookService.updateBook(req.params.id, req.body);
        res.json(book);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Delete a book (admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        await bookService.deleteBook(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
