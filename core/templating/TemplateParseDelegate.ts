import { Helper } from './Helper.js'

export interface TemplateParseDelegate<M, H extends Helper = Helper> {
  (context: M, helpers: H): Promise<string>
}
