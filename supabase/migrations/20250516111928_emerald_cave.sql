-- Create database library if it doesn't exist
CREATE DATABASE IF NOT EXISTS library;

-- Use the library database
USE library;

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  bookid INT AUTO_INCREMENT PRIMARY KEY,
  bookname VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  picture VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  status ENUM('Available', 'Not Available') NOT NULL DEFAULT 'Available'
);

-- Create bookorder table
CREATE TABLE IF NOT EXISTS bookorder (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bookname VARCHAR(255) NOT NULL,
  dateborrowed DATE NOT NULL,
  datetobereturned DATE NOT NULL,
  status ENUM('Returned', 'Not Returned') NOT NULL DEFAULT 'Not Returned'
);

-- Insert sample books
INSERT INTO books (bookname, author, picture, subject, status) VALUES 
('The AI Revolution', 'Dr. Alan Turner', 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg', 'Computer Science', 'Available'),
('Understanding Quantum Physics', 'Sarah Matthews', 'https://images.pexels.com/photos/714699/pexels-photo-714699.jpeg', 'Science', 'Available'),
('Modern Web Development', 'Jennifer Lee', 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg', 'Computer Science', 'Not Available'),
('The Art of Architecture', 'Michael Morrison', 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg', 'Architecture', 'Available'),
('Fundamental Mathematics', 'Robert Johnson', 'https://images.pexels.com/photos/3808/pexels-photo.jpg', 'Mathematics', 'Available'),
('Philosophy of Mind', 'Thomas Wilson', 'https://images.pexels.com/photos/3826690/pexels-photo-3826690.jpeg', 'Philosophy', 'Available'),
('Understanding Human Behavior', 'Dr. Emily Brown', 'https://images.pexels.com/photos/3755755/pexels-photo-3755755.jpeg', 'Psychology', 'Not Available'),
('World War History', 'David Thompson', 'https://images.pexels.com/photos/8555866/pexels-photo-8555866.jpeg', 'History', 'Available'),
('The Cosmos', 'Neil Adams', 'https://images.pexels.com/photos/2166/flight-sky-earth-space.jpg', 'Science', 'Available'),
('Database Systems', 'Maria Garcia', 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg', 'Computer Science', 'Available'),
('Digital Marketing Strategies', 'James Wilson', 'https://images.pexels.com/photos/6205509/pexels-photo-6205509.jpeg', 'Business', 'Available'),
('The Human Mind', 'Patricia Davis', 'https://images.pexels.com/photos/4145350/pexels-photo-4145350.jpeg', 'Psychology', 'Not Available');

-- Insert sample book orders
INSERT INTO bookorder (name, bookname, dateborrowed, datetobereturned, status) VALUES
('John Smith', 'Modern Web Development', '2024-04-01', '2024-04-15', 'Not Returned'),
('Sarah Jones', 'Understanding Human Behavior', '2024-03-25', '2024-04-08', 'Not Returned'),
('Michael Brown', 'Digital Marketing Strategies', '2024-03-20', '2024-04-03', 'Returned'),
('Emily Davis', 'The Human Mind', '2024-03-15', '2024-03-29', 'Not Returned');

-- Update book status based on orders
UPDATE books SET status = 'Not Available' WHERE bookname IN (
  SELECT bookname FROM bookorder WHERE status = 'Not Returned'
);