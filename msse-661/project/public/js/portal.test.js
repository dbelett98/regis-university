// public/js/portal.test.js

const { add } = require('./portal'); // Adjust the relative path if needed

describe('add function', () => {
  test('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });
});
