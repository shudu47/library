import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'library'
});

// Get all borrowing records
router.get('/', (req, res) => {
  db.query(`
    SELECT bookorder.*, books.Name AS book_name 
    FROM bookorder 
    JOIN books ON bookorder.bookid = books.bookid
  `, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Add new borrowing record
router.post('/', (req, res) => {
  const { student_name, bookid, borrow_date, return_date, status } = req.body;
  console.log(req.body);
  const sql = 'INSERT INTO bookorder (student_name, bookid, borrow_date, return_date, status) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [student_name, bookid, borrow_date, return_date, status], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Borrowing record added successfully' });
  });
});

// Update borrowing record
router.put('/:orderid', (req, res) => {
  const { orderid } = req.params;
  const { student_name, bookid, borrow_date, return_date, status } = req.body;
  const sql = 'UPDATE bookorder SET student_name=?, bookid=?, borrow_date=?, return_date=?, status=? WHERE orderid=?';
  db.query(sql, [student_name, bookid, borrow_date, return_date, status, orderid], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Borrowing record updated successfully' });
  });
});

// Delete borrowing record
router.delete('/:orderid', (req, res) => {
  const { orderid } = req.params;
  db.query('DELETE FROM bookorder WHERE orderid=?', [orderid], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Borrowing record deleted successfully' });
  });
});

export default router;
