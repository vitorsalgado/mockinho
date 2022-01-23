import FsExt from 'fs-extra'
import Path from 'path'

const root = process.cwd()

FsExt.copySync(Path.join(root, 'build', 'index.d.ts'), Path.join(root, 'dist', 'index.d.ts'), {
  overwrite: true
})
