// server/controllers/bookController.js
import db from '../config/db.js';

// Get all books
export const getBooks = (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
};

// Add a new book
export const addBook = (req, res) => {
  const { Name, author, status } = req.body;
  db.query('INSERT INTO books (Name, author, status) VALUES (?, ?, ?)', [Name, author, status], (err, result) => {
    if (err) {
      console.error('Error adding book:', err);
      return res.status(500).json({ error: 'Failed to add book' });
    }
    res.status(201).json({ message: 'Book added successfully' });
  });
};

// Update a book
export const updateBook = (req, res) => {
  const { id } = req.params;
  const { Name, author, status } = req.body;
  db.query(
    'UPDATE books SET Name = ?, author = ?, status = ? WHERE bookid = ?',
    [Name, author, status, id],
    (err, result) => {
      if (err) {
        console.error('Error updating book:', err);
        return res.status(500).json({ error: 'Failed to update book' });
      }
      res.status(200).json({ message: 'Book updated successfully' });
    }
  );
};

// Delete a book
export const deleteBook = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM books WHERE bookid = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting book:', err);
      return res.status(500).json({ error: 'Failed to delete book' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  });
};
