const express = require('express');
const morgan = require('morgan');
const bookRoutes = require('./routes/bookRoutes');
const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/books', bookRoutes);

app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!'
    });
});

module.exports = app;