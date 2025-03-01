//  creating server script

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Web server is running at http://localhost:${PORT}`);
});


//updating to include login functionality

const jwt = require('jsonwebtoken');

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Compare passwords
  try {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});
