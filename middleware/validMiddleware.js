const { validationResult } = require("express-validator");

const validaorMiddlewere = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // Call the next middleware if validation passes
}

module.exports = validaorMiddlewere;