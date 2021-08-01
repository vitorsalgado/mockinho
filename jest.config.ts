import type { Config as JestConfig } from '@jest/types'
import 'dotenv/config'

const config: JestConfig.InitialOptions = {
  verbose: true,
  collectCoverage: false,
  restoreMocks: true,
  projects: ['<rootDir>'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  },
  collectCoverageFrom: [
    '**/internal/*/**/*.ts',
    '**/pkg/*/**/*.ts',
    '**/cmd/*/**/*.ts',
    '!**/__fixtures__/**',
    '!**/__tests__/**'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '/node_modules/',
    '<rootDir>/scripts',
    '<rootDir>/tools'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '/node_modules/',
    '<rootDir>/scripts',
    '<rootDir>/tools'
  ],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)']
}

export default config
