export default () => {
  return {
    files: [
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.vue',
      '!src/**/*.test.tsx',
      '!src/**/*.cy.ts',
      '!src/**/*.cy.tsx',
      '!src/**/*.test.ts',
      '!node_modules/**',
    ],
    tests: ['./src/**/*.test.ts', './src/**/*.test.tsx', '!node_modules/**'],
    env: {
      runner: 'node',
      params: {
        env: 'test=test',
      },
    },
    runMode: 'onsave',
    autoDetect: ['vitest'],
  }
}
