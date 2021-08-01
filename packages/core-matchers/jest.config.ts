import type { Config as JestConfig } from '@jest/types'
import Base from '../../jest-base.config'

const config: JestConfig.InitialOptions = {
  displayName: 'matchers',
  globals: {
    'ts-jest': {
      tsconfig: '../../tsconfig.test.json'
    }
  },
  ...Base
}

export default config
