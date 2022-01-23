import { TemplateParseDelegate } from './TemplateParseDelegate.js'
import { Helper } from './Helper.js'

export interface Templating<M, H extends Helper = Helper> {
  compile(input: string): TemplateParseDelegate<M, H>
}
