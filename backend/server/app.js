const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin');
const booksRoutes = require('./routes/books');

app.use(express.json());
app.use('/admin', adminRoutes);
app.use('/', booksRoutes); // for /books endpoint

app.listen(3001, () => console.log('Server running on port 3001'));
