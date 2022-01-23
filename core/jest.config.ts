import type { Config as JestConfig } from '@jest/types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Base from '../jest-base.config'

const config: JestConfig.InitialOptions = {
  ...Base,

  displayName: 'core',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '../tsconfig.test.json',
      useESM: true
    }
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}

export default config
