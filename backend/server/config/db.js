import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12782873',
  password: 'F2hvewD9gy', 
  database: 'sql12782873'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database.');
});

export default db;
