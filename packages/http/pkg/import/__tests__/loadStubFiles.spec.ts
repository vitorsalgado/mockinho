import { fail } from 'assert'
import Path from 'path'
import { loadStubFiles } from '../loadStubFiles'

describe('loadStubFiles', function () {
  it('should load all valid stubs in a directory and its subdirectories excluding invalid ones when throwOnError is false', async function () {
    const stubs = await loadStubFiles(
      Path.join(__dirname, '__fixtures__/qtd'),
      Path.join(__dirname, '__fixtures__/__content__'),
      ['.json', '.yaml', '.yml'],
      false
    )

    expect(stubs).toHaveLength(6)
  })

  it('should load only files with the extensions provided', async function () {
    const stubs = await loadStubFiles(
      Path.join(__dirname, '__fixtures__/qtd'),
      Path.join(__dirname, '__fixtures__/__content__'),
      ['.yaml', '.yml'],
      false
    )

    expect(stubs).toHaveLength(1)
  })

  it('should return 0 stubs when there is no directory', async function () {
    const stubs = await loadStubFiles(
      Path.join(__dirname, '__fixtures__/nonexistent'),
      Path.join(__dirname, '__fixtures__/__content__'),
      ['.json', '.yaml', '.yml']
    )

    expect(stubs).toHaveLength(0)
  })

  it('should return 0 when there directory is empty', async function () {
    const stubs = await loadStubFiles(
      Path.join(__dirname, '__fixtures__/empty'),
      Path.join(__dirname, '__fixtures__/__content__'),
      ['.json', '.yaml', '.yml']
    )

    expect(stubs).toHaveLength(0)
  })

  describe('invalid state', function () {
    it('should throw exception when throwOnError is true and some stub files are invalid', async function () {
      try {
        await loadStubFiles(
          Path.join(__dirname, '__fixtures__/qtd'),
          Path.join(__dirname, '__fixtures__/__content__'),
          ['.json', '.yaml', '.yml']
        )
      } catch (ex) {
        expect(ex).toBeDefined()
        return
      }

      fail('should not be here.')
    })

    it('should throw error when providing extensions that does not have a parser associated', async function () {
      try {
        await loadStubFiles(
          Path.join(__dirname, '__fixtures__/qtd'),
          Path.join(__dirname, '__fixtures__/__content__'),
          ['.json', '.yaml', '.md']
        )
      } catch (ex) {
        expect(ex).toBeDefined()
        return
      }

      fail('should not be here.')
    })
  })
})
