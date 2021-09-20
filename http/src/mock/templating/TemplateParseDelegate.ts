import { TemplatingContext } from './TemplatingContext'
import { CustomHelper } from './CustomHelper'

export type TemplateParseDelegate = (
  context: TemplatingContext,
  helpers: CustomHelper
) => Promise<string>
