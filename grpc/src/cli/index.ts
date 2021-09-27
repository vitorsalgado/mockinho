/* eslint-disable no-console */

import Path from 'path'
import { mockRpc } from '../mockRpc'
import { options } from '../config/options'

mockRpc(options().protoDirectories(Path.join(__dirname, '../', '__tests__', 'proto')))
  .start()
  .then(x => console.log('connected:', x))
  .catch(console.error)
