import { MockDogHttp } from '../../MockDogHttp'

describe('cli cmd', function () {
  it('should execute without errors', async function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.exit = jest.fn()
    process.argv.push('-h')

    const module = await import('../index.js')
    const cli = (await module.default) as MockDogHttp

    expect(cli).toBeDefined()

    await cli.finalize()
  }, 10000)
})
