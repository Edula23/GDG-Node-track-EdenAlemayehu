const Joi = require('joi');

const bookSchema = Joi.object({
  title: Joi.string().required().min(1).max(100),
  price: Joi.number().required().min(0).max(1000),
  author: Joi.string().optional().max(50),
  genre: Joi.string().optional().max(30)
});

const validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }
  
  next();
};

module.exports = { validateBook };