import Path from 'path'
import { importModule } from './index.js'

describe('requireOrImportModule', function () {
  it('should load typescript file', async function () {
    const fn = await importModule<() => string>(Path.join(__dirname, '_testdata', 'ts-to-load.ts'))

    expect(fn()).toEqual('hey')
  })

  it('should load javascript file', async function () {
    const fn = await importModule<() => string>(Path.join(__dirname, '_testdata', 'js-to-load.js'))

    expect(fn()).toEqual('hey')
  })
})
