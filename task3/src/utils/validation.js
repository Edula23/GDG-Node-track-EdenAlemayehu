const Joi = require('joi');

const bookSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .required()
        .messages({
            'string.min': 'Title must be at least 5 characters long',
            'any.required': 'Title is required'
        }),
    
    author: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'Author must be at least 3 characters long',
            'any.required': 'Author is required'
        }),
    
    price: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.min': 'Price must be 0 or greater',
            'any.required': 'Price is required'
        })
});

module.exports = { bookSchema };