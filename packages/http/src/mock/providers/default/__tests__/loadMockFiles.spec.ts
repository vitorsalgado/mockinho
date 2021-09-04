import { fail } from 'assert'
import Path from 'path'
import { loadMockFiles } from '../loadMockFiles'

describe('loadMockFiles', function () {
  it('should load all valid mocks in a directory and its subdirectories excluding invalid ones when throwOnError is false', async function () {
    const mocks = await loadMockFiles(
      Path.join(__dirname, '__fixtures__/qtd'),
      ['.json', '.yaml', '.yml'],
      false
    )

    expect(mocks).toHaveLength(6)
  })

  it('should load only files with the extensions provided', async function () {
    const mocks = await loadMockFiles(
      Path.join(__dirname, '__fixtures__/qtd'),
      ['.yaml', '.yml'],
      false
    )

    expect(mocks).toHaveLength(1)
  })

  it('should return 0 mocks when there is no directory', async function () {
    const mocks = await loadMockFiles(Path.join(__dirname, '__fixtures__/nonexistent'), [
      '.json',
      '.yaml',
      '.yml'
    ])

    expect(mocks).toHaveLength(0)
  })

  it('should return 0 when there directory is empty', async function () {
    const mocks = await loadMockFiles(Path.join(__dirname, '__fixtures__/empty'), [
      '.json',
      '.yaml',
      '.yml'
    ])

    expect(mocks).toHaveLength(0)
  })

  describe('invalid state', function () {
    it('should throw exception when throwOnError is true and some mock files are invalid', async function () {
      try {
        await loadMockFiles(Path.join(__dirname, '__fixtures__/qtd'), ['.json', '.yaml', '.yml'])
      } catch (ex) {
        expect(ex).toBeDefined()
        return
      }

      fail('should not be here.')
    })

    it('should throw error when providing extensions that does not have a parser associated', async function () {
      try {
        await loadMockFiles(Path.join(__dirname, '__fixtures__/qtd'), ['.json', '.yaml', '.md'])
      } catch (ex) {
        expect(ex).toBeDefined()
        return
      }

      fail('should not be here.')
    })
  })
})
