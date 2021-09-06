/* eslint-disable @typescript-eslint/no-var-requires */

import type { Service } from 'ts-node'
import { interopRequireDefault } from './interopRequireDefault'

export async function requireOrImportModule<T>(file: string): Promise<T> {
  const isTs = file.endsWith('.ts')
  const path = file

  if (isTs) {
    return await loadTypeScriptConfigFile(path)
  } else {
    try {
      const required = require(path)
      const interop = interopRequireDefault(required)

      return interop.default
    } catch (ex: any) {
      if (ex.code === 'ERR_REQUIRE_ESM') {
        const imported = await import(path)

        if (!imported.default) {
          throw new Error(
            `Your version of Node does not support dynamic import - please enable it or use a .cjs file extension for file ${path}`
          )
        }

        return imported.default
      }

      throw ex
    }
  }
}

const loadTypeScriptConfigFile = async <T>(file: string): Promise<T> => {
  let registerer: Service

  try {
    registerer = require('ts-node').register({
      compilerOptions: {
        module: 'CommonJS'
      }
    })
  } catch (e: any) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        `'ts-node' is required when configuration is a TypeScript file. Make sure it is installed.\nError: ${e.message}`
      )
    }

    throw e
  }

  registerer.enabled(true)

  const configObject = interopRequireDefault(require(file)).default

  registerer.enabled(false)

  return configObject
}
