const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateBook } = require('../utils/validation');

router.get('/', bookController.getAllBooks);


router.get('/:id', bookController.getBookById);


router.post('/', validateBook, bookController.createBook);

module.exports = router;