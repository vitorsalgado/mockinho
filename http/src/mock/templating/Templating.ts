import { TemplateParseDelegate } from './TemplateParseDelegate'

export interface Templating {
  compile(input: string): TemplateParseDelegate
}
