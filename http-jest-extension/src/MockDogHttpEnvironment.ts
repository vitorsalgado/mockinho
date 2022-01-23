/* eslint-disable no-console */

import NodeEnvironment from 'jest-environment-node'
import { red } from 'colorette'
import { initialOptionsReader } from '@mockdog/http'
import { envReader } from '@mockdog/http'
import { opts } from '@mockdog/http'
import { mockHttp } from '@mockdog/http'
import { MockDogHttp } from '@mockdog/http'

export class MockDogHttpEnvironment extends NodeEnvironment {
  async setup(): Promise<void> {
    await super.setup()

    const builder = opts().enableFileMocks().dynamicHttpPort().verbose()
    const configurationProviders = [initialOptionsReader(process.cwd()), envReader(process.env)]

    for (const provider of configurationProviders) {
      await provider(builder)
    }

    this.global.mockhttp = mockHttp(builder)

    await (this.global.mockhttp as MockDogHttp).start()
  }

  async teardown(): Promise<void> {
    try {
      await (this.global.mockhttp as MockDogHttp).finalize()
    } catch (e) {
      const error = e as Error

      console.error(red('Failed to finalize MockDog HTTP instance. Reason: ' + error.message))
      console.error(error)
    } finally {
      await super.teardown()
    }
  }
}
