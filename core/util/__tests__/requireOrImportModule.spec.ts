import Path from 'path'
import { requireOrImportModule } from '../../interoperability/requireOrImportModule'

describe('requireOrImportModule', function () {
  it('should load typescript file', async function () {
    const fn = await requireOrImportModule<() => string>(
      Path.join(__dirname, '__fixtures__', 'ts-to-load.ts'),
    )

    expect(fn()).toEqual('hey')
  })

  it('should load javascript file', async function () {
    const fn = await requireOrImportModule<() => string>(
      Path.join(__dirname, '__fixtures__', 'js-to-load.js'),
    )

    expect(fn()).toEqual('hey')
  })
})
