let books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 12.99,
    genre: 'Classic'
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 10.50,
    genre: 'Fiction'
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    price: 9.99,
    genre: 'Dystopian'
  }
];

const generateId = () => {
  return books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
};


const getAllBooks = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

const getBookById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    
    if (!book) {
      return res.status(404).json({ 
        error: 'Book not found',
        message: `No book found with ID ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

const createBook = (req, res) => {
  try {
    const newBook = {
      id: generateId(),
      title: req.body.title,
      price: req.body.price,
      author: req.body.author || 'Unknown Author',
      genre: req.body.genre || 'General'
    };
    
    books.push(newBook);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook
};