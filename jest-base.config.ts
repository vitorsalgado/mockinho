import type { Config as JestConfig } from '@jest/types'

const config: JestConfig.InitialOptions = {
  verbose: true,
  collectCoverage: false,
  restoreMocks: true,
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  globals: {
    'ts-jest': {
      tsconfig: '../../tsconfig.test.json'
    }
  },
  coveragePathIgnorePatterns: ['/dist/', '<rootDit>/dist', '/node_modules/'],
  testPathIgnorePatterns: ['/dist/', '<rootDit>/dist', '/node_modules/']
}

export default config
