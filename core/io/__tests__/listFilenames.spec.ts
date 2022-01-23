import Path from 'path'
import { listFilenames } from '../index.js'

describe('listFilenames', function () {
  it('should load all file names recursively considering the filter predicated', function () {
    const rootDir = Path.join(__dirname, '__fixtures__')
    const filter = (file: string) => file.indexOf('.txt') > -1

    const files = listFilenames(rootDir, filter)

    expect(files).toHaveLength(7)
    expect(files.some(x => x.indexOf('.json') > -1)).toBeFalsy()
    expect(files.find(x => x.indexOf('/a/a.txt') > -1)).toBeTruthy()
    expect(files.find(x => x.indexOf('/a/1/a1.txt') > -1)).toBeTruthy()
    expect(files.find(x => x.indexOf('/a/1/2/a2.txt') > -1)).toBeTruthy()
    expect(files.find(x => x.indexOf('/a/1/2/3/a3.txt') > -1)).toBeTruthy()
    expect(files.find(x => x.indexOf('/b/b.txt') > -1)).toBeTruthy()
    expect(files.find(x => x.indexOf('/b/1/b1.txt') > -1)).toBeTruthy()
    expect(files.find(x => x.indexOf('/b/2/b2.txt') > -1)).toBeTruthy()
  })
})
