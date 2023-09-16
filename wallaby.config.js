module.exports = function (w) {
  return {
    files: ['src/**/*.ts'],

    tests: ['src/**/*.test.{ts,tsx}'],
    testFramework: 'vitest',
  }
}
