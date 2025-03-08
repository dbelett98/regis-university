/**
 * @jest-environment jsdom
 */

describe('../js/auth.js', () => {
    // Save original alert and location properties to restore later.
    const originalAlert = window.alert;
    const originalLocation = window.location;
  
    beforeEach(() => {
      // Clear localStorage before each test.
      localStorage.clear();
      
      // Override alert with a jest mock function.
      window.alert = jest.fn();
  
      // Override window.location.href.
      // We first delete window.location to allow us to redefine it.
      delete window.location;
      window.location = { href: '' };
  
      // Reset modules so that re-importing auth.js runs its code fresh.
      jest.resetModules();
    });
  
    afterEach(() => {
      // Restore original properties.
      window.alert = originalAlert;
      window.location = originalLocation;
      localStorage.clear();
    });
  
    test('should alert and redirect when no token is present', () => {
      // Ensure localStorage is empty.
      expect(localStorage.getItem('token')).toBeNull();
  
      // Require auth.js so that its DOMContentLoaded listener is registered.
      require('./auth'); // Adjust the path if needed.
  
      // Dispatch the DOMContentLoaded event to trigger the listener in auth.js.
      document.dispatchEvent(new Event('DOMContentLoaded'));
  
      // Check that alert was called with the expected message.
      expect(window.alert).toHaveBeenCalledWith('You must be logged in to access this page.');
      // Check that window.location.href was changed.
      expect(window.location.href).toBe('../html/register.html');
    });
  
    test('should not redirect when a token is present', () => {
      // Insert a dummy token.
      localStorage.setItem('token', 'dummy_token');
  
      // Reset modules and require auth.js to trigger the listener.
      jest.resetModules();
      require('./auth');
  
      // Dispatch the event.
      document.dispatchEvent(new Event('DOMContentLoaded'));
  
      // Check that alert was not called.
      expect(window.alert).not.toHaveBeenCalled();
      // Ensure window.location.href has not changed.
      expect(window.location.href).toBe('');
    });
  });
  