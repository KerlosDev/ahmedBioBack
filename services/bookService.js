const Book = require('../modules/bookModel');
const ApiError = require('../utils/apiError');

exports.getAllBooks = async () => {
    const books = await Book.find();
    return books;
};

exports.getBook = async (bookId) => {
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError('Book not found', 404);
    }
    return book;
};

exports.createBook = async (bookData) => {
    const book = await Book.create(bookData);
    return book;
};

exports.updateBook = async (bookId, bookData) => {
    const book = await Book.findByIdAndUpdate(
        bookId,
        bookData,
        { new: true, runValidators: true }
    );
    if (!book) {
        throw new ApiError('Book not found', 404);
    }
    return book;
};

exports.deleteBook = async (bookId) => {
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
        throw new ApiError('Book not found', 404);
    }
    return book;
};
