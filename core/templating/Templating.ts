import { TemplateParseDelegate } from './TemplateParseDelegate'
import { Helper } from './Helper'

export interface Templating<M, H extends Helper = Helper> {
  compile(input: string): TemplateParseDelegate<M, H>
}
