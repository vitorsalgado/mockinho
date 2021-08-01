import { PathLike, readdirSync, statSync } from 'fs'
import { resolve } from 'path'

/**
 * Recursively get all file names inside a directory
 *
 * @param rootDir - base directory to start the search
 * @param filter - filter function applied in all file names
 * @param acc - accumulator. you don't need to provide this parameter
 *
 * @returns array containing all file names
 */
export const listFilenames = (
  rootDir: string,
  filter: (file: string) => boolean,
  acc: string[] = []
): string[] =>
  readdirSync(rootDir)
    .map(directory => resolve(rootDir, directory))
    .map(file => {
      if (isDirectory(file)) {
        return acc.concat(listFilenames(file, filter, acc))
      }

      return filter(file) ? acc.concat(file) : acc
    })
    .reduce((a, b) => a.concat(b))

const isDirectory = (value: PathLike) => statSync(value).isDirectory()
