import type { Config as JestConfig } from '@jest/types'

const config: JestConfig.InitialOptions = {
  verbose: false,
  collectCoverage: false,
  testTimeout: 24000000,
  resetModules: true,
  restoreMocks: true,
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '../tsconfig.test.json' }] },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '/node_modules/',
    '<rootDir>/scripts',
    '/dist/',
    '<rootDir>/tools',
    '<rootDir>/examples',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '/node_modules/',
    '<rootDir>/scripts',
    '<rootDir>/tools',
    '<rootDir>/examples',
  ],
}

export default config
