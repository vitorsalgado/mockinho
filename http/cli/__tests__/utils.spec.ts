import { printErrorAndExit } from '../utils'

describe('cli utils', function () {
  it('should print error and exit', function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.exit = jest.fn()

    jest.spyOn(console, 'error')

    printErrorAndExit('message')

    expect(process.exit).toHaveBeenCalledWith(1)
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled()
  })
})
