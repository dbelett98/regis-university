// public/js/portal.test.js

const { add, validateServiceRequestForm } = require('./portal');

describe('Utility Functions in portal.js', () => {
  test('add() should return the sum of two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  describe('validateServiceRequestForm()', () => {
    test('should return false if subject is too short', () => {
      const subject = "Hey";
      const description = "This is a valid description.";
      const dueDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // tomorrow
      expect(validateServiceRequestForm(subject, description, dueDate)).toBe(false);
    });

    test('should return false if description is too short', () => {
      const subject = "Valid subject";
      const description = "Too short";
      const dueDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      expect(validateServiceRequestForm(subject, description, dueDate)).toBe(false);
    });

    test('should return false if dueDate is today or past', () => {
      const subject = "Valid subject";
      const description = "This description is sufficiently long.";
      // Using today's date:
      const dueDate = new Date().toISOString().split('T')[0];
      expect(validateServiceRequestForm(subject, description, dueDate)).toBe(false);
    });

    test('should return true for valid inputs', () => {
      const subject = "Valid subject";
      const description = "This description is long enough for a proper test.";
      // Tomorrow's date
      const dueDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      expect(validateServiceRequestForm(subject, description, dueDate)).toBe(true);
    });
  });
});
