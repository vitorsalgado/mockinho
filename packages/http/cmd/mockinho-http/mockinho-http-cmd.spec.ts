import { spawnSync } from 'child_process'
import Path from 'path'

describe.skip('http cmd', function () {
  it('should init http cli without problems', function (done) {
    const proc = spawnSync('ts-node', [Path.join(__dirname, 'index.ts')])

    setTimeout(() => {
      process.kill(proc.pid)
      done()
    }, 500)
  })
})
