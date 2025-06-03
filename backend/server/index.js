import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create database pool
const pool = mysql.createPool(dbConfig);

// Database connection test
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In a real app, verify against database
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { username, role: 'admin' },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );
      return res.json({ token });
    }
    
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

// Public API routes
app.get('/api/books/featured', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY RAND() LIMIT 6');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching featured books:', error);
    res.status(500).json({ message: 'Error fetching featured books' });
  }
});

app.get('/api/books/search', async (req, res) => {
  try {
    const { q, subject, status } = req.query;
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];
    
    if (q) {
      query += ' AND (bookname LIKE ? OR author LIKE ? OR subject LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    
    if (subject) query += ' AND subject = ?';
    if (status) query += ' AND status = ?';
    
    query += ' ORDER BY bookname ASC';
    const [rows] = await pool.query(query, [...params, subject, status].filter(Boolean));
    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE bookid = ?', [req.params.id]);
    rows.length ? res.json(rows[0]) : res.status(404).json({ message: 'Book not found' });
  } catch (error) {
    console.error('Book details error:', error);
    res.status(500).json({ message: 'Error fetching book details' });
  }
});

// Admin API routes
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM books) as totalBooks,
        (SELECT COUNT(*) FROM books WHERE status = 'Available') as availableBooks,
        (SELECT COUNT(*) FROM bookorder WHERE status = 'Not Returned') as borrowedBooks,
        (SELECT COUNT(*) FROM bookorder WHERE status = 'Not Returned' AND datetobereturned < CURDATE()) as overdueBooks
    `);
    res.json(stats[0]);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error loading dashboard' });
  }
});

// Books management
app.get('/api/admin/books', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY bookname ASC');
    res.json(rows);
  } catch (error) {
    console.error('Books fetch error:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

app.post('/api/admin/books', authenticateToken, async (req, res) => {
  try {
    const { bookname, author, subject, picture, status } = req.body;
    if (!bookname || !author || !subject || !picture || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO books (bookname, author, subject, picture, status) VALUES (?, ?, ?, ?, ?)',
      [bookname, author, subject, picture, status]
    );
    
    res.status(201).json({ message: 'Book added', bookid: result.insertId });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Error adding book' });
  }
});

// Borrowing records management
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT bo.*, 
        DATEDIFF(bo.datetobereturned, CURDATE()) as daysRemaining,
        CASE 
          WHEN bo.status = 'Returned' THEN 'Returned'
          WHEN DATEDIFF(bo.datetobereturned, CURDATE()) < 0 THEN 'Overdue'
          ELSE 'Not Returned'
        END as displayStatus
      FROM bookorder bo
      ORDER BY bo.dateborrowed DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

app.post('/api/admin/orders', authenticateToken, async (req, res) => {
  try {
    const {  name, bookname, dateborrowed, datetobereturned } = req.body;
    
    // Validate required fields
    if (!name || !bookname || !dateborrowed || !datetobereturned) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Check book availability
      const [book] = await connection.query(
        'SELECT * FROM books WHERE bookname = ? AND status = "Available" FOR UPDATE',
        [bookname]
      );

      if (book.length === 0) {
        throw new Error('Book not available');
      }

      // 2. Create borrowing record
      const [result] = await connection.query(
        'INSERT INTO bookorder (name, bookname, dateborrowed, datetobereturned, status) VALUES (?, ?, ?, ?, "Not Returned")',
        [name, bookname, dateborrowed, datetobereturned]
      );

      // 3. Update book status
      await connection.query(
        'UPDATE books SET status = "Not Available" WHERE bookname = ?',
        [bookname]
      );

      await connection.commit();
      res.status(201).json({ 
        message: 'Borrowing record created',
        orderId: result.insertId 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ 
      message: error.message || 'Error creating borrowing record' 
    });
  }
});

app.patch('/api/admin/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Get the book name from the order
      const [order] = await connection.query(
        'SELECT bookname FROM bookorder WHERE id = ?',
        [req.params.id]
      );

      if (order.length === 0) {
        throw new Error('Order not found');
      }

      // 2. Update order status
      await connection.query(
        'UPDATE bookorder SET status = ? WHERE id = ?',
        [status, req.params.id]
      );

      // 3. Update book status if returned
      if (status === 'Returned') {
        await connection.query(
          'UPDATE books SET status = "Available" WHERE bookname = ?',
          [order[0].bookname]
        );
      }

      await connection.commit();
      res.json({ message: 'Order updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update order error:', error);
    res.status(400).json({ 
      message: error.message || 'Error updating order' 
    });
  }
});

// Server startup
app.listen(PORT, async () => {
  await testDbConnection();
  console.log(`Server running on port ${PORT}`);
});