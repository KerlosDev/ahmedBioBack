const BookOrder = require('../modules/bookOrderModel');
const Book = require('../modules/bookModel');
const ApiError = require('../utils/apiError');

exports.getAllOrders = async () => {
    const orders = await BookOrder.find();
    return orders;
};

exports.getOrder = async (orderId) => {
    const order = await BookOrder.findById(orderId).populate('books.bookId');
    if (!order) {
        throw new ApiError('Order not found', 404);
    }
    return order;
};

exports.createOrder = async (orderData) => {
    // Calculate total price
    let totalPrice = 0;
    for (const item of orderData.books) {
        const book = await Book.findById(item.bookId);
        if (!book) {
            throw new ApiError(`Book with ID ${item.bookId} not found`, 404);
        }
        totalPrice += book.price * item.quantity;
    }

    const order = await BookOrder.create({
        ...orderData,
        totalPrice
    });

    return order;
};

exports.updateOrderStatus = async (orderId, status) => {
    const order = await BookOrder.findByIdAndUpdate(
        orderId,
        { status },
        { new: true, runValidators: true }
    ).populate('books.bookId');

    if (!order) {
        throw new ApiError('Order not found', 404);
    }

    return order;
};

exports.getOrderStats = async () => {
    const stats = await BookOrder.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalPrice' }
            }
        }
    ]);

    const formattedStats = {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        totalAmount: 0
    };

    stats.forEach(stat => {
        formattedStats[stat._id] = stat.count;
        formattedStats.total += stat.count;
        formattedStats.totalAmount += stat.totalAmount;
    });

    return formattedStats;
};
