import { requireOrImportModule } from '@mockinho/core'
import { ConfigurationBuilder } from '../ConfigurationBuilder'
import { Middleware } from '../Middleware'

const SEPARATOR = '|'

export async function importMiddlewares(
  components: Array<string>,
  builder: ConfigurationBuilder
): Promise<void> {
  for (const component of components) {
    if (component.includes(SEPARATOR)) {
      const values = component.split(SEPARATOR)
      const path = values[0]
      const middleware = await requireOrImportModule<{ default: Middleware }>(values[1])

      builder.use(path, middleware.default)
    } else {
      const middleware = await requireOrImportModule<{ default: Middleware }>(component)

      builder.use(middleware.default)
    }
  }
}
