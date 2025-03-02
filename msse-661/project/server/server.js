// server/server.js
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Promisify pool queries for async/await
const promisePool = pool.promise();

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, password, business_name } = req.body;

  // Validate inputs
  if (!username || !password || !business_name) {
    return res.status(400).json({ message: 'Username, password, and business name are required.' });
  }

  try {
    // Check if user exists
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await promisePool.query(
      'INSERT INTO users (business_name, username, password) VALUES (?, ?, ?)',
      [business_name, username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate inputs
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Find user
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const user = rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Generate token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Change Password Endpoint
app.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user.username;

  // Validate inputs
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required.' });
  }

  try {
    // Find user
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const user = rows[0];

    // Verify old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect old password.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await promisePool.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error changing password.' });
  }
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid access token.' });
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//test database connection
app.get('/test-db-connection', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connection successful.', solution: rows[0].solution });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed.' });
  }
});
