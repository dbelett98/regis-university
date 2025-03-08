/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('logout.js', () => {
  let originalLocationHref;
  let logoutScript;

  beforeEach(() => {
    // Set up a dummy DOM with an element with id "logoutBtn"
    document.body.innerHTML = `<button id="logoutBtn">Logout</button>`;

    // Save and override window.location.href to a mutable object
    originalLocationHref = window.location.href;
    // Remove window.location so we can override it in tests
    delete window.location;
    window.location = { href: '' };

    // Set a dummy token in localStorage
    localStorage.setItem('token', 'dummy_token');

    // Read and execute the logout.js code.
    logoutScript = fs.readFileSync(path.resolve(__dirname, '../js/logout.js'), 'utf8');
    eval(logoutScript); // This will register the event listener defined in logout.js
  });

  afterEach(() => {
    // Clean up: restore window.location.href and clear localStorage
    window.location.href = originalLocationHref;
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('clicking logout button removes token and redirects to landing-page.html', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    expect(logoutBtn).toBeTruthy();

    // Simulate a click on the logout button.
    logoutBtn.click();

    // Verify that the token is removed from localStorage.
    expect(localStorage.getItem('token')).toBeNull();

    // Verify that window.location.href is set to '../html/landing-page.html'
    expect(window.location.href).toBe('../html/landing-page.html');
  });
});
