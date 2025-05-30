const express = require('express');
const router = express.Router();
const db = require('../db');

// Utility to calculate remaining days
function calculateRemainingDays(returnDateStr) {
  const returnDate = new Date(returnDateStr);
  const today = new Date();
  const diffTime = returnDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// POST: Add new borrowing record
router.post('/orders', (req, res) => {
  const { name, bookname, dateborrowed, datetobereturned, status } = req.body;

  // Validate required fields
  if (!name || !bookname || !dateborrowed || !datetobereturned || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Step 1: Check if the book exists
  db.query('SELECT * FROM books WHERE Name = ?', [bookname], (err, books) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found in library' });
    }

    // Step 2: Check for duplicate unreturned entry
    const duplicateCheckQuery = `
      SELECT * FROM bookorder 
      WHERE name = ? AND bookname = ? AND status = 'Not Returned'
    `;
    db.query(duplicateCheckQuery, [name, bookname], (err, duplicates) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Server error during duplicate check' });
      }

      if (duplicates.length > 0) {
        return res.status(409).json({ error: 'Student has already borrowed this book and not returned it' });
      }

      // Step 3: Insert new borrowing record
      const insertQuery = `
        INSERT INTO bookorder (name, bookname, dateborrowed, datetobereturned, status)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [name, bookname, dateborrowed, datetobereturned, status];

      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Failed to add record' });
        }

        const daysRemaining = calculateRemainingDays(datetobereturned);

        return res.status(201).json({
          message: 'Record added successfully',
          record: {
            id: result.insertId,
            name,
            bookname,
            dateborrowed,
            datetobereturned,
            status,
            daysRemaining,
            isOverdue: daysRemaining < 0 && status.toLowerCase() === 'not returned'
          }
        });
      });
    });
  });
});

module.exports = router;
