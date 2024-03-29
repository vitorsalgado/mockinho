import type { Config as JestConfig } from '@jest/types'
import 'dotenv/config'
import Base from './jest-base.config'

const config: JestConfig.InitialOptions = {
  ...Base,

  projects: ['<rootDir>'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '../tsconfig.test.json' }] },
  collectCoverageFrom: [
    '**/**/*.ts',
    '!**/**/*.config.ts',
    '!**/__fixtures__/**',
    '!**/__tests__/**',
    '!**/_tests/**',
  ],
}

export default config
