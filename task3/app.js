const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');

app.use(express.json()); 


app.use('/books', bookRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Bookstore API',
    endpoints: {
      getAllBooks: 'GET /books',
      getBookById: 'GET /books/:id',
      createBook: 'POST /books'
    }
  });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});