import Path from 'path'
import { requireOrImportModule } from '@mockinho/core'
import { ConfigurationBuilder } from '../ConfigurationBuilder'
import { Plugin } from '../../Plugin'

export async function importPlugins(
  components: Array<string>,
  builder: ConfigurationBuilder,
  rootDir: string
): Promise<void> {
  await Promise.all(
    components.map(component => {
      const path = Path.isAbsolute(component) ? component : Path.join(rootDir, component)
      return requireOrImportModule<Plugin<unknown>>(path)
    })
  ).then(plugins => builder.plugin(...plugins))
}
