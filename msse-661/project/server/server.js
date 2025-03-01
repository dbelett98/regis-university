// set up
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Registration Endpoint
// server/server.js
const bcrypt = require('bcrypt');

let users = []; // In-memory user storage (replace with database in production)

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});
