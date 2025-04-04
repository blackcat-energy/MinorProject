const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const listingsRoute = require('./routes/listings');
const auth = require('./middleware/auth');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
    origin: 'http://127.0.0.1:5501', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.static('client')); // Serve static files from client directory

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('Database URL:', process.env.MONGODB_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
  });

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running');
});

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/listings', listingsRoute);
app.use('/api/marketplace/listings', listingsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));