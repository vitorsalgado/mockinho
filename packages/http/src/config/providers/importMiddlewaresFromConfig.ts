import { requireOrImportModule } from '@mockinho/core'
import { ConfigBuilder } from '../ConfigBuilder'
import { PreMiddleware } from '../ConfigBuilder'

const SEPARATOR = '|'

export async function importMiddlewaresFromConfig(
  components: Array<string>,
  builder: ConfigBuilder
): Promise<void> {
  for (const component of components) {
    if (component.includes(SEPARATOR)) {
      const values = component.split(SEPARATOR)
      const path = values[0]
      const middleware = await requireOrImportModule<{ default: PreMiddleware }>(values[1])

      builder.use(path, middleware.default)
    } else {
      const middleware = await requireOrImportModule<{ default: PreMiddleware }>(component)

      builder.use(middleware.default)
    }
  }
}
