/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the contents of your login.js file as a string.
// Adjust the path if needed.
const loginScript = fs.readFileSync(path.resolve(__dirname, 'login.js'), 'utf8');

describe('Login Form Submission', () => {
  let originalAlert;
  let originalLocationHref;

  beforeEach(() => {
    // Set up a dummy login form in the document body.
    document.body.innerHTML = `
      <form id="loginForm">
         <input type="text" id="username" value="testuser" />
         <input type="password" id="password" value="TestPass123" />
         <button type="submit">Login</button>
      </form>
    `;

    // Save original alert and location.href, then override them
    originalAlert = window.alert;
    window.alert = jest.fn();

    // Override window.location.href—create a stub object.
    originalLocationHref = window.location.href;
    delete window.location;
    window.location = { href: '' };

    // Clear localStorage before each test.
    localStorage.clear();

    // Evaluate login.js so that its event listener is registered.
    eval(loginScript);
  });

  afterEach(() => {
    // Restore originals.
    window.alert = originalAlert;
    window.location.href = originalLocationHref;
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('successful login submission sets token and redirects', async () => {
    // Mock fetch to return a successful login response.
    const fakeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Login successful.', token: 'dummy_token' }),
    };
    global.fetch = jest.fn().mockResolvedValue(fakeResponse);

    // Simulate form submission.
    const form = document.getElementById('loginForm');
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    // Wait until the asynchronous code is complete.
    await new Promise(process.nextTick);

    // Verify fetch was called with correct endpoint and options.
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/login', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));

    // Expect alert to be shown confirming success.
    expect(window.alert).toHaveBeenCalledWith('Login successful.');

    // Check that the token was set in localStorage.
    expect(localStorage.getItem('token')).toBe('dummy_token');

    // Check that the window location is changed to "index.html" as stated in your login.js.
    expect(window.location.href).toBe('index.html');
  });

  test('failed login submission alerts error message', async () => {
    // Mock fetch to return a failed login response.
    const fakeResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Invalid credentials.' }),
    };
    global.fetch = jest.fn().mockResolvedValue(fakeResponse);

    const form = document.getElementById('loginForm');
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    await new Promise(process.nextTick);

    // Ensure the alert is called with the error message.
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials.');
    // Token should not be set in localStorage.
    expect(localStorage.getItem('token')).toBeNull();
    // Location.href should remain unchanged.
    expect(window.location.href).toBe('');
  });

  test('network error during login alerts error', async () => {
    // Simulate network error for fetch.
    global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

    const form = document.getElementById('loginForm');
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    await new Promise(process.nextTick);

    // Expect alert to be called with a general error message.
    expect(window.alert).toHaveBeenCalledWith('An error occurred during login.');
  });
});
