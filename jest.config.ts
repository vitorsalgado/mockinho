import type { Config as JestConfig } from '@jest/types'
import 'dotenv/config'

const config: JestConfig.InitialOptions = {
  verbose: true,
  collectCoverage: false,
  resetModules: true,
  restoreMocks: true,
  projects: ['<rootDir>'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  },
  collectCoverageFrom: [
    '**/**/*.ts',
    '!**/**/*.config.ts',
    '!**/__fixtures__/**',
    '!**/__tests__/**'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '/node_modules/',
    '<rootDir>/scripts',
    '/dist/',
    '<rootDir>/tools',
    '<rootDir>/examples'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '/node_modules/',
    '<rootDir>/scripts',
    '<rootDir>/tools',
    '<rootDir>/examples'
  ],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)']
}

export default config
