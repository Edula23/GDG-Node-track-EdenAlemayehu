const { bookSchema } = require('../utils/validationSchema');

const validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
};

module.exports = validateBook;