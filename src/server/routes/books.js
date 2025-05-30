// routes/admin.js or routes/books.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // your database connection module

// GET all book names
router.get('/books', (req, res) => {
  const query = 'SELECT Name FROM books';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ error: 'Failed to fetch books' });
    }
    res.json(results);
  });
});

module.exports = router;
