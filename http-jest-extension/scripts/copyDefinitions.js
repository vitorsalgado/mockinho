'use strict'

const FsExt = require('fs-extra')
const Path = require('path')

const root = process.cwd()

FsExt.copySync(Path.join(root, 'build', 'index.d.ts'), Path.join(root, 'dist', 'index.d.ts'), {
  overwrite: true
})
