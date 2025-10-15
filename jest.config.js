module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/projects/**/*.spec.ts'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^@shared/ui$': '<rootDir>/projects/shared/src/lib/ui/index.ts',
    '^@shared/utils$': '<rootDir>/projects/shared/src/lib/utils/index.ts'
  }
};
