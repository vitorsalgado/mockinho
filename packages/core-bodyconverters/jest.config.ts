import type { Config as JestConfig } from '@jest/types'
import Base from '../../jest-base.config'

const config: JestConfig.InitialOptions = {
  displayName: 'body-converters',
  globals: {
    'ts-jest': {
      tsconfig: '../../tsconfig.test.json'
    }
  },
  ...Base
}

export default config
