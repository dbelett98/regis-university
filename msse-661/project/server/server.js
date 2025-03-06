// server/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

// Create two separate Express apps
const app = express();      // Web server app: serves static files
const apiApp = express();   // API/data service app: handles API endpoints

// Ports
const WEB_PORT = 3000;      // Web server port
const API_PORT = 3001;      // API server port

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for both apps
app.use(cors());
app.use(bodyParser.json());
apiApp.use(cors());
apiApp.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle requests to "/" by serving landing-page.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/landing-page.html'));
});

// Start the web server
app.listen(WEB_PORT, () => {
  console.log(`Web server is running on http://localhost:${WEB_PORT}`);
});

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Promisify pool queries for async/await
const promisePool = pool.promise();

/* ------------------- Authentication Middleware ------------------- */
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

/* ------------------- API Endpoints on apiApp ------------------- */

// Test Database Connection Endpoint
apiApp.get('/test-db-connection', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connection successful.', solution: rows[0].solution });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed.' });
  }
});

// Registration Endpoint
apiApp.post('/register', async (req, res) => {
  const { business_name, username, password } = req.body;
  if (!business_name || business_name.trim().length < 3) {
    return res.status(400).json({ message: 'Business name must be at least 3 characters.' });
  }
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  try {
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
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

// Login Endpoint - Returns a JWT containing user id and username.
apiApp.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Get User Profile Endpoint - Now uses immutable id from token.
apiApp.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await promisePool.query('SELECT business_name, username FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const user = rows[0];
    res.status(200).json({ business_name: user.business_name, username: user.username });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
});

// Update Business Name Endpoint
apiApp.post('/update-business-name', authenticateToken, async (req, res) => {
  const { newBusinessName } = req.body;
  const userId = req.user.id;
  if (!newBusinessName || newBusinessName.trim().length < 3) {
    return res.status(400).json({ message: 'Business name must be at least 3 characters.' });
  }
  try {
    await promisePool.query('UPDATE users SET business_name = ? WHERE id = ?', [newBusinessName.trim(), userId]);
    res.status(200).json({ message: 'Business name updated successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error updating business name.' });
  }
});

// Update Username Endpoint - Issues new token after update.
apiApp.post('/update-username', authenticateToken, async (req, res) => {
  const { newUsername } = req.body;
  const currentUserId = req.user.id;
  if (!newUsername || newUsername.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  }
  try {
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [newUsername.trim()]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken.' });
    }
    await promisePool.query('UPDATE users SET username = ? WHERE id = ?', [newUsername.trim(), currentUserId]);
    const [updatedRows] = await promisePool.query('SELECT * FROM users WHERE id = ?', [currentUserId]);
    const updatedUser = updatedRows[0];
    const newToken = jwt.sign({ id: updatedUser.id, username: updatedUser.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Username updated successfully.', token: newToken });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error updating username.' });
  }
});

// Change Password Endpoint
apiApp.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required.' });
  }
  try {
    const [rows] = await promisePool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect old password.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await promisePool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error changing password.' });
  }
});

// Create Request Endpoint - Inserts a new service request into the requests table.
apiApp.post('/create-request', authenticateToken, async (req, res) => {
  const { subject, description, due_date } = req.body;
  const userId = req.user.id;
  if (!subject || subject.trim().length < 5) {
    return res.status(400).json({ message: 'Subject must be at least 5 characters.' });
  }
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ message: 'Description must be at least 10 characters.' });
  }
  if (!due_date) {
    return res.status(400).json({ message: 'Due date is required.' });
  }
  const selectedDate = new Date(due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate <= today) {
    return res.status(400).json({ message: 'Due date must be in the future.' });
  }
  try {
    // Retrieve the user's business name from the users table using the token's id.
    const [userRows] = await promisePool.query('SELECT business_name FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const businessName = userRows[0].business_name;
    // Insert the new request into the requests table.
    await promisePool.query(
      'INSERT INTO requests (business_name, subject, description, due_date) VALUES (?, ?, ?, ?)',
      [businessName, subject.trim(), description.trim(), due_date]
    );
    res.status(201).json({ message: 'Request created successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error creating request.' });
  }
});

// Get Requests Endpoint - Retrieves all requests for the user's business.
apiApp.get('/get-requests', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    // Retrieve the user's business name.
    const [userRows] = await promisePool.query('SELECT business_name FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const businessName = userRows[0].business_name;
    // Fetch requests for the given business name.
    const [requestsRows] = await promisePool.query(
      'SELECT id, subject, uploaded_date FROM requests WHERE business_name = ? ORDER BY uploaded_date DESC',
      [businessName]
    );
    res.status(200).json(requestsRows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching requests.' });
  }
});

// Start the API server
apiApp.listen(API_PORT, () => {
  console.log(`Data service is running on http://localhost:${API_PORT}`);
});
