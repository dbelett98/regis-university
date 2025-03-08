/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

// Read in the login.js file from ../js/login.js
const loginScript = fs.readFileSync(path.resolve(__dirname, '../js/login.js'), 'utf8');

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

    // Save originals for alert and location.href.
    originalAlert = window.alert;
    window.alert = jest.fn();

    originalLocationHref = window.location.href;
    // Override window.location.href by deleting window.location and reassigning it.
    delete window.location;
    window.location = { href: '' };

    // Clear localStorage before each test.
    localStorage.clear();

    // Evaluate login.js to register its event listener.
    eval(loginScript);
  });

  afterEach(() => {
    // Restore original alert and window.location.
    window.alert = originalAlert;
    window.location.href = originalLocationHref;
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('successful login submission sets token and redirects to index.html', async () => {
    // Mock fetch to return a successful login response.
    const fakeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Login successful.', token: 'dummy_token' }),
    };
    global.fetch = jest.fn().mockResolvedValue(fakeResponse);

    // Dispatch the submit event on the form.
    const form = document.getElementById('loginForm');
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    // Wait until the asynchronous code resolves.
    await new Promise(process.nextTick);

    // Verify that fetch was called with the proper endpoint.
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/login', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));

    // Expect alert to be shown with the success message.
    expect(window.alert).toHaveBeenCalledWith('Login successful.');
    
    // Verify that the token was stored.
    expect(localStorage.getItem('token')).toBe('dummy_token');
    
    // Verify redirection to "index.html" (per your login.js code).
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

    // Expect an alert with the failure message.
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials.');

    // Token should not be set.
    expect(localStorage.getItem('token')).toBeNull();

    // No redirection should have occurred.
    expect(window.location.href).toBe('');
  });

  test('network error during login alerts generic error', async () => {
    // Simulate a network error.
    global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

    const form = document.getElementById('loginForm');
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    await new Promise(process.nextTick);

    // Expect a generic error alert.
    expect(window.alert).toHaveBeenCalledWith('An error occurred during login.');
  });
});
