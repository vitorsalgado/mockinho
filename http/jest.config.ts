import type { Config as JestConfig } from '@jest/types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Base from '../jest-base.config'

const config: JestConfig.InitialOptions = {
  ...Base,
  displayName: 'http'
}

export default config
