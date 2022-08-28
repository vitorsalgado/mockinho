import { Stats } from 'fs'
import Chokidar from 'chokidar'
import { WatchOptions } from 'chokidar'
import { FSWatcher } from 'chokidar'

export function watcher(
  path: string,
  options: WatchOptions,
  onAdd: (path: string, stats: Stats | undefined) => void,
  onChange: (path: string, stats: Stats | undefined) => void,
): FSWatcher {
  return Chokidar.watch(path, options)
    .on('add', onAdd)
    .on('unlink', onChange)
    .on('change', onChange)
}
