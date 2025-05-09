class ApirError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent constructor with the message
        this.statusCode = statusCode; // Set the status code
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Determine if the status is a fail or error
        this.isOperational = true; // Set operational flag to true 
    }
}

module.exports = ApirError; // Export the ApirError class for use in other modules