import Path from 'path'
import { importModule } from '@mockdog/x'
import { Plugin } from '@mockdog/core'
import { HttpConfigurationBuilder } from '../HttpConfigurationBuilder.js'

export async function importPlugins(
  components: Array<string>,
  builder: HttpConfigurationBuilder,
  rootDir: string,
): Promise<void> {
  await Promise.all(
    components.map(component => {
      const path = Path.isAbsolute(component) ? component : Path.join(rootDir, component)
      return importModule<Plugin<unknown>>(path)
    }),
  ).then(plugins => builder.plugin(...plugins))
}
