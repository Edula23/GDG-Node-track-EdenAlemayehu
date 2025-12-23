
let books = [];
let nextId = 1;
const getAllBooks = (req, res) => {
    res.status(200).json(books);
};

const getBookById = (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    
    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }
    
    res.status(200).json(book);
};

const searchBooks = (req, res) => {
    res.status(200).send('You are on the search page');
};

const createBook = (req, res) => {
    const newBook = {
        id: nextId++,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price
    };
    
    books.push(newBook);
    
    res.status(201).json(newBook);
};

const deleteBook = (req, res) => {
    const id = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === id);
    
    if (bookIndex === -1) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }
    books.splice(bookIndex, 1);
    
    res.status(200).json({
        message: 'Book deleted successfully'
    });
};

module.exports = {
    getAllBooks,
    getBookById,
    searchBooks,
    createBook,
    deleteBook
};