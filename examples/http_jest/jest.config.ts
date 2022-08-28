import type { Config as JestConfig } from '@jest/types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Base from '../../jest-base.config'

const config: JestConfig.InitialOptions = {
  ...Base,
  displayName: 'example-http-jest',
  globals: {
    'ts-jest': {
      tsconfig: '../../tsconfig.test.json',
    },
  },
  testEnvironment: './node_modules/@mockdog/http-jest/dist/index.js',
}

export default config
