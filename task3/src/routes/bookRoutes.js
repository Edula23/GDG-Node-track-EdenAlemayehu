const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const validateBook = require('../middleware/validateBook');
router.get('/search', bookController.searchBooks);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', validateBook, bookController.createBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;